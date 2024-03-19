const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define proxy targets
const proxyOrders = httpProxy.createProxyServer({ target: 'http://orders:3003' });
const proxyCart = httpProxy.createProxyServer({ target: 'http://cart:3002' });
const proxyProducts = httpProxy.createProxyServer({ target: 'http://products:3001' });

// Proxy requests to services
app.all('/orders/*', (req, res) => {
  proxyOrders.web(req, res);
});

app.all('/cart/*', (req, res) => {
  proxyCart.web(req, res);
});

app.all('/products/*', (req, res) => {
  proxyProducts.web(req, res);
});

// Error handling for proxies
proxyOrders.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Proxy error');
});

proxyCart.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Proxy error');
});

proxyProducts.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Proxy error');
});

// Start server
app.listen(port, () => {
  console.log(`Gateway API server is running on port ${port}`);
});
