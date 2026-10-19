/* ============================================
   NAYAB — LUXURY JEWELLERY WEBSITE
   File: script.js

   Features:
   1. Mobile navigation menu
   2. Product category filters
   3. Add to Cart
   4. Increase/decrease quantity
   5. Remove cart products
   6. Automatic subtotal calculation
   7. WhatsApp order enquiry
   8. Newsletter form feedback
   9. Current year in footer
   10. Smooth reveal animations
   ============================================ */

"use strict";


/* ============================================
   1. PRODUCT DATA
   ============================================ */

// These are demo products and sample prices.
// Replace the names, prices and image paths
// with the actual jewellery brand's information.

const products = [
    {
        id: "aurelia-ring",
        name: "The Aurelia Ring",
        category: "rings",
        price: 2500,
        image: "images/ring-aurelia.jpg"
    },
    {
        id: "solene-ring",
        name: "The Solene Ring",
        category: "rings",
        price: 1800,
        image: "images/ring-solene.jpg"
    },
    {
        id: "celeste-bracelet",
        name: "The Celeste Bracelet",
        category: "bracelets",
        price: 2200,
        image: "images/bracelet-celeste.jpg"
    },
    {
        id: "elara-bracelet",
        name: "The Elara Bracelet",
        category: "bracelets",
        price: 2800,
        image: "images/bracelet-elara.jpg"
    }
];


/* ============================================
   2. GENERAL ELEMENTS
   ============================================ */

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

const productGrid = document.getElementById("product-grid");
const filterButtons = document.querySelectorAll(".filter-button");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

const currentYearElement = document.getElementById("current-year");

const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");


/* ============================================
   3. SHOPPING CART STATE
   ============================================ */

// Each cart item has a product ID and quantity.
// The cart starts empty whenever the page is loaded.

const cart = new Map();


/* ============================================
   4. HELPER FUNCTIONS
   ============================================ */

// Format prices in Pakistani Rupees.

function formatPrice(amount) {
    return "Rs. " + amount.toLocaleString("en-PK");
}


// Find a product using its unique ID.

function getProduct(productId) {
    return products.find(function (product) {
        return product.id === productId;
    });
}


// Close the mobile navigation menu.

function closeMobileMenu() {
    if (!menuToggle || !navigation) {
        return;
    }

    navigation.classList.remove("is-open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}


/* ============================================
   5. MOBILE NAVIGATION
   ============================================ */

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navigation.classList.toggle("is-open");

        menuToggle.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });


    // Close the menu when a navigation link is selected.

    navigation.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            closeMobileMenu();
        });

    });


    // Close the menu with the Escape key.

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });


    // Close the mobile menu when switching to a desktop layout.

    window.addEventListener("resize", function () {

        if (window.innerWidth > 760) {
            closeMobileMenu();
        }

    });

}


/* ============================================
   6. PRODUCT CATEGORY FILTERS
   ============================================ */

if (filterButtons.length && productGrid) {

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedCategory = button.dataset.filter;

            // Update the active filter button.

            filterButtons.forEach(function (filterButton) {

                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });


            // Show all products or only the selected category.

            const productCards = productGrid.querySelectorAll(
                ".product-card"
            );

            productCards.forEach(function (card) {

                const category = card.dataset.category;

                const shouldShow =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                card.hidden = !shouldShow;

            });

        });

    });

}


/* ============================================
   7. ADD PRODUCTS TO CART
   ============================================ */

if (productGrid) {

    productGrid.addEventListener("click", function (event) {

        const button = event.target.closest(".add-to-cart");

        if (!button) {
            return;
        }

        const productId = button.dataset.productId;

        const product = getProduct(productId);

        if (!product) {
            console.error("Product not found:", productId);
            return;
        }


        // If the product is already in the cart,
        // increase its quantity.

        if (cart.has(productId)) {

            const existingItem = cart.get(productId);

            existingItem.quantity += 1;

        } else {

            cart.set(productId, {
                productId: productId,
                quantity: 1
            });

        }


        // Update the shopping bag.

        renderCart();


        // Brief visual feedback.

        const originalText = button.innerHTML;

        button.textContent = "ADDED TO BAG ✓";

        button.setAttribute("aria-label", product.name + " added to bag");

        window.setTimeout(function () {

            button.innerHTML = originalText;

            button.setAttribute(
                "aria-label",
                "Add " + product.name + " to cart"
            );

        }, 1000);

    });

}


/* ============================================
   8. RENDER SHOPPING CART
   ============================================ */

