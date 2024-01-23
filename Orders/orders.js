const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3003;

// Use cors middleware
app.use(cors());
app.use(express.json());

let orders = [];

app.get('/orders', (req, res) => {
  // Return list of orders
  res.json(orders);
});

app.post('/orders/place', (req, res) => {
  // Place an order
  const { items } = req.body;
  orders.push({ items, date: new Date() });
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Orders service listening at http://localhost:${port}`);
});
