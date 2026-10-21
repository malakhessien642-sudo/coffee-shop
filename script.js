
document.addEventListener("DOMContentLoaded", function () {
  // WhatsApp number in international format
  const whatsappNumber = "201115830573";

  // Product filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      products.forEach(function (product) {
        const category = product.dataset.category;

        product.style.display =
          selectedFilter === "all" || category === selectedFilter
            ? ""
            : "none";
      });
    });
  });

  // Cart elements
  const cart = document.getElementById("cart");
  const backdrop = document.getElementById("cart-backdrop");
  const cartToggle = document.getElementById("cart-toggle");
  const closeCartButton = document.getElementById("close-cart");
  const continueButton = document.getElementById("continue-shopping");

  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");
  const checkoutButton = document.getElementById("whatsapp-checkout");

  let cartItems = [];

  // Open and close cart
  function openCart() {
    cart.classList.add("open");
    backdrop.classList.add("open");
    document.body.classList.add("cart-open");
    cart.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    cart.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.classList.remove("cart-open");
    cart.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
  }

  cartToggle.addEventListener("click", openCart);
  closeCartButton.addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);
  continueButton.addEventListener("click", closeCart);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCart();
    }
  });

  // Format prices
  function formatPrice(price) {
    return price.toLocaleString("en-EG") + " EGP";
  }

  // Add products
  document.querySelectorAll(".add-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      if (!name || !Number.isFinite(price) || price < 0) {
        alert("حصلت مشكلة في بيانات المنتج. جربي مرة تانية.");
        return;
      }

      const existingItem = cartItems.find(function (item) {
        return item.name === name;
      });

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          name: name,
          price: price,
          quantity: 1
        });
      }

      renderCart();
      openCart();
    });
  });

  // Draw the cart
  function renderCart() {
    cartItemsContainer.replaceChildren();

    let total = 0;
    let quantityTotal = 0;

    cartItems.forEach(function (item, index) {
      const li = document.createElement("li");

      const info = document.createElement("div");
      info.className = "cart-item-info";

      const name = document.createElement("strong");
      name.textContent = item.name;

      const quantityText = document.createElement("p");
      quantityText.textContent =
        "الكمية: " + item.quantity + " × " + formatPrice(item.price);

      const subtotal = document.createElement("p");
      subtotal.textContent =
        "الإجمالي: " + formatPrice(item.price * item.quantity);

      info.append(name, quantityText, subtotal);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", "تقليل الكمية");

      decrease.addEventListener("click", function () {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cartItems.splice(index, 1);
        }

        renderCart();
      });

      const quantity = document.createElement("span");
      quantity.textContent = String(item.quantity);

      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", "زيادة الكمية");

      increase.addEventListener("click", function () {
        item.quantity += 1;
        renderCart();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "حذف";

      remove.addEventListener("click", function () {
        cartItems.splice(index, 1);
        renderCart();
      });

      controls.append(decrease, quantity, increase, remove);
      li.append(info, controls);
      cartItemsContainer.appendChild(li);

      total += item.price * item.quantity;
      quantityTotal += item.quantity;
    });

    cartCount.textContent = String(quantityTotal);
    cartTotal.textContent = formatPrice(total);

    cartEmpty.style.display = cartItems.length === 0 ? "" : "none";
    cartItemsContainer.style.display =
      cartItems.length === 0 ? "none" : "";

    clearCartButton.disabled = cartItems.length === 0;
    checkoutButton.disabled = cartItems.length === 0;
  }

  // Clear all items
  clearCartButton.addEventListener("click", function () {
    cartItems = [];
    renderCart();
  });

  // Send order details to WhatsApp
  checkoutButton.addEventListener("click", function () {
    if (cartItems.length === 0) {
      alert("ضيفي منتج واحد على الأقل للسلة الأول.");
      return;
    }

    let total = 0;

    let message = "مرحبًا، عايزة أأكد الطلب من Coffee Shop ☕\n\n";
    message += "تفاصيل الطلب:\n";

    cartItems.forEach(function (item, index) {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      message +=
        (index + 1) + ". " + item.name +
        "\nالكمية: " + item.quantity +
        "\nسعر الوحدة: " + item.price + " جنيه" +
        "\nالإجمالي: " + subtotal + " جنيه\n\n";
    });

    message += "إجمالي الطلب: " + total + " جنيه\n\n";
    message += "الاسم:\n";
    message += "العنوان:\n";
    message += "رقم التواصل:\n";
    message += "\nمن فضلكم أكدوا الطلب والتكلفة النهائية.";

    const whatsappURL =
      "https://wa.me/" + whatsappNumber +
      "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
  });

  renderCart();
});