function renderCart() {

    if (!cartItemsContainer || !cartTotalElement) {
        return;
    }

    cartItemsContainer.replaceChildren();

    let subtotal = 0;
    let totalQuantity = 0;


    // Display the empty-cart message when no products are selected.

    if (cart.size === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-cart-message";

        emptyMessage.textContent =
            "Your bag is waiting for something beautiful.";

        cartItemsContainer.appendChild(emptyMessage);

    }


    // Create a cart row for each selected product.

    cart.forEach(function (item, productId) {

        const product = getProduct(productId);

        if (!product) {
            return;
        }

        const quantity = item.quantity;
        const itemTotal = product.price * quantity;

        subtotal += itemTotal;
        totalQuantity += quantity;


        // Main cart item.

        const row = document.createElement("article");

        row.className = "cart-item";


        // Product image.

        const image = document.createElement("img");

        image.className = "cart-item-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";


        // Product information.

        const info = document.createElement("div");

        info.className = "cart-item-info";

        const name = document.createElement("h3");

        name.textContent = product.name;

        const price = document.createElement("p");

        price.textContent = formatPrice(product.price);


        // Quantity controls.

        const quantityControls = document.createElement("div");

        quantityControls.className = "cart-quantity";

        const decreaseButton = document.createElement("button");

        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute(
            "aria-label",
            "Decrease quantity of " + product.name
        );

        const quantityNumber = document.createElement("span");

        quantityNumber.textContent = String(quantity);
        quantityNumber.setAttribute("aria-live", "polite");

        const increaseButton = document.createElement("button");

        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute(
            "aria-label",
            "Increase quantity of " + product.name
        );


        decreaseButton.addEventListener("click", function () {

            if (quantity <= 1) {

                cart.delete(productId);

            } else {

                item.quantity -= 1;

            }

            renderCart();

        });


        increaseButton.addEventListener("click", function () {

            item.quantity += 1;

            renderCart();

        });


        quantityControls.append(
            decreaseButton,
            quantityNumber,
            increaseButton
        );

        info.append(
            name,
            price,
            quantityControls
        );


        // Item subtotal and remove button.

        const actions = document.createElement("div");

        actions.className = "cart-item-actions";

        const itemSubtotal = document.createElement("strong");

        itemSubtotal.textContent = formatPrice(itemTotal);

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "remove-item";
        removeButton.textContent = "REMOVE";

        removeButton.setAttribute(
            "aria-label",
            "Remove " + product.name + " from cart"
        );

        removeButton.addEventListener("click", function () {

            cart.delete(productId);

            renderCart();

        });


        actions.append(
            itemSubtotal,
            removeButton
        );

        row.append(
            image,
            info,
            actions
        );

        cartItemsContainer.appendChild(row);

    });


    // Update the subtotal.

    cartTotalElement.textContent = formatPrice(subtotal);


    // Disable checkout if the cart is empty.

    if (checkoutButton) {

        checkoutButton.disabled = cart.size === 0;

        checkoutButton.setAttribute(
            "aria-label",
            cart.size === 0
                ? "Your shopping cart is empty"
                : "Continue to order, " + totalQuantity + " items"
        );

    }

}


/* ============================================
   9. CHECKOUT / WHATSAPP ORDER ENQUIRY
   ============================================ */

// IMPORTANT:
// Replace this placeholder with the jewellery brand's
// actual WhatsApp number before using the order feature.
//
// Format: country code + number, without +, spaces or dashes.
// Example format only: 923001234567

const WHATSAPP_NUMBER = "REPLACE_WITH_WHATSAPP_NUMBER";


if (checkoutButton) {

    checkoutButton.addEventListener("click", function () {

        if (cart.size === 0) {
            return;
        }


        // Stop if the real contact number hasn't been configured.

        if (
            !/^\d{10,15}$/.test(WHATSAPP_NUMBER)
        ) {

            alert(
                "The store owner needs to configure the WhatsApp number before orders can be sent."
            );

            return;
        }


        // Prepare an order summary.

        const orderLines = [];

        let subtotal = 0;

        cart.forEach(function (item, productId) {

            const product = getProduct(productId);

            if (!product) {
                return;
            }

            const itemTotal = product.price * item.quantity;

            subtotal += itemTotal;

            orderLines.push(
                product.name +
                " x " + item.quantity +
                " — " + formatPrice(itemTotal)
            );

        });


        const message = [
            "Hello NAYAB Jewellery!",
            "",
            "I would like to enquire about placing this order:",
            "",
            ...orderLines,
            "",
            "Subtotal: " + formatPrice(subtotal),
            "",
            "Please confirm availability, delivery charges and the final order total."
        ].join("\n");


        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);


        // Open the order enquiry in WhatsApp.

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });

}


/* ============================================
   10. NEWSLETTER FORM FEEDBACK
   ============================================ */

// This is only a front-end demo.
// It does not save email addresses or subscribe anyone.

if (newsletterForm && newsletterMessage) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const emailInput = document.getElementById("newsletter-email");

        if (!emailInput || !emailInput.checkValidity()) {

            if (emailInput) {
                emailInput.reportValidity();
            }

            return;
        }


        newsletterMessage.textContent =
            "Thank you! The demo form is working, but email subscriptions are not connected yet.";

        newsletterForm.reset();

    });

}


/* ============================================
   11. FOOTER CURRENT YEAR
   ============================================ */

if (currentYearElement) {

    currentYearElement.textContent = String(
        new Date().getFullYear()
    );

}


/* ============================================
   12. SMOOTH REVEAL ANIMATIONS
   ============================================ */

// Use IntersectionObserver where supported.
// If unsupported, content remains visible.

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion
) {

    const revealElements = document.querySelectorAll(
        ".value-item, .product-card, .editorial-content, .about-content, .cart-summary"
    );


    // Avoid hiding content if the browser fails to initialize.

    try {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12
            }
        );


        revealElements.forEach(function (element) {

            element.classList.add("reveal-ready");

            revealObserver.observe(element);

        });

    } catch (error) {

        // The site remains usable even if reveal animations fail.
        console.warn("Reveal animation unavailable:", error);

    }

}


/* ============================================
   13. INITIALIZE THE SHOPPING BAG
   ============================================ */

renderCart();

console.log("NAYAB Jewellery website initialized successfully.");