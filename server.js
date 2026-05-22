require('dotenv').config();

const express    = require('express');
const fs         = require('fs/promises');
const fsSync     = require('fs');
const path       = require('path');
const multer     = require('multer');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const app        = express();
const port       = process.env.PORT || 3000;
const dataDir    = path.join(__dirname, 'data');
const tempDir    = path.join(dataDir, 'temp');
const ordersFile = path.join(dataDir, 'orders.jsonl');
const authFile   = path.join(dataDir, 'auth.json');
const distDir    = path.join(__dirname, 'dist');
const hasBuiltClient = fsSync.existsSync(path.join(distDir, 'index.html'));

// ── OAuth2 client (used instead of service account key) ───────────────────────
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI || `http://localhost:${port}/auth/callback`;

function makeOAuthClient() {
  return new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// Env var takes priority (used in production); file is used locally after /auth/setup
function loadRefreshToken() {
  if (process.env.OAUTH_REFRESH_TOKEN) return process.env.OAUTH_REFRESH_TOKEN;
  try {
    const raw = fsSync.readFileSync(authFile, 'utf8');
    return JSON.parse(raw).refresh_token || null;
  } catch {
    return null;
  }
}

// ── Multer (multipart file uploads → temp folder) ─────────────────────────────
const upload = multer({
  dest: tempDir,
  limits: { fileSize: 50 * 1024 * 1024, files: 200 },
  fileFilter(_req, file, cb) {
    const ok = /^image\//i.test(file.mimetype) || /^video\//i.test(file.mimetype);
    cb(null, ok);
  },
});

// ── Google Drive helper ────────────────────────────────────────────────────────
async function uploadFilesToDrive(files, folderName) {
  const refreshToken = loadRefreshToken();
  if (!refreshToken) throw new Error('Google Drive not authorised. Visit /auth/setup first.');

  const oauth2Client = makeOAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const { data: folder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.DRIVE_PARENT_FOLDER_ID],
    },
    fields: 'id,webViewLink',
  });

  await drive.permissions.create({
    fileId: folder.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  await Promise.all(
    files.map(f =>
      drive.files.create({
        requestBody: { name: f.originalname, parents: [folder.id] },
        media: { mimeType: f.mimetype, body: fsSync.createReadStream(f.path) },
      })
    )
  );

  return folder.webViewLink;
}

// ── Email helper ───────────────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

async function sendOrderEmail(order, driveFolderUrl) {
  const photosCell = driveFolderUrl
    ? `<a href="${driveFolderUrl}">View ${order.photoCount} photo(s) in Drive →</a>`
    : order.driveUrl
      ? `<a href="${order.driveUrl}">${order.driveUrl}</a>`
      : 'Not provided';

  const html = `
    <div style="font-family:sans-serif;max-width:600px">
      <h2 style="color:#6c3fc8;margin-bottom:4px">New Order — Prince Digilab</h2>
      <p style="color:#666;margin-top:0">
        <b>Order ID:</b> ${order.id} &nbsp;|&nbsp;
        <b>Time:</b> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
      <table border="1" cellpadding="10" cellspacing="0"
             style="border-collapse:collapse;width:100%;font-size:14px">
        <tr style="background:#f5f0ff"><td width="160"><b>Name</b></td><td>${order.name}</td></tr>
        <tr><td><b>Phone</b></td><td>${order.phone}</td></tr>
        <tr style="background:#f5f0ff"><td><b>Email</b></td><td>${order.email}</td></tr>
        <tr><td><b>Product</b></td><td>${order.productCategory}</td></tr>
        <tr style="background:#f5f0ff"><td><b>Album Size</b></td><td>${order.albumSize || '—'}</td></tr>
        <tr><td><b>Occasion</b></td><td>${order.occasion || '—'}</td></tr>
        <tr style="background:#f5f0ff"><td><b>Design Code</b></td><td>${order.designCode || '—'}</td></tr>
        <tr><td><b>Custom Text</b></td><td>${order.customText || '—'}</td></tr>
        <tr style="background:#f5f0ff"><td><b>Notes</b></td><td>${order.notes || '—'}</td></tr>
        <tr><td><b>Photos</b></td><td>${photosCell}</td></tr>
      </table>
      <p style="color:#aaa;font-size:12px;margin-top:16px">
        Sent automatically by Prince Digilab website
      </p>
    </div>`;

  await mailer.sendMail({
    from: `"Prince Digilab Orders" <${process.env.GMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `New Order: ${order.name} — ${order.productCategory}`,
    html,
  });
}

// ── Express setup ──────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));

if (hasBuiltClient) {
  app.use(express.static(distDir));
} else {
  app.use(express.static(__dirname));
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ── One-time OAuth2 setup routes ───────────────────────────────────────────────
// Visit http://localhost:3000/auth/setup once to authorise Drive access
app.get('/auth/setup', (_req, res) => {
  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    return res.send('OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET are not set in .env');
  }
  const url = makeOAuthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive'],
  });
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code parameter.');
  try {
    const { tokens } = await makeOAuthClient().getToken(code);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(authFile, JSON.stringify(tokens, null, 2), 'utf8');
    console.log('✅ Google Drive authorised. Refresh token saved to data/auth.json');
    res.send(`
      <h2 style="font-family:sans-serif;color:#6c3fc8">✅ Google Drive connected!</h2>
      <p style="font-family:sans-serif">
        Authorisation complete. You can close this tab.<br>
        The server is now ready to upload customer photos to your Drive.
      </p>
    `);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Failed to exchange code: ' + err.message);
  }
});

// ── Order endpoint ─────────────────────────────────────────────────────────────
app.post('/api/orders', upload.array('photos', 200), async (req, res) => {
  const tempFiles = req.files || [];

  try {
    const { name, phone, email, productCategory,
            albumSize, occasion, designCode, customText, notes, driveUrl } = req.body;

    if (!String(name || '').trim())
      return res.status(400).json({ error: 'Name is required.' });
    if (!String(phone || '').trim())
      return res.status(400).json({ error: 'Phone number is required.' });
    if (!String(email || '').trim() || !String(email).includes('@'))
      return res.status(400).json({ error: 'A valid email address is required.' });
    if (!String(productCategory || '').trim())
      return res.status(400).json({ error: 'Product category is required.' });

    const order = {
      id:              `ord_${Date.now()}`,
      createdAt:       new Date().toISOString(),
      name:            String(name).trim(),
      phone:           String(phone).trim(),
      email:           String(email).trim(),
      productCategory: String(productCategory).trim(),
      albumSize:       String(albumSize  || '').trim(),
      occasion:        String(occasion   || '').trim(),
      designCode:      String(designCode || '').trim(),
      customText:      String(customText || '').trim(),
      notes:           String(notes      || '').trim(),
      driveUrl:        String(driveUrl   || '').trim(),
      photoCount:      tempFiles.length,
    };

    // Upload to owner's Drive if files were attached and Drive is authorised
    let driveFolderUrl = null;
    if (tempFiles.length > 0 && process.env.DRIVE_PARENT_FOLDER_ID && loadRefreshToken()) {
      const folderName = `${order.id} — ${order.name} — ${order.phone}`;
      driveFolderUrl = await uploadFilesToDrive(tempFiles, folderName);
      order.driveFolderUrl = driveFolderUrl;
    }

    // Persist order
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(ordersFile, `${JSON.stringify(order)}\n`, 'utf8');

    // Notify owner (non-blocking)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      sendOrderEmail(order, driveFolderUrl).catch(err =>
        console.error('Email notification failed:', err.message)
      );
    }

    res.status(201).json({
      ok: true,
      message: 'Order received successfully.',
      orderId: order.id,
      order: {
        id: order.id, createdAt: order.createdAt,
        name: order.name, phone: order.phone, email: order.email,
        productCategory: order.productCategory, albumSize: order.albumSize,
        designCode: order.designCode, customText: order.customText,
        notes: order.notes, photoCount: order.photoCount,
        driveFolderUrl: driveFolderUrl || null,
      },
    });
  } catch (err) {
    console.error('Order processing failed:', err);
    res.status(500).json({ error: 'Unable to save the order right now. Please call us directly.' });
  } finally {
    tempFiles.forEach(f => fs.unlink(f.path).catch(() => {}));
  }
});

// ── Order lookup by email ──────────────────────────────────────────────────────
app.get('/api/orders/lookup', async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email || !email.includes('@'))
    return res.status(400).json({ error: 'Valid email required.' });

  try {
    let raw;
    try { raw = await fs.readFile(ordersFile, 'utf8'); } catch { return res.json({ orders: [] }); }

    const orders = raw.trim().split('\n')
      .filter(Boolean)
      .map(line => { try { return JSON.parse(line); } catch { return null; } })
      .filter(o => o && String(o.email || '').trim().toLowerCase() === email)
      .map(({ id, createdAt, name, phone, productCategory, albumSize, designCode,
               customText, notes, photoCount, driveFolderUrl }) => ({
        id, createdAt, name, phone, productCategory,
        albumSize: albumSize || '', designCode: designCode || '',
        customText: customText || '', notes: notes || '',
        photoCount: photoCount || 0, driveFolderUrl: driveFolderUrl || null,
      }))
      .reverse(); // newest first

    res.json({ orders });
  } catch (err) {
    console.error('Order lookup error:', err);
    res.status(500).json({ error: 'Unable to look up orders.' });
  }
});

app.get('*', (_req, res) => {
  const fallback = hasBuiltClient
    ? path.join(distDir, 'index.html')
    : path.join(__dirname, 'index.html');
  res.sendFile(fallback);
});

app.listen(port, () => {
  console.log(`Prince Digilab server running at http://localhost:${port}`);
  if (!loadRefreshToken()) {
    console.log('⚠  Google Drive not yet authorised. Visit http://localhost:3000/auth/setup to connect.');
  }
});
