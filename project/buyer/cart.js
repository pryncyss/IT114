document.addEventListener('DOMContentLoaded', () => {
  renderCart(); // Render the cart initially
  
  // Handle checkout button click
  document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

  // Pre-fill user information (if available)
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const tempAddress = sessionStorage.getItem('tempAddress') || user.address;
  const tempPhone = sessionStorage.getItem('tempPhone') || user.phone;

  // Set values to temporary address and phone if they exist
  const addressText = document.getElementById('addressText');
  const phoneText = document.getElementById('phoneText');
  addressText.textContent = tempAddress || user.address || 'No Address Provided';
  phoneText.textContent = tempPhone || user.phone || 'No Phone Number Provided';

  // Pre-fill input fields with session data or default user data
  document.getElementById('userAddress').value = tempAddress || user.address || '';
  document.getElementById('userPhone').value = tempPhone || user.phone || '';

  // Handle "Change Address" button click
  document.getElementById('changeAddressBtn').addEventListener('click', () => {
    addressText.style.display = 'none';
    document.getElementById('userAddress').style.display = 'inline-block';
    document.getElementById('saveAddressBtn').style.display = 'inline-block';
  });

  // Handle "Change Phone Number" button click
  document.getElementById('changePhoneBtn').addEventListener('click', () => {
    phoneText.style.display = 'none';
    document.getElementById('userPhone').style.display = 'inline-block';
    document.getElementById('savePhoneBtn').style.display = 'inline-block';
  });

  // Handle "Save Address" button click
  document.getElementById('saveAddressBtn').addEventListener('click', () => {
    const newAddress = document.getElementById('userAddress').value;
    if (newAddress) {
      sessionStorage.setItem('tempAddress', newAddress); // Save temporary address in sessionStorage
      addressText.textContent = newAddress; // Update the address text
      document.getElementById('userAddress').style.display = 'none'; // Hide input
      document.getElementById('saveAddressBtn').style.display = 'none'; // Hide the save button
      addressText.style.display = 'inline-block'; // Show the updated address text
    }
  });

  // Handle "Save Phone Number" button click
  document.getElementById('savePhoneBtn').addEventListener('click', () => {
    const newPhone = document.getElementById('userPhone').value;
    if (newPhone) {
      sessionStorage.setItem('tempPhone', newPhone); // Save temporary phone in sessionStorage
      phoneText.textContent = newPhone; // Update the phone number text
      document.getElementById('userPhone').style.display = 'none'; // Hide input
      document.getElementById('savePhoneBtn').style.display = 'none'; // Hide the save button
      phoneText.style.display = 'inline-block'; // Show the updated phone number text
    }
  });
});

// Function to render the cart items (from previous code)
function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartItemsContainer.innerHTML = ''; // Clear the cart display

  if (cart.length === 0) {
    // Show message if the cart is empty
    const noItemsMessage = document.createElement('div');
    noItemsMessage.classList.add('no-items-message');
    noItemsMessage.textContent = 'No available products in your cart';
    cartItemsContainer.appendChild(noItemsMessage);

    cartTotalEl.textContent = '₱0.00'; // Set total to 0 if cart is empty
    return; // Exit function if no items in the cart
  }

  let defaultTotal = 0; // Total of all items in the cart

  // Render each cart item
  cart.forEach((item) => {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image || 'default-image.png'}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>₱${item.price}</p>
        <div>
          <button class="decrease-quantity" data-id="${item.id}">-</button>
          <span class="item-quantity">${item.quantity}</span>
          <button class="increase-quantity" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="remove-item" data-id="${item.id}">Remove</button>
        <input type="checkbox" class="select-item" data-id="${item.id}">
      </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);

    // Add event listener for removing items from the cart
    cartItemElement.querySelector('.remove-item').addEventListener('click', () => {
      removeFromCart(item.id);
    });

    // Add event listeners for increasing or decreasing quantity
    cartItemElement.querySelector('.decrease-quantity').addEventListener('click', () => {
      updateCartItemQuantity(item.id, item.quantity - 1);
    });
    cartItemElement.querySelector('.increase-quantity').addEventListener('click', () => {
      updateCartItemQuantity(item.id, item.quantity + 1);
    });

    // Calculate default total price
    defaultTotal += item.price * item.quantity;
  });

  cartTotalEl.textContent = defaultTotal.toFixed(2); // Display total initially
}

// Function to remove an item from the cart
function removeFromCart(itemId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const updatedCart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  renderCart(); // Re-render the cart
}

// Function to update item quantity in the cart
function updateCartItemQuantity(itemId, newQuantity) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const updatedCart = cart.map((item) => {
    if (item.id === itemId) {
      return { ...item, quantity: Math.max(1, newQuantity) }; // Ensure quantity is at least 1
    }
    return item;
  });
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  renderCart(); // Re-render the cart
}


function confirmPurchaseAlert(items, totalPrice, tempAddress, tempPhone) {
  let itemDetails = items.map(item => `- Product: ${item.name}\n  Quantity: ${item.quantity}`).join("\n");
  
  return confirm(
    `You are about to purchase:\n` +
    `${itemDetails}\n` +
    `- Total Price: ₱${totalPrice}\n\n` +
    `Shipping To: ${tempAddress}\n` +
    `Contact Number: ${tempPhone}\n\n` +
    `Proceed to checkout?`
  );
}

// Function to handle checkout selection
function handleCheckout() {
  const selectedItems = [];
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const user = JSON.parse(localStorage.getItem('user')) || {}; // Retrieve user info from localStorage

  // Get all selected items
  document.querySelectorAll('.select-item:checked').forEach((checkbox) => {
    const itemId = parseInt(checkbox.dataset.id, 10);
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      selectedItems.push(item);
    }
  });

  // Check if user has provided an address and phone number
  const tempAddress = sessionStorage.getItem('tempAddress') || user.address;
  const tempPhone = sessionStorage.getItem('tempPhone') || user.phone;

  // Check if any items were selected for checkout
  if (selectedItems.length === 0) {
    alert('No items selected. Please select items to checkout.');
    return;
  }

  if (!tempAddress || !tempPhone) {
    alert('Please update your address and phone number before proceeding to checkout.');
    return;
  }

  // Calculate total price
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Confirm purchase with the helper function
  const confirmPurchase = confirmPurchaseAlert(selectedItems, totalPrice, tempAddress, tempPhone);

  if (!confirmPurchase) {
    return; // Exit if user cancels the purchase
  }

  // Create order object with buyer details and items
  const order = {
    buyerName: user.name || 'Anonymous', // Get buyer's name
    buyerEmail: user.email || 'Not Provided', // Get buyer's email
    buyerAddress: tempAddress, // Use updated address or registered address
    buyerPhone: tempPhone, // Use updated phone number or registered phone
    items: selectedItems,
    total: totalPrice, // Calculate total price
    date: new Date().toISOString(),
    status: 'pending', // Initially marked as pending
  };

  // Save the order to localStorage (for the buyer)
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Also save the order to a seller's order list
  const sellerOrders = JSON.parse(localStorage.getItem('sellerOrders')) || [];
  sellerOrders.push(order); // You can customize this to include seller-specific info like seller name, etc.
  localStorage.setItem('sellerOrders', JSON.stringify(sellerOrders));

  // Clear the cart after purchase
  localStorage.setItem('cart', JSON.stringify([])); // Empty the cart after purchase

  renderCart(); // Re-render the cart to reflect the updates

  // Redirect to the checkout success page
  window.location.href = '../buyer/checkout-success.html';  // Redirect to your success page
}

