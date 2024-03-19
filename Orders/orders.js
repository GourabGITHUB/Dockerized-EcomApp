const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3003;

let orders = [];

app.use(bodyParser.json());
app.use(cors({
    origin: '*' // Allow requests from any origin (not recommended for production)
}));


function generateOrderId() {
    return uuidv4();
}
// Modify the /place-order endpoint
app.post('/place-order', (req, res) => {
    const products = req.body.products;
    const orderId = generateOrderId(); // Generate a unique order ID
    orders.push({ id: orderId, products });
    console.log('Order placed:', orderId, 'with products:', products);
    res.json({ id: orderId, products }); // Return the order ID and products
});

// Define a new endpoint to receive products
app.post('/receive-products', (req, res) => {
    const products = req.body.products;
    orders.push({ id: generateOrderId(), products });
    res.json({ success: true });
});

// Get all orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

app.listen(port, () => {
    console.log(`Orders server is running on port ${port}`);
});

