const { verifyOwnerToken } = require('../lib/auth');
const { listOrders } = require('../lib/orders-store');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const auth = await verifyOwnerToken(req.headers.authorization);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const orders = await listOrders();
    return res.status(200).json({ orders, total: orders.length });
  } catch (err) {
    console.error('Admin orders error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
