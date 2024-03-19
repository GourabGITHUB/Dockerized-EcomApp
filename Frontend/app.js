document.addEventListener('DOMContentLoaded', () => {

    showLoadingOverlay(); // Show loading overlay when the page starts loading

    let cart = [];

    function updateProducts() {
        fetch('http://localhost:3001/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(products => {
                const productList = document.getElementById('productList');
                productList.innerHTML = products.map(product => `
                    <div class="product">
                        <span>${product.name} - $${product.price}</span>
                        <button class="add-to-cart" data-productId="${product._id}" data-productName="${product.name}" data-productPrice="${product.price}">Add to Cart</button>
                    </div>
                `).join('');

                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', addToCart);
                });

                hideLoadingOverlay(); // Hide loading overlay when product list is fully rendered
            })
            .catch(error => console.error('Error fetching products:', error));
    }


    function addToCart(event) {

        const productId = event.target.getAttribute('data-productId');
        const productName = event.target.getAttribute('data-productName');
        const productPrice = event.target.getAttribute('data-productPrice');

        console.log('Adding to cart:', productName, productPrice); // Debug statement

        const existingItemIndex = cart.findIndex(item => item.name === productName && item.price === productPrice);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++; // Increment quantity if product already exists in cart
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 }); // Add new item with quantity 1
showLoadingOverlay();
        }

        updateCart(); // Update cart display
hideLoadingOverlay();
        const cartItem = { name: productName, price: productPrice };

        fetch('http://localhost:3002/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add item to cart');
                }
                return response.json();
            })
            .then(updatedCart => {
                cart = updatedCart; // Update local cart immediately
                updateCart(); // Refresh UI immediately
            })
            .catch(error => console.error('Error adding item to cart:', error));
    }

    function updateCart() {
        fetch('http://localhost:3002/cart')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cart');
                }
                return response.json();
            })
            .then(cart => {
                const cartItemsDiv = document.getElementById('cartItems');
                cartItemsDiv.innerHTML = cart.map(item => `
                    <div class="cart-item" data-productName="${item.name}">
                        <span>${item.name} - $${item.price}</span>
                        <div>
                            <button class="quantity-decrement" data-productName="${item.name}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-increment" data-productName="${item.name}">+</button>
                        </div>
                    </div>
                `).join('');

                // Update total price
                const totalPrice = document.getElementById('totalPrice');
                const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
                totalPrice.textContent = `Total Price: $${total.toFixed(2)}`;

                // Add event listeners for quantity increment and decrement buttons
                document.querySelectorAll('.quantity-increment').forEach(button => {
                    button.addEventListener('click', () => {
                        const itemName = button.getAttribute('data-productName');
                        const item = cart.find(cartItem => cartItem.name === itemName);
                        incrementQuantity(item);
                    });
                });

                document.querySelectorAll('.quantity-decrement').forEach(button => {
                    button.addEventListener('click', () => {
                        const itemName = button.getAttribute('data-productName');
                        const item = cart.find(cartItem => cartItem.name === itemName);
                        decrementQuantity(item);
                    });
                });
            })
            .catch(error => console.error('Error fetching cart:', error));
    }

    function incrementQuantity(item) {
        if (item) {
            item.quantity++;
            updateCartItemQuantity(item.name, item.quantity);
            updateCartItemUI(item.name, item.quantity); // Update UI immediately
        }
    }

    function decrementQuantity(item) {
        if (item && item.quantity > 1) {
            item.quantity--;
            updateCartItemQuantity(item.name, item.quantity);
            updateCartItemUI(item.name, item.quantity); // Update UI immediately
        } else if (item && item.quantity === 1) {
            removeFromCart(item.name);
        }
    }

    function updateCartItemUI(productName, quantity) {
        const quantitySpan = document.querySelector(`.cart-item[data-productName="${productName}"] .quantity`);
        if (quantitySpan) {
            quantitySpan.textContent = quantity;
        }
    }

    function updateCartItemQuantity(productName, quantity) {
        fetch('http://localhost:3002/update-cart-quantity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: productName, quantity })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update cart item quantity');
                }
                return response.json();
            })
            .then(updatedCart => {
                cart = updatedCart; // Update local cart immediately
            })
            .catch(error => console.error('Error updating cart item quantity:', error));
    }

    function removeFromCart(productName) {
        fetch('http://localhost:3002/remove-from-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: productName })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove item from cart');
                }
                return response.json();
            })
            .then(updatedCart => {
                cart = updatedCart; // Update local cart immediately
                updateCart(); // Refresh UI immediately
            })
            .catch(error => console.error('Error removing item from cart:', error));
    }

    function placeOrder() {
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Cart is empty. Please add items to cart.');
        return;
    }

    fetch('http://localhost:3002/cart') // Fetch cart to verify if it's empty
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            return response.json();
        })
        .then(cartData => {
            if (cartData.length === 0) {
                alert('Cart is empty. Please add items to cart.');
            } else {
                // Cart is not empty, proceed with placing the order
                fetch('http://localhost:3003/place-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ products: cart }) // Send the products in the request body
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to place order');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const orderId = data.id;
                        const products = data.products;

                        // Clear the cart UI
                        const cartItemsDiv = document.getElementById('cartItems');
                        cartItemsDiv.innerHTML = '';

                        // Update the total price display
                        const totalPrice = document.getElementById('totalPrice');
                        totalPrice.textContent = 'Total Price: $0.00';

                        // Clear the order section

                        // Display the order ID
                        const ordersDiv = document.getElementById('orders');
                        const orderDiv = document.createElement('div');
                        orderDiv.textContent = `Order ID: ${orderId}`;
                        ordersDiv.appendChild(orderDiv);

                        // Display products associated with the order
                        products.forEach(product => {
                            const productDiv = document.createElement('div');
                            productDiv.textContent = `${product.name} - $${product.price}`;
                            ordersDiv.appendChild(productDiv);
                        });

                        // Clear the cart on the server side as well
                        clearCartOnServer();
                        fetchOrders();
                        console.log('Order placed successfully');
                    })
                    .catch(error => console.error('Error placing order:', error));
            }
        })
        .catch(error => console.error('Error fetching cart:', error));
}


