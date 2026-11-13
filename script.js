
// FOOD ITEMS

const biryanis = [
    { name: "Chicken Dum Biryani", price: 240, image: "images/chicken-biryani.jpg" },
    { name: "Mutton Dum Biryani", price: 400, image: "images/mutton-biryani.jpg" },
    { name: "Veg Dum Biryani", price: 200, image: "images/veg-biryani.jpg" },
    { name: "Prawns Dum Biryani", price: 280, image: "images/prawns-biryani.jpg" },
    { name: "Fish Dum Biryani", price: 260, image: "images/fish-biryani.jpg" },
    { name: "Mushroom Biryani", price: 240, image: "images/mushroom-biryani.jpg" }
];

const curries = [
    { name: "Chicken Gravy", price: 220, image: "images/chicken-gravy.jpg" },
    { name: "Mutton Gravy", price: 280, image: "images/mutton-gravy.jpg" },
    { name: "Prawns Gravy", price: 260, image: "images/prawns-gravy.jpg" },
    { name: "Crabs Gravy", price: 270, image: "images/crabs-gravy.jpg" },
    { name: "Egg Bhurji", price: 120, image: "images/egg-bhurji.jpg" },
    { name: "Egg Curry", price: 140, image: "images/egg-curry.jpg" }
];

const riceItems = [
    { name: "Plain Rice", price: 60, image: "images/plain-rice.jpg" },
    { name: "Bagara Rice", price: 80, image: "images/bagara-rice.jpg" }
];


// SHOPPING CART

let cart = JSON.parse(localStorage.getItem("cookingWorldCart")) || [];


// DISPLAY FOOD CARDS

function displayFoods(items, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = items.map((food, index) => `
        <div class="food-card">
            <img src="${food.image}" alt="${food.name}">
            <h4>${food.name}</h4>

            <label>Select Size:</label>

            <select id="quantity-${containerId}-${index}">
                <option value="Half">Half</option>
                <option value="Full">Full</option>
            </select>

            <p>
                Half: ₹${Math.round(food.price / 2)}
                | Full: ₹${food.price}
            </p>

            <button onclick="addToCart('${containerId}', ${index})">
                Add to Cart
            </button>
        </div>
    `).join("");
}


// ADD TO CART

function addToCart(containerId, index) {
    let items;

    if (containerId === "biryani-list") {
        items = biryanis;
    } else if (containerId === "curry-list") {
        items = curries;
    } else if (containerId === "rice-list") {
        items = riceItems;
    } else {
        return;
    }

    const food = items[index];

    const select = document.getElementById(
        `quantity-${containerId}-${index}`
    );

    if (!food || !select) return;

    addItem(food, select.value);
}


// COMMON ADD ITEM FUNCTION

function addItem(food, size) {
    const price = size === "Half"
        ? Math.round(food.price / 2)
        : food.price;

    const existingItem = cart.find(
        item => item.name === food.name && item.size === size
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: food.name,
            size: size,
            price: price,
            image: food.image,
            quantity: 1
        });
    }

    updateCart();
}


// UPDATE CART

