const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

async function sendOrderEmail(order, driveFolderUrl) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS || !process.env.OWNER_EMAIL) return;

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

module.exports = { sendOrderEmail };
