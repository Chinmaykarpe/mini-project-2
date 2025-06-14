// JavaScript for mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- JavaScript for form submission (NOW WITH SERVER-SIDE PROCESSING) ---
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

 main
contactForm.addEventListener('submit', function (event) {
=======
contactForm.addEventListener('submit', async function(event) { // Added 'async' keyword
 main
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Clear any previous messages and hide the message div
    formMessage.classList.add('hidden');
    formMessage.classList.remove('text-green-600', 'text-red-600');

    // Basic client-side validation
    if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all fields.';
        formMessage.classList.add('text-red-600');
        formMessage.classList.remove('hidden');
        return;
    }

    try {
        // Send form data to the PHP backend using Fetch API
        const response = await fetch('http://localhost/mini%20project%202/submit_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tell the server we are sending JSON
            },
            body: JSON.stringify({ name, email, message }) // Convert JavaScript object to JSON string
        });

        // Parse the JSON response from the PHP script
        const result = await response.json();

        if (result.success) {
            // If PHP indicates success
            formMessage.textContent = result.message; // Display success message from PHP
            formMessage.classList.add('text-green-600');
            contactForm.reset(); // Clear the form on successful submission
        } else {
            // If PHP indicates an error
            formMessage.textContent = `Error: ${result.message}`; // Display error message from PHP
            formMessage.classList.add('text-red-600');
        }
    } catch (error) {
        // Catch any network or parsing errors
        console.error('Error submitting contact form:', error);
        formMessage.textContent = 'Failed to send message. Please check your network connection.';
        formMessage.classList.add('text-red-600');
    } finally {
        // Always show the message and hide it after a delay
        formMessage.classList.remove('hidden');
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000); // Message disappears after 5 seconds
    }
});


// --- Shopping Cart Functionality ---
let cart = []; // Array to store cart items
// Retrieve stored orderDetails from localStorage on load, or initialize empty
// This is still used for displaying the "Your Recent Order" section
let orderDetails = JSON.parse(localStorage.getItem('lastOrderDetails')) || {};