function updateCart() {
    localStorage.setItem("cookingWorldCart", JSON.stringify(cart));

    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    const cartCountElement = document.getElementById("cart-count");

    const itemCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cartCountElement) {
        cartCountElement.textContent = itemCount;
    }

    if (cartContainer) {
        cartContainer.innerHTML = cart.length
            ? cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">

                    <p>
                        ${item.name} (${item.size}) × ${item.quantity}
                        — ₹${item.price * item.quantity}
                    </p>

                    <button onclick="changeQuantity('${item.name}', '${item.size}', -1)">-</button>

                    <button onclick="changeQuantity('${item.name}', '${item.size}', 1)">+</button>

                    <button onclick="removeFromCart('${item.name}', '${item.size}')">
                        Remove
                    </button>
                </div>
            `).join("")
            : "<p>Your cart is empty.</p>";
    }

    if (totalElement) {
        totalElement.textContent = "Total: ₹" + total;
    }
}


// CHANGE QUANTITY

function changeQuantity(name, size, change) {
    const item = cart.find(
        item => item.name === name && item.size === size
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(
            item => !(item.name === name && item.size === size)
        );
    }

    updateCart();
}


// REMOVE ITEM

function removeFromCart(name, size) {
    cart = cart.filter(
        item => !(item.name === name && item.size === size)
    );

    updateCart();
}


// SHOW FOOD SECTIONS

displayFoods(biryanis, "biryani-list");
displayFoods(curries, "curry-list");
displayFoods(riceItems, "rice-list");

updateCart();


// SEARCH FOOD

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchFoodList = document.getElementById("search-food-list");

if (searchInput && searchResults && searchFoodList) {
    searchInput.addEventListener("input", function() {
        const searchText = searchInput.value.toLowerCase().trim();

        if (searchText === "") {
            searchResults.style.display = "none";
            return;
        }

        const allFoods = [...biryanis, ...curries, ...riceItems];

        const filteredFoods = allFoods.filter(food =>
            food.name.toLowerCase().includes(searchText)
        );

        searchResults.style.display = "block";

        searchFoodList.innerHTML = filteredFoods.length
            ? filteredFoods.map((food, index) => `
                <div class="food-card">
                    <img src="${food.image}" alt="${food.name}">
                    <h4>${food.name}</h4>

                    <label>Select Size:</label>

                    <select id="search-quantity-${index}">
                        <option value="Half">Half</option>
                        <option value="Full">Full</option>
                    </select>

                    <p>
                        Half: ₹${Math.round(food.price / 2)}
                        | Full: ₹${food.price}
                    </p>

                    <button onclick="addFoodToCart('${food.name}', 'search-quantity-${index}')">
                        Add to Cart
                    </button>
                </div>
            `).join("")
            : "<p>No food items found!</p>";
    });
}


// ADD SEARCHED FOOD TO CART

function addFoodToCart(foodName, selectId) {
    const allFoods = [...biryanis, ...curries, ...riceItems];

    const food = allFoods.find(item => item.name === foodName);
    const select = document.getElementById(selectId);

    if (!food || !select) return;

    addItem(food, select.value);
}


// CATEGORY FILTER

function filterCategory(category) {
    if (!searchInput || !searchResults) return;

    searchResults.style.display = "none";
    searchInput.value = "";

    if (category === "all") {
        displayFoods(biryanis, "biryani-list");
        displayFoods(curries, "curry-list");
        displayFoods(riceItems, "rice-list");
    } else if (category === "biryanis") {
        displayFoods(biryanis, "biryani-list");
        document.getElementById("curry-list").innerHTML = "";
        document.getElementById("rice-list").innerHTML = "";
    } else if (category === "curries") {
        document.getElementById("biryani-list").innerHTML = "";
        displayFoods(curries, "curry-list");
        document.getElementById("rice-list").innerHTML = "";
    } else if (category === "rice") {
        document.getElementById("biryani-list").innerHTML = "";
        document.getElementById("curry-list").innerHTML = "";
        displayFoods(riceItems, "rice-list");
    }
}


// CHECKOUT FORM

const checkoutForm = document.getElementById("checkout-form");
const orderSummary = document.getElementById("order-summary");

if (checkoutForm && orderSummary) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty! Please add food items.");
            return;
        }

        const name = document.getElementById("customer-name").value;
        const phone = document.getElementById("customer-phone").value;
        const address = document.getElementById("customer-address").value;

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const orderId = "CW" + Date.now();

        orderSummary.innerHTML = `
            <h2>Cooking World - Order Bill</h2>

            <p>Order ID: ${orderId}</p>
            <p>Customer Name: ${name}</p>
            <p>Phone: ${phone}</p>
            <p>Address: ${address}</p>

            <hr>

            <h3>Ordered Items</h3>

            ${cart.map(item => `
                <p>
                    ${item.name} (${item.size}) × ${item.quantity}
                    = ₹${item.price * item.quantity}
                </p>
            `).join("")}

            <hr>

            <h3>Grand Total: ₹${total}</h3>
            <h3>Thank You! Visit Again ❤️</h3>

            <button onclick="window.print()">Print Bill</button>
        `;

        cart = [];
        updateCart();
        checkoutForm.reset();

        alert("Order placed successfully!");
    });
}


// Hamburger Menu

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function() {

        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }

    });

    // Close menu after clicking a link

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function() {
            navLinks.classList.remove("active");
            menuToggle.textContent = "☰";
        });

    });
}
