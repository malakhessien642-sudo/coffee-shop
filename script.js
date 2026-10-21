
document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // 1. Product Filters
  // =========================

  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      products.forEach(function (product) {
        const category = product.dataset.category;

        if (
          selectedFilter === "all" ||
          selectedFilter === category
        ) {
          product.style.display = "";
        } else {
          product.style.display = "none";
        }
      });
    });
  });

  // =========================
  // 2. Shopping Cart Elements
  // =========================

  const cart = document.getElementById("cart");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartToggle = document.getElementById("cart-toggle");
  const closeCartButton = document.getElementById("close-cart");
  const continueShoppingButton =
    document.getElementById("continue-shopping");

  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmptyMessage = document.getElementById("cart-empty");
  const cartTotalElement = document.getElementById("cart-total");
  const cartCountElement = document.getElementById("cart-count");
  const clearCartButton = document.getElementById("clear-cart");

  // Products currently in the cart
  let cartItems = [];

  // =========================
  // 3. Open and Close Cart
  // =========================

  function openCart() {
    if (!cart || !cartBackdrop) return;

    cart.classList.add("open");
    cartBackdrop.classList.add("open");
    document.body.classList.add("cart-open");

    cart.setAttribute("aria-hidden", "false");

    if (cartToggle) {
      cartToggle.setAttribute("aria-expanded", "true");
    }
  }

  function closeCart() {
    if (!cart || !cartBackdrop) return;

    cart.classList.remove("open");
    cartBackdrop.classList.remove("open");
    document.body.classList.remove("cart-open");

    cart.setAttribute("aria-hidden", "true");

    if (cartToggle) {
      cartToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (cartToggle) {
    cartToggle.addEventListener("click", openCart);
  }

  if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", closeCart);
  }

  if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", closeCart);
  }

  // Close cart with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCart();
    }
  });

  // =========================
  // 4. Add Products to Cart
  // =========================

  const addButtons = document.querySelectorAll(".add-btn");

  addButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productName = button.dataset.name;
      const productPrice = Number(button.dataset.price);

      if (
        !productName ||
        !Number.isFinite(productPrice) ||
        productPrice < 0
      ) {
        alert("Sorry, this product could not be added.");
        return;
      }

      const existingItem = cartItems.find(function (item) {
        return item.name === productName;
      });

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push({
          name: productName,
          price: productPrice,
          quantity: 1
        });
      }

      renderCart();
      openCart();
    });
  });

  // =========================
  // 5. Display Cart Items
  // =========================

  function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.replaceChildren();

    let totalPrice = 0;
    let totalQuantity = 0;

    cartItems.forEach(function (item, index) {
      const listItem = document.createElement("li");

      const itemInfo = document.createElement("div");
      itemInfo.className = "cart-item-info";

      const name = document.createElement("strong");
      name.textContent = item.name;

      const details = document.createElement("p");
      details.textContent =
        item.quantity + " × " + formatPrice(item.price);

      const itemTotal = document.createElement("p");
      itemTotal.textContent =
        "Subtotal: " + formatPrice(item.price * item.quantity);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.textContent = "−";
      decreaseButton.setAttribute(
        "aria-label",
        "Decrease quantity of " + item.name
      );

      decreaseButton.addEventListener("click", function () {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cartItems.splice(index, 1);
        }

        renderCart();
      });

      const quantity = document.createElement("span");
      quantity.textContent = String(item.quantity);

      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.textContent = "+";
      increaseButton.setAttribute(
        "aria-label",
        "Increase quantity of " + item.name
      );

      increaseButton.addEventListener("click", function () {
        item.quantity++;
        renderCart();
      });

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", function () {
        cartItems.splice(index, 1);
        renderCart();
      });

      controls.append(
        decreaseButton,
        quantity,
        increaseButton,
        removeButton
      );

      itemInfo.append(name, details, itemTotal);
      listItem.append(itemInfo, controls);
      cartItemsContainer.appendChild(listItem);

      totalPrice += item.price * item.quantity;
      totalQuantity += item.quantity;
    });

    // Update total price
    if (cartTotalElement) {
      cartTotalElement.textContent = formatPrice(totalPrice);
    }

    // Update cart item count
    if (cartCountElement) {
      cartCountElement.textContent = String(totalQuantity);
    }

    // Show or hide the empty-cart message
    if (cartEmptyMessage) {
      cartEmptyMessage.style.display =
        cartItems.length === 0 ? "" : "none";
    }

    // Hide the list when the cart is empty
    cartItemsContainer.style.display =
      cartItems.length === 0 ? "none" : "";

    if (clearCartButton) {
      clearCartButton.disabled = cartItems.length === 0;
    }
  }

  // =========================
  // 6. Format Prices in EGP
  // =========================

  function formatPrice(price) {
    return (
      "EGP " +
      price.toLocaleString("en-EG", {
        maximumFractionDigits: 2
      })
    );
  }

  // =========================
  // 7. Clear Entire Cart
  // =========================

  if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
      cartItems = [];
      renderCart();
    });
  }

  // =========================
  // 8. Initial Cart Display
  // =========================

  renderCart();
});
