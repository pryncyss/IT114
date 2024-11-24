document.addEventListener("DOMContentLoaded", () => {
    const productsList = document.getElementById('products-list');
    const orderTotalElement = document.getElementById('order-total');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const quantities = JSON.parse(localStorage.getItem('quantities')) || {};

    let totalAmount = 0;

    if (cart.length > 0) {
        cart.forEach((product) => {
            const quantity = quantities[product] || 1;
            const pricePerKg = getProductPrice(product);
            const itemSubtotal = quantity * pricePerKg;

            totalAmount += itemSubtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${getProductImage(product)}" alt="${product}" class="product-image">
                    ${product}
                </td>
                <td>
                    <button class="minus-btn">-</button>
                    <span>${quantity}</span>
                    <button class="plus-btn">+</button>
                </td>
                <td>
                    ₱${itemSubtotal.toFixed(2)}
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            productsList.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" style="text-align: center;">No products in cart.</td>`;
        productsList.appendChild(row);
    }

    orderTotalElement.textContent = `₱${totalAmount.toFixed(2)}`;

    productsList.addEventListener('click', (event) => {
        const button = event.target;
        const row = button.closest('tr');
        const productName = row.querySelector('td:nth-child(1)').textContent.trim();

        if (button.classList.contains('plus-btn')) {
            quantities[productName] = (quantities[productName] || 1) + 1;
        } else if (button.classList.contains('minus-btn')) {
            if (quantities[productName] > 1) quantities[productName] -= 1;
        } else if (button.classList.contains('delete-btn')) {
            cart.splice(cart.indexOf(productName), 1);
            delete quantities[productName];
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('quantities', JSON.stringify(quantities));
        location.reload();
    });

    document.querySelector('.place-order button').addEventListener('click', () => {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        localStorage.removeItem('quantities');
        window.location.href = '../products/products.html';
    });

    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
        document.getElementById('address-details').textContent = savedAddress;
    }

    document.getElementById('change-address-btn').addEventListener('click', () => {
        document.getElementById('address-form').style.display = 'block';
    });

    document.getElementById('save-address-btn').addEventListener('click', () => {
        const newAddress = document.getElementById('address-input').value;
        if (newAddress) {
            document.getElementById('address-details').textContent = newAddress;
            document.getElementById('address-form').style.display = 'none';
            localStorage.setItem('deliveryAddress', newAddress);
        }
    });
});

const getProductPrice = (product) => {
    const prices = {
        "White Leg Shrimp": 330,
        "Tilapia": 180,
        "Bangus": 180,
        "Lato (Seaweed)": 80,
        "Blue Swimming Crab": 350,
        "Black Tiger Prawn": 330,
        "Tamban": 160,
    };
    return prices[product] || 0;
};

const getProductImage = (product) => {
    const images = {
        "White Leg Shrimp": "../images/product/whiteshrimp.png",
        "Tilapia": "../images/product/tilapia.png",
        "Bangus": "../images/product/Bangus.png",
        "Lato (Seaweed)": "../images/product/latoseaweeds.png",
        "Blue Swimming Crab": "../images/product/bluecrab.png",
        "Black Tiger Prawn": "../images/product/shrimpPrawns.png",
        "Tamban": "../images/product/tamban.png",
    };
    return images[product] || "../images/product/default.png";
};
