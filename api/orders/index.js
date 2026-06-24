const { loadRefreshToken, uploadFilesToDrive } = require('../lib/drive');
const { sendOrderEmail } = require('../lib/email');
const { parseMultipart, cleanupFiles } = require('../lib/multipart');
const { appendOrder } = require('../lib/orders-store');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let tempFiles = [];
  const warnings = [];

  try {
    const { fields, files } = await parseMultipart(req);
    tempFiles = files;

    const {
      name,
      phone,
      email,
      productCategory,
      albumSize,
      occasion,
      designCode,
      customText,
      notes,
      driveUrl,
    } = fields;

    if (!String(name || '').trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!String(phone || '').trim()) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    if (!String(email || '').trim() || !String(email).includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!String(productCategory || '').trim()) {
      return res.status(400).json({ error: 'Product category is required.' });
    }

    const order = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      productCategory: String(productCategory).trim(),
      albumSize: String(albumSize || '').trim(),
      occasion: String(occasion || '').trim(),
      designCode: String(designCode || '').trim(),
      customText: String(customText || '').trim(),
      notes: String(notes || '').trim(),
      driveUrl: String(driveUrl || '').trim(),
      photoCount: tempFiles.length,
    };

    let driveFolderUrl = null;
    if (
      tempFiles.length > 0 &&
      process.env.DRIVE_PARENT_FOLDER_ID &&
      loadRefreshToken()
    ) {
      try {
        const folderName = `${order.id} — ${order.name} — ${order.phone}`;
        driveFolderUrl = await uploadFilesToDrive(tempFiles, folderName);
        order.driveFolderUrl = driveFolderUrl;
      } catch (err) {
        console.error('Drive upload failed:', err.message);
        warnings.push('Photos could not be uploaded to Drive. Please contact us with your order ID.');
      }
    } else if (tempFiles.length > 0) {
      warnings.push('Photo upload is temporarily unavailable. We will contact you for your files.');
    }

    try {
      await appendOrder(order);
    } catch (err) {
      console.error('Order storage failed:', err.message);
      warnings.push('Order history could not be saved. You will still receive confirmation by email.');
    }

    try {
      await sendOrderEmail(order, driveFolderUrl);
    } catch (err) {
      console.error('Email notification failed:', err.message);
      return res.status(500).json({
        error: 'Unable to send your order right now. Please call us directly.',
      });
    }

    return res.status(201).json({
      ok: true,
      message: warnings.length
        ? 'Order received. Our team will follow up shortly.'
        : 'Order received successfully.',
      warnings: warnings.length ? warnings : undefined,
      orderId: order.id,
      order: {
        id: order.id,
        createdAt: order.createdAt,
        name: order.name,
        phone: order.phone,
        email: order.email,
        productCategory: order.productCategory,
        albumSize: order.albumSize,
        designCode: order.designCode,
        customText: order.customText,
        notes: order.notes,
        photoCount: order.photoCount,
        driveFolderUrl: driveFolderUrl || null,
      },
    });
  } catch (err) {
    console.error('Order processing failed:', err);
    return res.status(500).json({
      error: 'Unable to save the order right now. Please call us directly.',
    });
  } finally {
    cleanupFiles(tempFiles);
  }
}

handler.config = { api: { bodyParser: false } };
module.exports = handler;
