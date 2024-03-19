const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3002;

let cart = [];

app.use(bodyParser.json());
app.use(cors());

// Add item to cart
app.post('/add-to-cart', (req, res) => {
  const { name, price } = req.body;
  console.log('Received item to add to cart:', name, price); // Debug statement
  const existingItemIndex = cart.findIndex(item => item.name === name && item.price === price);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity++; // Increment quantity if item already exists in cart
  } else {
    cart.push({ name, price, quantity: 1 }); // Add new item with quantity 1
  }
  console.log('Updated cart:', cart); // Debug statement
  res.json(cart); // Return updated cart
});
// Remove item from cart
// Implement similar to addToCart function but with DELETE request to remove item

// Update item quantity in cart
app.post('/update-cart-quantity', (req, res) => {
  const { name, quantity } = req.body;
  const existingItemIndex = cart.findIndex(item => item.name === name);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity = quantity;
  }
  res.json(cart);
});
// Remove item from cart
app.post('/remove-from-cart', (req, res) => {
    const { name } = req.body;
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1); // Remove the item from the cart array
    }
    res.json(cart); // Return updated cart
});

// Get cart
app.get('/cart', (req, res) => {
  res.json(cart);
});

// Place order
// Place order
app.post('/place-order', (req, res) => {
    const products = req.body.products;
    fetch('http://localhost:3003/generate-order-id')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate order ID');
            }
            return response.json();
        })
        .then(data => {
            const orderId = data.id;
            orders.push({ id: orderId, products });
            console.log('Order placed:', orderId, 'with products:', products);
            cart = []; // Clear the cart

            // Send products to orders.js
            fetch('http://localhost:3003/receive-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products: cart })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send products to orders');
                }
                return response.json();
            })
            .then(() => {
                console.log('Products sent to orders successfully');
            })
            .catch(error => console.error('Error sending products to orders:', error));

            res.json({ id: orderId, products }); // Return the order ID and products
        })
        .catch(error => {
            console.error('Error placing order:', error);
            res.status(500).json({ error: 'Failed to place order' });
        });


    // Return the order ID and products
res.json({ id: orderId, products });
});
app.post('/clear-cart', (req, res) => {
    cart = []; // Clear the cart
    res.json(cart); // Return an empty cart
});
 

app.listen(port, () => {
  console.log(`Cart server is running on port ${port}`);
});
