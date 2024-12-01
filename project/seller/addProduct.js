document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imageUploadContainer = document.querySelector('.image-upload');
    const removePreviewButton = document.querySelector('.remove-preview');
    const productForm = document.getElementById('productForm');
    const closeBtn = document.querySelector('.close-btn');
    let imageURL = null;

    function generateProductId() {
        // Retrieve the counter, initialize it to 0 if not found or invalid
        let productIdCounter = parseInt(localStorage.getItem('productIdCounter'));
        if (isNaN(productIdCounter)) {
            console.warn('Invalid or missing productIdCounter. Initializing to 0.');
            productIdCounter = 0;
        }
    
        // Increment and save the counter
        productIdCounter++;
        localStorage.setItem('productIdCounter', productIdCounter);
    
        // Return the unique product ID
        return `prod-${productIdCounter}`;
    }
    

    // Handle file input change
    imageUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imageURL = e.target.result;

                // Display image preview
                imagePreview.innerHTML = `<img src="${imageURL}" alt="Preview" style="max-width: 100%; margin-top:10%; height: auto; border-radius: 8px;">`;
                imageUploadContainer.classList.add('has-preview');
                removePreviewButton.style.display = 'block'; // Show the remove button
            };

            reader.onerror = function () {
                alert('Error reading file. Please try again.');
            };

            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            alert('No file selected. Please choose an image.');
        }
    });

    // Handle remove preview button
    removePreviewButton.addEventListener('click', function (e) {
        e.preventDefault();
        imageURL = null;
        imagePreview.innerHTML = ''; // Clear the preview
        imageUpload.value = ''; // Clear the file input
        imageUploadContainer.classList.remove('has-preview');
        removePreviewButton.style.display = 'none'; // Hide the remove button
    });

    // Handle close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            window.location.href = 'sellerDash.html';
        });
    }

    // Handle product form submission
    // Handle product form submission
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Check if an image is uploaded
    if (!imageURL) {
        alert('Please upload a product image before submitting.');
        return;
    }

    const currentSellerId = localStorage.getItem('currentSellerId');
    if (!currentSellerId) {
        alert('No seller logged in.');
        return;
    }

    const pendingProductsKey = `pending_products_${currentSellerId}`;
    const pendingProducts = JSON.parse(localStorage.getItem(pendingProductsKey)) || [];

    const productData = {
        id: generateProductId(),
        name: document.getElementById('productName').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        size: document.getElementById('productSize').value,
        origin: document.getElementById('productOrigin').value.trim(), // New field
        image: imageURL,
        sellerId: currentSellerId,
        inStock: false,
    };
    

    pendingProducts.push(productData);
    localStorage.setItem(pendingProductsKey, JSON.stringify(pendingProducts));

    // Debugging the saved pending products
    console.log('Pending Products:', JSON.parse(localStorage.getItem(pendingProductsKey)));

    alert('Product submitted for approval!');
    productForm.reset();
    imagePreview.innerHTML = '';
    imageUploadContainer.classList.remove('has-preview');
    removePreviewButton.style.display = 'none';
    imageURL = null;
});

});    
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}