const cartButton = document.getElementById('cart-button');
const cartButtonMobile = document.getElementById('cart-button-mobile');
const cartModal = document.getElementById('cart-modal');
const cartCloseButton = document.getElementById('cart-close-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartItemCountSpan = document.getElementById('cart-item-count');
const cartItemCountMobileSpan = document.getElementById('cart-item-count-mobile');
const emptyCartMessage = document.getElementById('empty-cart-message');
const clearCartButton = document.getElementById('clear-cart-button');
const proceedToCheckoutButton = document.getElementById('proceed-to-checkout-button');
const checkoutMessage = document.getElementById('checkout-message');

// Views
const homeSection = document.getElementById('home');
const aboutSection = document.getElementById('about');
const menuSection = document.getElementById('menu');
const contactSection = document.getElementById('contact');
const yourOrderSection = document.getElementById('your-order'); // New section
const orderDetailsContent = document.getElementById('order-details-content'); // Content div for order details

const cartSummaryView = document.getElementById('cart-summary-view');
const deliveryPickupView = document.getElementById('delivery-pickup-view');
const paymentOptionsView = document.getElementById('payment-options-view');

const cartModalTitle = document.getElementById('cart-modal-title');

// Buttons for new flow
const backFromDeliveryButton = document.getElementById('back-from-delivery-button');
const nextToPaymentButton = document.getElementById('next-to-payment-button');
const backToDeliveryButton = document.getElementById('back-to-delivery-button');

// Delivery/Pickup specific elements
const orderTypeRadios = document.querySelectorAll('input[name="order-type"]');
const customerNameInput = document.getElementById('customer-name');
const pickupOptionsDiv = document.getElementById('pickup-options');
const tableNumberSelect = document.getElementById('table-number');
const deliveryOptionsDiv = document.getElementById('delivery-options');
const deliveryAddressTextarea = document.getElementById('delivery-address');
const deliveryPickupMessage = document.getElementById('delivery-pickup-message');


// Payment specific elements
const payNowButton = document.getElementById('pay-now-button');
const creditCardDetails = document.getElementById('credit-card-details');
const upiDetails = document.getElementById('upi-details');
const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
const addToCartConfirmation = document.getElementById('add-to-cart-confirmation');
const upiQrCode = document.getElementById('upi-qr-code');


// Function to update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''; // Clear current items
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        proceedToCheckoutButton.disabled = true; // Disable checkout if cart is empty
        proceedToCheckoutButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        emptyCartMessage.classList.add('hidden');
        proceedToCheckoutButton.disabled = false; // Enable checkout if cart has items
        proceedToCheckoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-100');
            itemElement.innerHTML = `
                <div class="flex-grow">
                    <span class="font-semibold">${item.name}</span>
                    <span class="text-gray-600 ml-2">x${item.quantity}</span>
                </div>
                <div class="flex items-center">
                    <span class="font-bold text-amber-700 mr-4">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-from-cart-btn bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-red-600" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
    }

    cartTotalSpan.textContent = `₹${total.toFixed(2)}`;
    cartItemCountSpan.textContent = cart.length;
    cartItemCountMobileSpan.textContent = cart.length; // Update mobile cart count
}

// Show "Add to Cart Successful" message
function showAddToCartConfirmation() {
    addToCartConfirmation.classList.remove('hidden');
    addToCartConfirmation.classList.add('show');
    setTimeout(() => {
        addToCartConfirmation.classList.remove('show');
        addToCartConfirmation.classList.add('hidden');
    }, 2000); // Message disappears after 2 seconds
}

// Add item to cart
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const menuItem = event.target.closest('[data-name]');
        const name = menuItem.dataset.name;
        const price = parseFloat(menuItem.dataset.price);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
            existingItem.price = price; // Update price in cart if it changed in HTML
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartDisplay();
        showAddToCartConfirmation(); // Show confirmation message
    });
});

// Remove item from cart
cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const index = parseInt(event.target.dataset.index);
        cart.splice(index, 1); // Remove item at index
        updateCartDisplay();
    }
});

// Clear cart
clearCartButton.addEventListener('click', () => {
    cart = [];
    updateCartDisplay();
    checkoutMessage.classList.add('hidden'); // Hide any previous checkout message
    showCartSummaryView(); // Ensure we are back to cart summary view
});

// Open cart modal
cartButton.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    checkoutMessage.classList.add('hidden'); // Hide any previous checkout message
    showCartSummaryView(); // Always show cart summary first when opening modal
});

// Open cart modal from mobile menu
cartButtonMobile.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    checkoutMessage.classList.add('hidden'); // Hide any previous checkout message
    mobileMenu.classList.add('hidden'); // Close mobile menu when cart is opened
    showCartSummaryView(); // Always show cart summary first when opening modal
});

// Close cart modal
cartCloseButton.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Close modal if clicking outside content
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});

// --- View Management for Main Sections ---
function hideAllSections() {
    homeSection.classList.add('hidden');
    aboutSection.classList.add('hidden');
    menuSection.classList.add('hidden');
    contactSection.classList.add('hidden');
    yourOrderSection.classList.add('hidden'); // Hide new order section
}

// Event listeners for navigation links to show/hide sections
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
        const targetId = event.target.getAttribute('href').substring(1); // e.g., "home"
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            event.preventDefault();

            // Special behavior for Home tab
            if (targetId === 'home') {
                // Reload the entire page to restore original home view
                window.location.reload(); // Hard reload
                return;
            }

            // For other tabs, show only that section
            hideAllSections();
            targetSection.classList.remove('hidden');
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- View Management in Cart Modal ---
function showCartSummaryView() {
    cartSummaryView.classList.remove('hidden');
    deliveryPickupView.classList.add('hidden');
    paymentOptionsView.classList.add('hidden');
    cartModalTitle.textContent = 'Your Cart';
    checkoutMessage.classList.add('hidden'); // Hide any previous checkout message
    deliveryPickupMessage.classList.add('hidden'); // Hide any previous delivery/pickup message
}

function showDeliveryPickupView() {
    cartSummaryView.classList.add('hidden');
    deliveryPickupView.classList.remove('hidden');
    paymentOptionsView.classList.add('hidden');
    cartModalTitle.textContent = 'Order Details';
    checkoutMessage.classList.add('hidden'); // Hide any previous checkout message
}

function showPaymentOptionsView() {
    cartSummaryView.classList.add('hidden');
    deliveryPickupView.classList.add('hidden');
    paymentOptionsView.classList.remove('hidden');
    cartModalTitle.textContent = 'Payment';
    checkoutMessage.classList.add('hidden'); // Hide any previous checkout message

    // Update UPI QR Code based on total amount if needed (can be dynamic if you have a QR API)
    // For now, it's a static placeholder QR.
    // upiQrCode.src = `https://placehold.co/200x200/22c55e/ffffff?text=Pay+₹${total.toFixed(2)}`;
}


