document.addEventListener('DOMContentLoaded', () => {
  renderCart(); // Render the cart initially
  
  // Pre-fill user information (if available)
  const currentBuyerId = localStorage.getItem('currentBuyerId');
  const users = JSON.parse(localStorage.getItem('users')) || [];

  currentUser = users.find(user => user.id === currentBuyerId);
  const tempAddress = sessionStorage.getItem('tempAddress') || currentUser.address;
  const tempPhone = sessionStorage.getItem('tempPhone') || currentUser.phone;

  // Set values to temporary address and phone if they exist
  const addressText = document.getElementById('addressText');
  const phoneText = document.getElementById('phoneText');
  addressText.textContent = tempAddress || 'No Address Provided';
  phoneText.textContent = tempPhone || 'No Phone Number Provided';

  // Pre-fill input fields with session data or default user data
  document.getElementById('userAddress').value = tempAddress || '';
  document.getElementById('userPhone').value = tempPhone || '';

  // Handle "Change Address" link click
  document.getElementById('changeAddressText').addEventListener('click', () => {
    addressText.style.display = 'none';
    document.getElementById('userAddress').style.display = 'inline-block';
    document.getElementById('saveAddressBtn').style.display = 'inline-block';
  });

  // Handle "Change Phone Number" link click
  document.getElementById('changePhoneText').addEventListener('click', () => {
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

function calculateTotal() {
  const currentBuyerId = localStorage.getItem('currentBuyerId');
  if (!currentBuyerId) {
    alert('Please log in to view your cart.');
    return;
  }

  const cartKey = `cart_${currentBuyerId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  let total = 0;

  const selectedCheckboxes = document.querySelectorAll('.select-item:checked');
  console.log('Selected Checkboxes:', selectedCheckboxes); // Debug log

  selectedCheckboxes.forEach((checkbox) => {
    const itemId = checkbox.dataset.id;
    const seller = checkbox.dataset.seller;

    const item = cart.find(cartItem => cartItem.id === itemId && cartItem.seller === seller);
    console.log('Selected Item:', item); // Debug log

    if (item) {
      total += item.price * item.quantity; // Multiply by item.quantity to account for multiple quantities
    }
  });

  console.log('Calculated Total:', total); // Debug log
  const cartTotalEl = document.getElementById('cartTotal');
  cartTotalEl.textContent = `₱${total.toFixed(2)}`;
}



// Function to render the cart items (from previous code)
function renderCart() {
  const currentBuyerId = localStorage.getItem('currentBuyerId');
  if (!currentBuyerId) {
    alert('Please log in to view your cart.');
    return;
  }

  const cartKey = `cart_${currentBuyerId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  cartItemsContainer.innerHTML = ''; // Clear the cart content

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>No items in the cart.</p>';
    cartTotalEl.textContent = '₱0.00';
    return;
  }

  // Group items by seller
  const groupedBySeller = cart.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {});

  let totalPrice = 0;

  Object.keys(groupedBySeller).forEach(seller => {
    // Create a container for each seller
    const sellerContainer = document.createElement('div');
    sellerContainer.classList.add('seller-section');

    // Add seller name or ID at the top
    const sellerName = document.createElement('h3');
    sellerName.classList.add('seller-name');
    sellerName.textContent = `Seller: ${seller}`;
    sellerContainer.appendChild(sellerName);

    // Add products for the seller
    groupedBySeller[seller].forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('cart-item');
      cartItemElement.innerHTML = `
          <input type="checkbox" class="select-item" data-id="${item.id}" data-seller="${item.seller}">
          <div class="cart-item-image">
              <img src="${item.image || 'default-image.png'}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>Price: ₱${item.price}</p>
          </div>
          <div class="cart-item-controls">
              <button class="decrease-quantity">-</button>
              <span class="item-quantity">${item.quantity}</span>
              <button class="increase-quantity">+</button>
          </div>
          <div class="cart-item-actions">
              <button class="remove-item">Remove</button>
          </div>
      `;
      totalPrice += item.price * item.quantity;

      // Attach event listeners for buttons
      const decreaseBtn = cartItemElement.querySelector('.decrease-quantity');
      const increaseBtn = cartItemElement.querySelector('.increase-quantity');
      const removeBtn = cartItemElement.querySelector('.remove-item');
      const checkbox = cartItemElement.querySelector('.select-item');

      decreaseBtn.addEventListener('click', () => {
        updateCartItemQuantity(item.id, item.seller, -1);
      });

      increaseBtn.addEventListener('click', () => {
        updateCartItemQuantity(item.id, item.seller, 1);
      });

      removeBtn.addEventListener('click', () => {
        removeFromCart(item.id, item.seller);
      });

      checkbox.addEventListener('change', calculateTotal);

      sellerContainer.appendChild(cartItemElement);
    });

    // Append seller container to cart
    cartItemsContainer.appendChild(sellerContainer);
  });

  cartTotalEl.textContent = `₱${totalPrice.toFixed(2)}`;
}






// Function to remove an item from the cart
function removeFromCart(itemId, seller) {
  const currentBuyerId = localStorage.getItem('currentBuyerId');
  if (!currentBuyerId) return;

  const cartKey = `cart_${currentBuyerId}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  cart = cart.filter(item => !(item.id === itemId && item.seller === seller));

  localStorage.setItem(cartKey, JSON.stringify(cart));
  renderCart(); // Re-render the cart
}




// Function to update item quantity in the cart
function updateCartItemQuantity(itemId, seller, change) {
  const currentBuyerId = localStorage.getItem('currentBuyerId');
  if (!currentBuyerId) return;

  const cartKey = `cart_${currentBuyerId}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  cart = cart.map(item => {
    if (item.id === itemId && item.seller === seller) {
      const newQuantity = item.quantity + change;
      return { ...item, quantity: Math.max(1, newQuantity) }; // Ensure quantity is at least 1
    }
    return item;
  });

  localStorage.setItem(cartKey, JSON.stringify(cart));
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
  const currentBuyerId = localStorage.getItem('currentBuyerId');
  if (!currentBuyerId) {
    alert('Please log in to proceed with checkout.');
    return;
  }

  const cartKey = `cart_${currentBuyerId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(user => user.id === currentBuyerId);

  if (!currentUser) {
    alert('User not found. Please log in again.');
    return;
  }

  const selectedItems = [];
  document.querySelectorAll('.select-item:checked').forEach((checkbox) => {
    const itemId = checkbox.dataset.id;
    const seller = checkbox.dataset.seller;
    const item = cart.find(cartItem => cartItem.id === itemId && cartItem.seller === seller);
    if (item) {
      selectedItems.push(item);
    }
  });

  if (selectedItems.length === 0) {
    alert('No items selected. Please select items to checkout.');
    return;
  }

  let tempAddress = sessionStorage.getItem('tempAddress') || currentUser.address || '';
  let tempPhone = sessionStorage.getItem('tempPhone') || currentUser.phone || '';

  if (!tempAddress.trim() || !tempPhone.trim()) {
    alert('Please update your address and phone number before proceeding to checkout.');
    return;
  }

  // Group items by seller
  const groupedItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {});

  // Process each seller's order
  Object.keys(groupedItems).forEach(seller => {
    const sellerItems = groupedItems[seller];
    const sellerTotal = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = {
      id: `order-${Date.now()}`, // Unique order ID for each seller
      buyerId: currentBuyerId,
      buyerName: currentUser.name || 'Anonymous',
      buyerPhone: tempPhone,
      buyerAddress: tempAddress,
      items: sellerItems,
      total: sellerTotal,
      date: new Date().toISOString(),
      status: 'pending',
      sellerId: seller,
    };

    // Save the order to the seller's orders
    const sellerOrdersKey = `orders_${seller}`;
    const sellerOrders = JSON.parse(localStorage.getItem(sellerOrdersKey)) || [];
    sellerOrders.push(order);
    localStorage.setItem(sellerOrdersKey, JSON.stringify(sellerOrders));

    // Save the order to the buyer's orders
    const buyerOrdersKey = `orders_${currentBuyerId}`;
    const buyerOrders = JSON.parse(localStorage.getItem(buyerOrdersKey)) || [];
    buyerOrders.push(order);
    localStorage.setItem(buyerOrdersKey, JSON.stringify(buyerOrders));
  });

  // Clear checked-out items from the buyer's cart
  const updatedCart = cart.filter(cartItem =>
    !selectedItems.some(selected => selected.id === cartItem.id && selected.seller === cartItem.seller)
  );
  localStorage.setItem(cartKey, JSON.stringify(updatedCart));

  renderCart(); // Update the UI
  window.location.href = '../buyer/checkout-success.html';
}

checkoutBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  handleCheckout();
});

document.addEventListener('DOMContentLoaded', () => {
  renderCart(); // Render the cart
});
