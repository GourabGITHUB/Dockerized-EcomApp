const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3001;

// Use cors middleware
app.use(cors());

app.get('/products', (req, res) => {
  // Return list of products
  res.json([{ id: 1, name: 'Product 1', price: 20 }, { id: 2, name: 'Product 2', price: 30 }]);
});

app.listen(port, () => {
  console.log(`Products service listening at http://localhost:${port}`);
});
