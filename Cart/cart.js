const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3002; // Change to 3002

app.use(cors());
app.use(bodyParser.json());

let cart = [];

app.post('/cart/add', (req, res) => {
  const { productId, productName, productPrice } = req.body;

  if (!productId || !productName || !productPrice) {
    return res.status(400).json({ error: 'Invalid data sent to server' });
  }

  cart.push({ productId, productName, productPrice });

  res.json({ message: 'Item added to cart successfully' });
});

app.get('/cart', (req, res) => {
  res.json(cart);
});

app.delete('/cart', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared successfully' });
});

app.listen(port, () => {
  console.log(`Cart service listening at http://localhost:${port}`);
});
