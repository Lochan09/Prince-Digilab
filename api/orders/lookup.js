const { listOrdersByEmail } = require('../lib/orders-store');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  try {
    const orders = await listOrdersByEmail(email);
    return res.status(200).json({ orders });
  } catch (err) {
    console.error('Order lookup error:', err);
    return res.status(500).json({ error: 'Unable to look up orders.' });
  }
};