// Function to show a browser notification
function showNotification(title, message) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
        // Otherwise, we need to ask the user for permission
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}

    function clearOrderSection() {
        const ordersDiv = document.getElementById('orders');
        ordersDiv.innerHTML = ''; // Clear the order section
    }

    function clearCartOnServer() {
        fetch('http://localhost:3002/clear-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to clear cart on server');
                }
                console.log('Cart cleared on server successfully');
            })
            .catch(error => console.error('Error clearing cart on server:', error));
    }

 function fetchOrders() {
    fetch('http://localhost:3003/orders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return response.json();
        })
        .then(orders => {
            const ordersDiv = document.getElementById('orders');
            ordersDiv.innerHTML = ''; // Clear the order section before appending new orders
            orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.textContent = `Order ID: ${order.id}`;
                ordersDiv.appendChild(orderDiv);

                // Display products associated with the order
                order.products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.textContent = `${product.name} - $${product.price} (Quantity: ${product.quantity})`; // Include quantity
                    ordersDiv.appendChild(productDiv);
                });

                // Calculate total price for the order
                const orderTotal = order.products.reduce((total, product) => total + (product.price * product.quantity), 0);
                const totalDiv = document.createElement('div');
                totalDiv.textContent = `Total Price: $${orderTotal.toFixed(2)}`;
                ordersDiv.appendChild(totalDiv);
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function fetchProductsAndSendToOrders() {
        fetch('http://localhost:3002/cart')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cart');
                }
                return response.json();
            })
            .then(cart => {
                // Send products to orders.js
                sendProductsToOrders(cart);
            })
            .catch(error => console.error('Error fetching cart:', error));
    }

    function sendProductsToOrders(products) {
        fetch('http://localhost:3003/receive-products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send products to orders');
                }
                return response.json();
            })
            .then(() => {
                console.log('Products sent to orders successfully');
                // Optionally, you can perform any action after sending products to orders

            })
            .catch(error => console.error('Error sending products to orders:', error));
    }
// Function to show loading overlay
    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('loading-overlay');
        overlay.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
        document.body.appendChild(overlay);
    }

    // Function to hide loading overlay
    function hideLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    updateProducts();
    updateCart();
     // Fetch orders when the page loads
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.addEventListener('click', placeOrder);
    fetchOrders();
   setInterval(updateCart,2000); 

});
