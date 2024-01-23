const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;

// Proxy requests to microservices
app.use('/products', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/cart', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
