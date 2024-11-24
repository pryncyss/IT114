document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.querySelector('.search-icon');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('productSearch');
    const searchResults = document.getElementById('searchResults');
    const productCards = document.querySelectorAll('.product-card');

    // Open search modal
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.style.display = 'flex';
        searchInput.focus();
    });

    // Close search modal
    closeSearch.addEventListener('click', () => {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Close modal when clicking outside
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const matchedProducts = [];

        // Find matching products
        productCards.forEach(card => {
            const productName = card.dataset.product.toLowerCase();
            const productCategory = card.dataset.category.toLowerCase();
            
            // Search by product name or category
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                matchedProducts.push({
                    name: card.dataset.product,
                    category: card.dataset.category,
                    price: card.querySelector('p').textContent,
                    image: card.querySelector('img').src,
                    element: card
                });
            }
        });

        // Clear previous results
        searchResults.innerHTML = '';

        // Display search results
        if (matchedProducts.length > 0) {
            matchedProducts.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.innerHTML = `
                    <div class="result-details">
                        <strong>${product.name}</strong>
                        <span>${product.category}</span>
                        <span>${product.price}</span>
                    </div>
                `;
                
                // Highlight the product when result is clicked
                resultItem.addEventListener('click', () => {
                    // Remove any previous highlights
                    productCards.forEach(card => card.style.border = 'none');
                    
                    // Highlight the selected product
                    product.element.style.border = '2px solid #007bff';
                    
                    // Scroll to the product
                    product.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Close search modal
                    searchModal.style.display = 'none';
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                });

                searchResults.appendChild(resultItem);
            });
        } else {
            // No results found
            const noResultsDiv = document.createElement('div');
            noResultsDiv.classList.add('no-results');
            noResultsDiv.textContent = 'No products found';
            searchResults.appendChild(noResultsDiv);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.querySelector('.search-icon');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('productSearch');
    const searchResults = document.getElementById('searchResults');
    const productCards = document.querySelectorAll('.product-card');

    // Open search modal
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.style.display = 'flex';
        searchInput.focus();
    });

    // Close search modal
    closeSearch.addEventListener('click', () => {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Close modal when clicking outside
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const matchedProducts = [];

        // Find matching products
        productCards.forEach(card => {
            const productName = card.dataset.name.toLowerCase();
            if (productName.includes(searchTerm)) {
                matchedProducts.push({
                    name: card.dataset.name,
                    price: card.dataset.price,
                    image: card.dataset.image,
                    element: card
                });
            }
        });

        // Clear previous results
        searchResults.innerHTML = '';

        // Display search results
        if (matchedProducts.length > 0) {
            matchedProducts.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="result-details">
                        <strong>${product.name}</strong>
                        <span>${product.price}</span>
                    </div>
                `;
                
                // Highlight the product when result is clicked
                resultItem.addEventListener('click', () => {
                    // Remove any previous highlights
                    productCards.forEach(card => card.style.border = 'none');
                    
                    // Highlight the selected product
                    product.element.style.border = '2px solid #007bff';
                    
                    // Scroll to the product
                    product.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Close search modal
                    searchModal.style.display = 'none';
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                });

                searchResults.appendChild(resultItem);
            });
        } else {
            // No results found
            const noResultsDiv = document.createElement('div');
            noResultsDiv.classList.add('no-results');
            noResultsDiv.textContent = 'No products found';
            searchResults.appendChild(noResultsDiv);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Quantity modal functionality
    const quantityModal = document.getElementById('quantity-modal');
    const quantityInput = document.getElementById('quantity-input');
    const confirmQuantityButton = document.getElementById('confirm-quantity');
    const cancelQuantityButton = document.getElementById('cancel-quantity');
    const decreaseQuantityButton = document.getElementById('decrease-quantity');
    const increaseQuantityButton = document.getElementById('increase-quantity');

    // Cart functionality
    const viewCartButton = document.getElementById('view-cart');
    const checkoutButton = document.getElementById('checkout');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items');
    const closeCartButton = document.getElementById('close-cart');

    let selectedProducts = JSON.parse(localStorage.getItem('cart')) || [];
    let productQuantities = JSON.parse(localStorage.getItem('quantities')) || {};
    let currentProduct = null;

    // Filter logic
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            productCards.forEach((card) => {
                const productCategory = card.getAttribute('data-category');
                card.style.display = category === 'all' || productCategory === category ? '' : 'none';
            });
        });
    });



    // Open quantity modal
    const openQuantityModal = (productName) => {
        currentProduct = productName;
        quantityInput.value = productQuantities[productName] || 1;
        quantityModal.classList.remove('hidden');
    };

    // Close quantity modal
    const cancelQuantityModal = () => {
    // Reset the current product
    currentProduct = null;

    // Hide the quantity modal
    quantityModal.classList.add('hidden');

    // Deselect any selected product card
    const selectedCard = document.querySelector('.product-card.selected');
    if (selectedCard) {
        selectedCard.classList.remove('selected');
    }

    // Reset quantity input to default (1)
    quantityInput.value = 1;
};

// Add event listener to the cancel quantity button
cancelQuantityButton.addEventListener('click', cancelQuantityModal);

    // Confirm quantity
    confirmQuantityButton.addEventListener('click', () => {
        if (currentProduct) {
            productQuantities[currentProduct] = parseInt(quantityInput.value, 10) || 1;

            if (!selectedProducts.includes(currentProduct)) {
                selectedProducts.push(currentProduct);
            }

            localStorage.setItem('cart', JSON.stringify(selectedProducts));
            localStorage.setItem('quantities', JSON.stringify(productQuantities));

            // Deselect product card after confirmation
            const productCard = document.querySelector(`.product-card[data-product="${currentProduct}"]`);
            if (productCard) {
                productCard.classList.remove('selected');
            }

            closeQuantityModal();
            syncCartUI();
        }
    });

    // Quantity adjustment
    decreaseQuantityButton.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value, 10) || 1;
        quantityInput.value = currentValue > 1 ? currentValue - 1 : 1;
    });

    increaseQuantityButton.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value, 10) || 1;
        quantityInput.value = currentValue + 1;
    });

    // Product card selection
    productCards.forEach((card) => {
        card.addEventListener('click', () => {
            const productName = card.getAttribute('data-product');
            card.classList.add('selected');
            openQuantityModal(productName);
        });
    });

    // Sync cart UI
    // Sync cart UI
const syncCartUI = () => {
    cartItemsList.innerHTML = '';

    if (selectedProducts.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty!</li>';
        checkoutButton.disabled = true; // Disable checkout button when cart is empty
        checkoutButton.classList.remove('enabled'); // Ensure no active styling
    } else {
        selectedProducts.forEach((product) => {
            const listItem = document.createElement('li');
            const quantity = productQuantities[product] || 1;

            listItem.innerHTML = `
                <span>${product}</span>
                <span>Quantity: ${quantity}</span>
                <button class="delete-btn" data-product="${product}">Delete</button>
            `;

            cartItemsList.appendChild(listItem);
        });

        checkoutButton.disabled = false; // Enable checkout button when cart is not empty
        checkoutButton.classList.add('enabled'); // Add active styling
    }
};


    // Delete product from cart
    cartItemsList.addEventListener('click', (event) => {
        const button = event.target;

        if (button.classList.contains('delete-btn')) {
            const product = button.getAttribute('data-product');
            selectedProducts = selectedProducts.filter((item) => item !== product);
            delete productQuantities[product];

            localStorage.setItem('cart', JSON.stringify(selectedProducts));
            localStorage.setItem('quantities', JSON.stringify(productQuantities));

            syncCartUI();
        }
    });

    // View cart
    viewCartButton.addEventListener('click', () => {
        syncCartUI();
        cartModal.classList.remove('hidden');
    });

    // Close cart modal
    closeCartButton.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    // Restore cart on page load
    const restoreCart = () => {
        selectedProducts = JSON.parse(localStorage.getItem('cart')) || [];
        productQuantities = JSON.parse(localStorage.getItem('quantities')) || {};
        syncCartUI();
    };

    // Checkout functionality
    checkoutButton.addEventListener('click', () => {
        if (selectedProducts.length > 0) {
            window.location.href = '../checkout/checkout.html';
        }
    });

    // Restore cart on load
    restoreCart();
});
