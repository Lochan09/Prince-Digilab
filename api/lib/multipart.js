const Busboy = require('busboy');
const fs = require('fs');
const os = require('os');
const path = require('path');

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = [];
    const pending = [];

    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: 50 * 1024 * 1024, files: 200 },
    });

    busboy.on('file', (fieldName, stream, info) => {
      if (fieldName !== 'photos') {
        stream.resume();
        return;
      }

      const mimeType = info.mimeType || info.mime || 'application/octet-stream';
      if (!/^image\//i.test(mimeType) && !/^video\//i.test(mimeType)) {
        stream.resume();
        return;
      }

      const filename = info.filename || `upload-${Date.now()}`;
      const filepath = path.join(os.tmpdir(), `${Date.now()}-${path.basename(filename)}`);
      const writeStream = fs.createWriteStream(filepath);

      const done = new Promise((res, rej) => {
        writeStream.on('finish', () => {
          files.push({
            path: filepath,
            originalname: filename,
            mimetype: mimeType,
          });
          res();
        });
        writeStream.on('error', rej);
        stream.on('error', rej);
      });

      pending.push(done);
      stream.pipe(writeStream);
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('error', reject);
    busboy.on('finish', async () => {
      try {
        await Promise.all(pending);
        resolve({ fields, files });
      } catch (err) {
        reject(err);
      }
    });

    req.pipe(busboy);
  });
}

function cleanupFiles(files) {
  (files || []).forEach((f) => {
    fs.unlink(f.path, () => {});
  });
}

module.exports = { parseMultipart, cleanupFiles };
