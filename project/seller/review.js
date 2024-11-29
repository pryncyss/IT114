document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('productList');
    const reviewModal = document.getElementById('reviewModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalRating = document.getElementById('modalRating');
    const modalReviews = document.getElementById('modalReviews');

    const currentSellerId = localStorage.getItem('currentSellerId');
    const sellerProductsKey = `products_${currentSellerId}`;
    const reviewsKey = `reviews_${currentSellerId}`;

    // Helper function to generate star ratings
    function generateStarRating(rating) {
        const filledStars = '★'.repeat(Math.floor(rating));
        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
        return `<span style="color: #f1c40f;">${filledStars}</span><span style="color: #ccc;">${emptyStars}</span>`;
    }

    // Load products for the current seller
    function loadProducts() {
        const products = JSON.parse(localStorage.getItem(sellerProductsKey)) || [];
        const allReviews = JSON.parse(localStorage.getItem(reviewsKey)) || {};

        productList.innerHTML = '';

        products.forEach((product) => {
            const productReviews = allReviews[product.name] || [];
            const averageRating =
                productReviews.length > 0
                    ? (
                          productReviews.reduce((sum, review) => sum + review.rating, 0) /
                          productReviews.length
                      ).toFixed(1)
                    : 'No ratings';

            const productCard = document.createElement('div');
            productCard.classList.add('productCard');
            productCard.innerHTML = `
                <div class="image-wrapper">
                    <img src="${product.image || 'default-image.jpg'}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p class="price">₱${product.price}/KG</p>
                <p>${averageRating} • ${productReviews.length} Review(s)</p>
            `;
            productCard.addEventListener('click', () => openModal(product, productReviews));
            productList.appendChild(productCard);
        });
    }

    // Open modal and display product reviews
    function openModal(product, reviews) {
        modalImage.src = product.image || 'default-image.jpg';
        modalTitle.textContent = product.name;
        modalRating.textContent = `${reviews.length} Review(s)`;

        modalReviews.innerHTML = reviews.length
            ? reviews
                  .map(
                      (review, index) => `
                <div class="review">
                    <div class="review-header">
                        <strong>${review.buyer}</strong>
                        <small>${review.date}</small>
                    </div>
                    <div>${generateStarRating(review.rating)}</div>
                    <p>${review.comment}</p>
                    ${
                        review.reply
                            ? `<div class="reply"><strong>Seller Reply:</strong> ${review.reply}</div>`
                            : `
                        <div class="reply-form">
                            <textarea id="replyInput-${index}" placeholder="Write a reply..."></textarea>
                            <button onclick="submitReply(${index}, '${product.name}')">Reply</button>
                        </div>
                    `
                    }
                </div>
            `
                  )
                  .join('')
            : '<p>No reviews available for this product.</p>';

        reviewModal.style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        reviewModal.style.display = 'none';
    }

    // Close modal when clicking outside the modal content
    reviewModal.addEventListener('click', (event) => {
        if (event.target === reviewModal) {
            closeModal();
        }
    });

    // Submit reply
    window.submitReply = function (index, productName) {
        const replyInput = document.getElementById(`replyInput-${index}`);
        const replyText = replyInput.value.trim();

        if (!replyText) {
            alert('Reply cannot be empty.');
            return;
        }

        const allReviews = JSON.parse(localStorage.getItem(reviewsKey)) || {};
        const productReviews = allReviews[productName] || [];

        productReviews[index].reply = replyText;
        allReviews[productName] = productReviews;
        localStorage.setItem(reviewsKey, JSON.stringify(allReviews));

        openModal({ name: productName }, productReviews);
    };

    // Initialize
    loadProducts();

    // Attach event listener to close button
    document.querySelector('.close-btn').addEventListener('click', closeModal);
});

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}