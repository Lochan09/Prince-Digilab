const { head, put } = require('@vercel/blob');
const { getDriveClient } = require('./drive');

const ORDERS_BLOB_PATH = 'data/orders.jsonl';
const ORDERS_DRIVE_NAME = 'orders.jsonl';

function parseOrders(raw) {
  return raw
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function storageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || getDriveClient());
}

async function readOrdersFromDrive() {
  const drive = getDriveClient();
  const parentId = process.env.DRIVE_PARENT_FOLDER_ID;
  if (!drive || !parentId) return '';

  const { data } = await drive.files.list({
    q: `'${parentId}' in parents and name='${ORDERS_DRIVE_NAME}' and trashed=false`,
    fields: 'files(id)',
    pageSize: 1,
  });

  if (!data.files?.length) return '';

  const res = await drive.files.get(
    { fileId: data.files[0].id, alt: 'media' },
    { responseType: 'text' }
  );
  return res.data || '';
}

async function writeOrdersToDrive(content) {
  const drive = getDriveClient();
  const parentId = process.env.DRIVE_PARENT_FOLDER_ID;
  if (!drive || !parentId) {
    throw new Error('Google Drive order storage is not configured.');
  }

  const { data } = await drive.files.list({
    q: `'${parentId}' in parents and name='${ORDERS_DRIVE_NAME}' and trashed=false`,
    fields: 'files(id)',
    pageSize: 1,
  });

  if (data.files?.length) {
    await drive.files.update({
      fileId: data.files[0].id,
      media: { mimeType: 'text/plain', body: content },
    });
    return;
  }

  await drive.files.create({
    requestBody: { name: ORDERS_DRIVE_NAME, parents: [parentId] },
    media: { mimeType: 'text/plain', body: content },
  });
}

async function readOrdersRaw() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const meta = await head(ORDERS_BLOB_PATH);
      const res = await fetch(meta.url);
      if (!res.ok) return '';
      return await res.text();
    } catch {
      return '';
    }
  }

  return readOrdersFromDrive();
}

async function writeOrdersRaw(content) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(ORDERS_BLOB_PATH, content, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'text/plain',
      addRandomSuffix: false,
    });
    return;
  }

  await writeOrdersToDrive(content);
}

async function listOrders() {
  const raw = await readOrdersRaw();
  return parseOrders(raw).reverse();
}

async function listOrdersByEmail(email) {
  const needle = String(email || '').trim().toLowerCase();
  return parseOrders(await readOrdersRaw())
    .filter((o) => String(o.email || '').trim().toLowerCase() === needle)
    .map(
      ({
        id,
        createdAt,
        name,
        phone,
        productCategory,
        albumSize,
        designCode,
        customText,
        notes,
        photoCount,
        driveFolderUrl,
      }) => ({
        id,
        createdAt,
        name,
        phone,
        productCategory,
        albumSize: albumSize || '',
        designCode: designCode || '',
        customText: customText || '',
        notes: notes || '',
        photoCount: photoCount || 0,
        driveFolderUrl: driveFolderUrl || null,
      })
    )
    .reverse();
}

async function appendOrder(order) {
  if (!storageConfigured()) {
    throw new Error(
      'Order storage is not configured. Add BLOB_READ_WRITE_TOKEN or Google Drive OAuth in Vercel.'
    );
  }

  const existing = await readOrdersRaw();
  const content = `${existing}${JSON.stringify(order)}\n`;
  await writeOrdersRaw(content);
}

module.exports = {
  appendOrder,
  listOrders,
  listOrdersByEmail,
};