// --- Checkout Flow Event Listeners ---
proceedToCheckoutButton.addEventListener('click', showDeliveryPickupView);
backFromDeliveryButton.addEventListener('click', showCartSummaryView);
backToDeliveryButton.addEventListener('click', showDeliveryPickupView);

nextToPaymentButton.addEventListener('click', () => {
    // Basic validation for customer name
    const customerName = customerNameInput.value.trim();
    if (customerName === '') {
        deliveryPickupMessage.textContent = 'Please enter your name.';
        deliveryPickupMessage.classList.remove('hidden');
        deliveryPickupMessage.classList.remove('text-green-600');
        deliveryPickupMessage.classList.add('text-red-600');
        return;
    }

    const orderType = document.querySelector('input[name="order-type"]:checked')?.value; // Use optional chaining
    if (!orderType) { // Check if an order type is selected
        deliveryPickupMessage.textContent = 'Please select an order type (Pickup or Delivery).';
        deliveryPickupMessage.classList.remove('hidden');
        deliveryPickupMessage.classList.remove('text-green-600');
        deliveryPickupMessage.classList.add('text-red-600');
        return;
    }

    if (orderType === 'delivery') {
        const deliveryAddress = deliveryAddressTextarea.value.trim();
        if (deliveryAddress === '') {
            deliveryPickupMessage.textContent = 'Please enter your delivery address.';
            deliveryPickupMessage.classList.remove('hidden');
            deliveryPickupMessage.classList.remove('text-green-600');
            deliveryPickupMessage.classList.add('text-red-600');
            return;
        }
    }

    deliveryPickupMessage.classList.add('hidden'); // Hide any previous messages
    showPaymentOptionsView();
});


// Toggle display of pickup/delivery options based on radio selection
orderTypeRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'pickup') {
            pickupOptionsDiv.classList.remove('hidden');
            deliveryOptionsDiv.classList.add('hidden');
        } else {
            pickupOptionsDiv.classList.add('hidden');
            deliveryOptionsDiv.classList.remove('hidden');
        }
    });
});

// Toggle display of payment method details based on radio selection
paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'credit_card') {
            creditCardDetails.classList.remove('hidden');
            upiDetails.classList.add('hidden');
        } else if (event.target.value === 'upi') {
            creditCardDetails.classList.add('hidden');
            upiDetails.classList.remove('hidden');
        } else { // cash_on_delivery or other
            creditCardDetails.classList.add('hidden');
            upiDetails.classList.add('hidden');
        }
    });
});


