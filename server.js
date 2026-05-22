const express = require('express');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.jsonl');
const distDir = path.join(__dirname, 'dist');
const hasBuiltClient = fsSync.existsSync(path.join(distDir, 'index.html'));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (hasBuiltClient) {
  app.use(express.static(distDir));
} else {
  app.use(express.static(__dirname));
}

app.get('/api/health', function (req, res) {
  res.json({ ok: true });
});

app.post('/api/orders', async function (req, res) {
  try {
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();
    const email = String(req.body.email || '').trim();
    const productCategory = String(req.body.productCategory || '').trim();

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!productCategory) {
      return res.status(400).json({ error: 'Product category is required.' });
    }

    const order = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      productCategory,
      albumSize: String(req.body.albumSize || '').trim(),
      occasion: String(req.body.occasion || '').trim(),
      designCode: String(req.body.designCode || '').trim(),
      customText: String(req.body.customText || '').trim(),
      notes: String(req.body.notes || '').trim(),
      driveUrl: String(req.body.driveUrl || '').trim()
    };

    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(ordersFile, `${JSON.stringify(order)}\n`, 'utf8');

    res.status(201).json({
      ok: true,
      message: 'Order received successfully.',
      orderId: order.id
    });
  } catch (error) {
    console.error('Failed to store order:', error);
    res.status(500).json({ error: 'Unable to save the order right now.' });
  }
});

app.get('*', function (req, res) {
  if (hasBuiltClient) {
    return res.sendFile(path.join(distDir, 'index.html'));
  }

  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function () {
  console.log(`New Prince Digilab server running at http://localhost:${port}`);
});