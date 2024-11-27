document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imageUploadContainer = document.querySelector('.image-upload');
    const removePreviewButton = document.querySelector('.remove-preview');
    const productForm = document.getElementById('productForm');
    const closeBtn = document.querySelector('.close-btn');
    let imageURL = null;

    // Function to generate a unique product ID
    function generateProductId() {
        let productIdCounter = parseInt(localStorage.getItem('productIdCounter')) || 0;
        productIdCounter++;
        localStorage.setItem('productIdCounter', productIdCounter); // Save updated ID counter
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
                imagePreview.innerHTML = `<img src="${imageURL}" alt="Preview" style="max-width: 100%; margin-top:10%;height: auto;border-radius: 8px;">`;
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
    productForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentSellerId = localStorage.getItem('currentSellerId');
if (!currentSellerId) {
    alert('No seller logged in.');
    return;
}

// Use seller-specific key
const sellerProductsKey = `products_${currentSellerId}`;
const products = JSON.parse(localStorage.getItem(sellerProductsKey)) || [];

const productData = {
    id: `prod-${Date.now()}`,
    name: document.getElementById('productName').value,
    description: document.getElementById('productDescription').value,
    category: document.getElementById('productCategory').value,
    price: document.getElementById('productPrice').value,
    size: document.getElementById('productSize').value,
    image: imageURL,
    sellerId: currentSellerId,
    inStock: true
};

products.push(productData);
localStorage.setItem(sellerProductsKey, JSON.stringify(products));

alert('Product added successfully!');

        // Clear form and reset preview
        productForm.reset();
        imagePreview.innerHTML = ''; // Clear preview
        imageUploadContainer.classList.remove('has-preview');
        removePreviewButton.style.display = 'none';
        imageURL = null;
    });
});