// --- Handle Pay Now / Place Order (NOW WITH SERVER-SIDE PROCESSING) ---
payNowButton.addEventListener('click', async () => { // Added 'async' keyword
    const customerName = customerNameInput.value.trim();
    const orderType = document.querySelector('input[name="order-type"]:checked')?.value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;

    // Basic validation for payment method selection
    if (!paymentMethod) {
        checkoutMessage.textContent = 'Please select a payment method.';
        checkoutMessage.classList.remove('hidden');
        checkoutMessage.classList.remove('text-green-600');
        checkoutMessage.classList.add('text-red-600');
        return;
    }

    let tableNumber = null;
    let deliveryAddress = null;

    if (orderType === 'pickup') {
        tableNumber = tableNumberSelect.value;
    } else { // delivery
        deliveryAddress = deliveryAddressTextarea.value.trim();
    }

    // Prepare data to send to PHP backend
    const currentOrderData = {
        customerName: customerName,
        orderType: orderType,
        tableNumber: tableNumber,
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod,
        cart: cart, // Send the entire cart array
        totalAmount: parseFloat(cartTotalSpan.textContent.replace('₹', '')),
        // orderTimestamp will be set by PHP (NOW())
    };

    // Show a loading/processing message
    checkoutMessage.classList.add('hidden'); // Hide any previous messages
    checkoutMessage.classList.remove('text-green-600', 'text-red-600'); // Clear colors
    checkoutMessage.textContent = 'Placing order... Please wait.';
    checkoutMessage.classList.remove('hidden');

    try {
        // Send order data to the PHP backend using Fetch API
        const response = await fetch('http://localhost/mini%20project%202/place_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentOrderData) // Convert JavaScript object to JSON string
        });

        // Parse the JSON response from the PHP script
        const result = await response.json();

        if (result.success) {
            // If PHP indicates success
            checkoutMessage.textContent = result.message; // Display success message from PHP
            checkoutMessage.classList.add('text-green-600');

            // Store the current order details in the global orderDetails variable for immediate display
            // We add a client-side timestamp here for display purposes, though PHP sets its own.
            orderDetails = { ...currentOrderData, orderTimestamp: new Date().toISOString() };
            // Also store it in localStorage to persist it across simple page loads (though now backed by DB)
            localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));

            // Hide modal after a delay and then show the order details section
            setTimeout(() => {
                cartModal.classList.add('hidden');
                showYourOrderView(); // Show the new "Your Order" section
                cart = []; // Clear cart after successful checkout
                updateCartDisplay(); // Update cart display to reflect empty cart
            }, 1500); // 1.5 second delay before closing modal and showing order view

        } else {
            // If PHP indicates an error
            checkoutMessage.textContent = `Error placing order: ${result.message}`;
            checkoutMessage.classList.add('text-red-600');
            // Keep the modal open to show the error, user can retry or correct info
        }
    } catch (error) {
        // Catch any network or parsing errors
        console.error('Error placing order:', error);
        checkoutMessage.textContent = 'Failed to place order. Please check your network connection and try again.';
        checkoutMessage.classList.add('text-red-600');
        // Keep the modal open to show the error
    }
});

// Function to display "Your Order" section after successful checkout
function showYourOrderView() {
    hideAllSections();
    yourOrderSection.classList.remove('hidden');

    // orderDetails is now populated from the last successful order or localStorage
    if (orderDetails && orderDetails.customerName) {
        let orderHtml = `
            <h3 class="text-xl font-semibold mb-4 text-amber-900">Order for ${orderDetails.customerName}</h3>
            <p class="mb-2"><strong>Order Type:</strong> ${orderDetails.orderType.charAt(0).toUpperCase() + orderDetails.orderType.slice(1)}</p>
        `;

        if (orderDetails.orderType === 'pickup' && orderDetails.tableNumber) {
            orderHtml += `<p class="mb-2"><strong>Table Number:</strong> ${orderDetails.tableNumber}</p>`;
        } else if (orderDetails.orderType === 'delivery' && orderDetails.deliveryAddress) {
            orderHtml += `<p class="mb-2"><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>`;
        }

        orderHtml += `<p class="mb-2"><strong>Payment Method:</strong> ${orderDetails.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>`;

        orderHtml += `<h4 class="font-semibold mt-4 mb-2 text-amber-800">Items:</h4><ul>`;
        if (orderDetails.cart && orderDetails.cart.length > 0) {
            orderDetails.cart.forEach(item => {
                orderHtml += `<li class="mb-1">${item.name} x ${item.quantity} (₹${(item.price * item.quantity).toFixed(2)})</li>`;
            });
        } else {
            orderHtml += `<li>No items in this order.</li>`;
        }
        orderHtml += `</ul><p class="text-lg font-bold text-amber-700 mt-4">Total Amount: ₹${orderDetails.totalAmount.toFixed(2)}</p>`;
        orderDetailsContent.innerHTML = orderHtml;
    } else {
        orderDetailsContent.innerHTML = '<p>No recent order found. Place an order to see details here.</p>';
    }
}


// Initial cart display update
updateCartDisplay();
// Initial display for order type options
// Assuming 'pickup' is default, set that as default behavior
function updateOrderTypeDisplay() {
    const defaultOrderType = document.querySelector('input[name="order-type"]:checked');
    if (defaultOrderType && defaultOrderType.value === 'pickup') {
        pickupOptionsDiv.classList.remove('hidden');
        deliveryOptionsDiv.classList.add('hidden');
    } else if (defaultOrderType && defaultOrderType.value === 'delivery') {
        pickupOptionsDiv.classList.add('hidden');
        deliveryOptionsDiv.classList.remove('hidden');
    } else { // No default selected, hide both
        pickupOptionsDiv.classList.add('hidden');
        deliveryOptionsDiv.classList.add('hidden');
    }
}
updateOrderTypeDisplay(); // Call this on loads
