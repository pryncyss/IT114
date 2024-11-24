document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imageUploadContainer = document.querySelector('.image-upload');
    const removePreviewButton = document.querySelector('.remove-preview');
    const closeBtn = document.querySelector('.close-btn');
    let imageURL = null;

    // Function to generate a unique product ID
    function generateProductId() {
        let productIdCounter = parseInt(localStorage.getItem('productIdCounter')) || 0;
        productIdCounter++;
        localStorage.setItem('productIdCounter', productIdCounter); // Save updated ID counter
        return productIdCounter;
    }

    // Image upload functionality
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imageURL = e.target.result;
                
                // Create and show preview
                imagePreview.innerHTML = `<img src="${imageURL}" alt="Preview">`;
                imageUploadContainer.classList.add('has-preview');
                removePreviewButton.style.display = 'flex';
            };
            
            reader.readAsDataURL(file);
        }
    });

    closeBtn.addEventListener('click', function() {
        window.location.href = 'sellerDash.html';
    });

    // Remove preview functionality
    removePreviewButton.addEventListener('click', function(e) {
        e.preventDefault();
        imageURL = null;
        imagePreview.innerHTML = '';
        imageUpload.value = ''; // Reset file input
        imageUploadContainer.classList.remove('has-preview');
        removePreviewButton.style.display = 'none';
    });

    // Product form submission
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const productData = {
            id: generateProductId(),  // Generate a unique ID
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value,
            price: document.getElementById('productPrice').value,
            size: document.getElementById('productSize').value,
            image: imageURL,
            inStock: true // Default to "In Stock"
        };

        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData); // Add the new product
        localStorage.setItem('products', JSON.stringify(products)); // Update the products in localStorage

        alert('Product added successfully!');

        // Reset the form and preview
        productForm.reset();
        imagePreview.innerHTML = '';
        imageUploadContainer.classList.remove('has-preview');
        removePreviewButton.style.display = 'none';
        imageURL = null;
    });
});
