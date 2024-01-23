document.addEventListener('DOMContentLoaded', () => {
  function updateProducts() {
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(products => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = products.map(product => `
          <li>${product.name} - $${product.price} 
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
          </li>
        `).join('');
      })
      .catch(error => console.error(error));
  }

  function updateCart() {
    fetch('http://localhost:3002/cart') // Change port to 3002
      .then(response => response.json())
      .then(cartItems => {
        const cartList = document.getElementById('cart-items');
        cartList.innerHTML = cartItems.map(item => `<li>${item.productName} - $${item.productPrice}</li>`).join('');

        // Calculate total price of the cart
        const totalPriceCart = cartItems.reduce((total, item) => total + item.productPrice, 0);
        document.getElementById('total-cart-price').innerText = `$${totalPriceCart.toFixed(2)}`;
      })
      .catch(error => console.error(error));
  }

  function updateOrders() {
    fetch('http://localhost:3000/orders')
      .then(response => response.json())
      .then(orders => {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = orders.map(order => `
          <li>${order.items.map(item => `${item.productName} - $${item.productPrice}`).join(', ')}</li>
        `).join('');

        // Calculate total price of the orders
        const totalPriceOrders = orders.reduce((total, order) => {
          return total + order.items.reduce((orderTotal, item) => orderTotal + item.productPrice, 0);
        }, 0);
        document.getElementById('total-orders-price').innerText = `$${totalPriceOrders.toFixed(2)}`;
      })
      .catch(error => console.error(error));
  }

  updateProducts();
  updateCart();
  updateOrders();

  setInterval(updateProducts, 5000);
  setInterval(updateCart, 3000);
  setInterval(updateOrders, 10000);
});

function addToCart(productId, productName, productPrice) {
  fetch('http://localhost:3002/cart/add', { // Change port to 3002
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, productName, productPrice }),
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    updateProducts();
    updateCart();
  })
  .catch(error => console.error(error));
}

function placeOrder() {
  fetch('http://localhost:3002/cart') // Change port to 3002
    .then(response => response.json())
    .then(cartItems => {
      fetch('http://localhost:3000/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);

        fetch('http://localhost:3002/cart', { // Change port to 3002
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(result => {
          console.log(result);
          updateCart();
          updateOrders();
        })
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}
