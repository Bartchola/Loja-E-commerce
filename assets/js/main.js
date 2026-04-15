const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const brandName = document.querySelector("[data-brand-name]");
const brandTagline = document.querySelector("[data-brand-tagline]");
const brandMark = document.querySelector("[data-brand-mark]");
const cartCount = document.querySelector("[data-cart-count]");
const cartCountMobile = document.querySelector("[data-cart-count-mobile]");
const menuGrid = document.querySelector("[data-menu-grid]");
const categoryFilters = document.querySelector("[data-category-filters]");

const root = document.documentElement;
const config = window.storeConfig || {};

let cart = [];
let activeCategory = "Todos";

if (config.theme?.primaryColor) {
  root.style.setProperty("--accent", config.theme.primaryColor);
}

if (config.theme?.secondaryColor) {
  root.style.setProperty("--accent-dark", config.theme.secondaryColor);
}

if (brandName && config.name) {
  brandName.textContent = config.name;
  document.title = config.name;
}

if (brandTagline && config.tagline) {
  brandTagline.textContent = config.tagline;
}

if (brandMark && config.logoText) {
  brandMark.textContent = config.logoText;
}

function updateCartCount() {
  const totalItems = String(cart.length);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartCountMobile) {
    cartCountMobile.textContent = totalItems;
  }
}

function addToCart(item) {
  cart.push(item);
  updateCartCount();
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function getCategories() {
  if (!Array.isArray(config.menu)) return ["Todos"];

  const categories = [...new Set(config.menu.map((item) => item.category))];
  return ["Todos", ...categories];
}

function renderCategoryFilters() {
  if (!categoryFilters) return;

  const categories = getCategories();

  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category-filter-btn ${category === activeCategory ? "is-active" : ""}"
          type="button"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");

  categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.getAttribute("data-category");
      renderCategoryFilters();
      renderMenu();
    });
  });
}

function renderMenu() {
  if (!menuGrid || !Array.isArray(config.menu)) return;

  const filteredItems =
    activeCategory === "Todos"
      ? config.menu
      : config.menu.filter((item) => item.category === activeCategory);

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="menu-card">
          <div class="menu-card-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>

          <div class="menu-card-content">
            <div class="menu-card-top">
              <span class="menu-category">${item.category}</span>
              <h3>${item.name}</h3>
              <p>${item.description}</p>
            </div>

            <div class="menu-card-bottom">
              <strong>${formatPrice(item.price)}</strong>
              <button class="menu-add-btn" type="button" data-add-to-cart="${item.id}">
                <i class="ti ti-plus" aria-hidden="true"></i>
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  menuGrid.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = Number(button.getAttribute("data-add-to-cart"));
      const selectedItem = config.menu.find((item) => item.id === itemId);

      if (selectedItem) {
        addToCart(selectedItem);
      }
    });
  });
}

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

renderCategoryFilters();
renderMenu();
updateCartCount();