document.addEventListener("DOMContentLoaded", () => {
    const ordersTableBody = document.querySelector("#ordersTable tbody");
    const categoryFilter = document.querySelector("#filterCategory");
    const sellerIDFilter = document.querySelector("#filterSellerID");
    const orderIDFilter = document.querySelector("#filterOrderID");
    const dateFilter = document.querySelector("#filterDate"); // Type date input (outputs yyyy-mm-dd)
    const applyFilterButton = document.querySelector("#applyFilter");
    const clearFilterButton = document.querySelector("#clearFilter");
    const sortButton = document.getElementById("sortPriceButton");

    let sortState = "none"; // Track sorting state
    const originalOrders = [
        { OrderID: 1, SellerID: 101, Product: "Bangus", Description: "Fresh Bangus", Category: "Fish", Quantity: 10, Price: 250, Date: "11/01/2024" },
        { OrderID: 2, SellerID: 102, Product: "Tilapia", Description: "Fresh Tilapia", Category: "Fish", Quantity: 15, Price: 200, Date: "11/02/2024" },
        { OrderID: 3, SellerID: 103, Product: "whiteshrimp", Description: "White Leg Shrimp", Category: "Prawn", Quantity: 20, Price: 400, Date: "11/03/2024" },
        { OrderID: 4, SellerID: 104, Product: "bluecrab", Description: "Blue Swimming Crab", Category: "Crabs", Quantity: 5, Price: 600, Date: "11/04/2024" },
        { OrderID: 5, SellerID: 105, Product: "latoseaweeds", Description: "Lato (Seaweed)", Category: "Seaweed", Quantity: 25, Price: 120, Date: "11/05/2024" },
        { OrderID: 6, SellerID: 106, Product: "Milkfish", Description: "Fresh Milkfish", Category: "Fish", Quantity: 12, Price: 230, Date: "11/06/2024" },
        { OrderID: 7, SellerID: 107, Product: "Shrimp", Description: "Small Shrimp", Category: "Prawn", Quantity: 18, Price: 320, Date: "11/07/2024" },
        { OrderID: 8, SellerID: 108, Product: "Mussels", Description: "Fresh Mussels", Category: "Seaweed", Quantity: 30, Price: 180, Date: "11/08/2024" },
        { OrderID: 9, SellerID: 109, Product: "Crabs", Description: "Fresh Crabs", Category: "Crabs", Quantity: 7, Price: 500, Date: "11/09/2024" },
        { OrderID: 10, SellerID: 110, Product: "Seaweed", Description: "Dried Seaweed", Category: "Seaweed", Quantity: 15, Price: 140, Date: "11/10/2024" },
    ];

    // Copy of the original orders for reset
    let orders = [...originalOrders];

    // Save initial orders to local storage
    localStorage.setItem("filteredOrders", JSON.stringify(orders));

    // Utility to format date from yyyy-mm-dd to mm/dd/yyyy
    const formatDateToMMDDYYYY = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${month}/${day}/${year}`; // Convert to mm/dd/yyyy
    };

    // Listen for changes in the date input and format it to mm/dd/yyyy
    dateFilter.addEventListener("change", (event) => {
        const originalDate = event.target.value; // yyyy-mm-dd
        if (originalDate) {
            const formattedDate = formatDateToMMDDYYYY(originalDate);
            event.target.setAttribute("data-formatted-date", formattedDate); // Store formatted date for consistency
        }
    });

    // Display Orders in the Table
    const displayOrders = (data) => {
        ordersTableBody.innerHTML = ""; // Clear existing rows
        data.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.OrderID}</td>
                <td>${order.SellerID}</td>
                <td>${order.Product}</td>
                <td>${order.Description}</td>
                <td>${order.Category}</td>
                <td>${order.Quantity}</td>
                <td>₱${order.Price}</td>
                <td>${order.Date}</td>
                <td class="actions">
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    };

    // Fetch orders from local storage
    const fetchOrders = () => JSON.parse(localStorage.getItem("filteredOrders")) || [];

    // Sort Orders by Price
    // Sort Orders by Price
    const sortOrdersByPrice = () => {
    let currentOrders = [...fetchOrders()]; // Get a fresh copy of the orders

    if (sortState === "none") {
        // Sort by ascending
        currentOrders.sort((a, b) => a.Price - b.Price);
        sortState = "ascending";
        sortButton.textContent = "Sort by Price (Descending)";
    } else if (sortState === "ascending") {
        // Sort by descending
        currentOrders.sort((a, b) => b.Price - a.Price);
        sortState = "descending";
        sortButton.textContent = "Sort by Price (None)";
    } else {
        // Reset to original order
        currentOrders = [...originalOrders];
        sortState = "none";
        sortButton.textContent = "Sort by Price (Ascending)";
    }

    displayOrders(currentOrders);
};


    // Apply Filters
    const applyFilters = () => {
        let filteredOrders = fetchOrders();
        const selectedCategory = categoryFilter.value;
        const sellerID = sellerIDFilter.value.trim();
        const orderID = orderIDFilter.value.trim();
        const selectedDate = dateFilter.getAttribute("data-formatted-date"); // Get the mm/dd/yyyy value

        // Filter by Category
        if (selectedCategory && selectedCategory !== "all") {
            filteredOrders = filteredOrders.filter(order => order.Category === selectedCategory);
        }

        // Filter by SellerID
        if (sellerID) {
            filteredOrders = filteredOrders.filter(order => order.SellerID.toString() === sellerID);
        }

        // Filter by OrderID
        if (orderID) {
            filteredOrders = filteredOrders.filter(order => order.OrderID.toString() === orderID);
        }

        // Filter by Date
        if (selectedDate) {
            filteredOrders = filteredOrders.filter(order => order.Date === selectedDate);
        }

        displayOrders(filteredOrders);
    };

    // Clear Filters
    const clearFilters = () => {
        categoryFilter.value = "all";
        sellerIDFilter.value = "";
        orderIDFilter.value = "";
        dateFilter.value = "";
        dateFilter.removeAttribute("data-formatted-date"); // Remove formatted date attribute
        displayOrders(fetchOrders());
    };

    // Attach event listeners
    applyFilterButton.addEventListener("click", applyFilters);
    clearFilterButton.addEventListener("click", clearFilters);
    sortButton.addEventListener("click", sortOrdersByPrice);

    // Initial display
    displayOrders(fetchOrders());
});
