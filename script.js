/* =========================================================
   TemplateHub – Script
   ========================================================= */

// ----- Template data -----
const templates = [
  {
    id: 1,
    name: "Minimal Portfolio",
    category: "portfolio",
    desc: "Clean, minimal portfolio for designers and developers.",
    price: 5,
    originalPrice: 12,
    color: "#6c47ff",
    emoji: "🎨",
    tags: ["html", "css", "responsive"],
  },
  {
    id: 2,
    name: "Creative Agency",
    category: "portfolio",
    desc: "Bold agency-style portfolio with smooth animations.",
    price: 9,
    originalPrice: 18,
    color: "#ff6b6b",
    emoji: "🏢",
    tags: ["html", "css", "js", "animations"],
  },
  {
    id: 3,
    name: "SaaS Launch",
    category: "landing",
    desc: "High-converting SaaS landing page with pricing section.",
    price: 12,
    originalPrice: 25,
    color: "#38bdf8",
    emoji: "🚀",
    tags: ["html", "css", "js"],
  },
  {
    id: 4,
    name: "Product Launch",
    category: "landing",
    desc: "Eye-catching product launch page with countdown timer.",
    price: 8,
    originalPrice: 15,
    color: "#fb923c",
    emoji: "📦",
    tags: ["html", "css", "js", "countdown"],
  },
  {
    id: 5,
    name: "Shop Starter",
    category: "ecommerce",
    desc: "Clean ecommerce storefront with cart and filters.",
    price: 15,
    originalPrice: 30,
    color: "#34d399",
    emoji: "🛍️",
    tags: ["html", "css", "js", "cart"],
  },
  {
    id: 6,
    name: "Fashion Store",
    category: "ecommerce",
    desc: "Stylish fashion-focused e-commerce template.",
    price: 14,
    originalPrice: 28,
    color: "#f472b6",
    emoji: "👗",
    tags: ["html", "css", "js"],
  },
  {
    id: 7,
    name: "Tech Blog",
    category: "blog",
    desc: "Modern tech blog with code syntax highlighting.",
    price: 7,
    originalPrice: 14,
    color: "#a78bfa",
    emoji: "✍️",
    tags: ["html", "css", "js"],
  },
  {
    id: 8,
    name: "Personal Journal",
    category: "blog",
    desc: "Warm personal blog template with typography focus.",
    price: 6,
    originalPrice: 12,
    color: "#fbbf24",
    emoji: "📔",
    tags: ["html", "css"],
  },
  {
    id: 9,
    name: "Admin Pro",
    category: "dashboard",
    desc: "Full-featured admin dashboard with charts and tables.",
    price: 15,
    originalPrice: 35,
    color: "#60a5fa",
    emoji: "📊",
    tags: ["html", "css", "js", "charts"],
  },
  {
    id: 10,
    name: "Analytics Board",
    category: "dashboard",
    desc: "Clean analytics dashboard with dark mode support.",
    price: 13,
    originalPrice: 28,
    color: "#4ade80",
    emoji: "📈",
    tags: ["html", "css", "js"],
  },
  {
    id: 11,
    name: "SaaS Pricing Page",
    category: "saas",
    desc: "Conversion-optimized pricing page for SaaS products.",
    price: 10,
    originalPrice: 20,
    color: "#c084fc",
    emoji: "☁️",
    tags: ["html", "css", "js"],
  },
  {
    id: 12,
    name: "App Showcase",
    category: "saas",
    desc: "Mobile-app marketing page with feature sections.",
    price: 11,
    originalPrice: 22,
    color: "#fb7185",
    emoji: "📱",
    tags: ["html", "css", "js"],
  },
];

// ----- State -----
let cart = [];
let activeCategory = "all";
let searchQuery = "";

// ----- Render templates -----
function renderTemplates() {
  const grid = document.getElementById("templatesGrid");
  const noResults = document.getElementById("noResults");

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.category.includes(q);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  grid.innerHTML = filtered
    .map((t) => {
      const inCart = cart.some((c) => c.id === t.id);
      return `
      <article class="template-card" data-id="${t.id}">
        <div class="template-card__thumb" style="background:linear-gradient(135deg,${t.color}22,${t.color}44)">
          <span>${t.emoji}</span>
        </div>
        <div class="template-card__body">
          <div class="template-card__category">${t.category}</div>
          <h3 class="template-card__name">${t.name}</h3>
          <p class="template-card__desc">${t.desc}</p>
          <div class="template-card__footer">
            <span class="template-card__price">$${t.price}<s>$${t.originalPrice}</s></span>
            <button
              class="add-to-cart${inCart ? " added" : ""}"
              data-id="${t.id}"
              aria-label="Add ${t.name} to cart"
            >${inCart ? "✓ Added" : "Add to Cart"}</button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  // Attach add-to-cart listeners
  grid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id, 10);
      addToCart(id);
    });
  });
}

// ----- Cart logic -----
function addToCart(id) {
  if (cart.some((c) => c.id === id)) return;
  const template = templates.find((t) => t.id === id);
  cart.push(template);
  updateCartCount();
  renderTemplates(); // refresh button state
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateCartCount();
  renderCartModal();
  renderTemplates();
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

// ----- Cart Modal -----
function renderCartModal() {
  const list = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");

  if (cart.length === 0) {
    list.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
    total.textContent = "$0";
    return;
  }

  list.innerHTML = cart
    .map(
      (t) => `
    <li class="cart-item">
      <span>${t.emoji} ${t.name}</span>
      <span style="display:flex;align-items:center;gap:.75rem;">
        <strong>$${t.price}</strong>
        <button class="cart-item__remove" data-id="${t.id}" aria-label="Remove ${t.name}">Remove</button>
      </span>
    </li>`
    )
    .join("");

  list.querySelectorAll(".cart-item__remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id, 10)));
  });

  const sum = cart.reduce((acc, t) => acc + t.price, 0);
  total.textContent = `$${sum}`;
}

// ----- Event Listeners -----
document.addEventListener("DOMContentLoaded", () => {
  renderTemplates();

  // Search
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderTemplates();
  });

  // Category filter buttons
  document.getElementById("filterButtons").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderTemplates();
  });

  // Category cards (click to filter)
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const filter = card.dataset.filter;
      activeCategory = filter;
      document.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.category === filter);
      });
      document.getElementById("templates").scrollIntoView({ behavior: "smooth" });
      renderTemplates();
    });
  });

  // Cart open
  document.getElementById("cartBtn").addEventListener("click", () => {
    renderCartModal();
    document.getElementById("cartModal").classList.remove("hidden");
  });

  // Cart close
  document.getElementById("closeCart").addEventListener("click", () => {
    document.getElementById("cartModal").classList.add("hidden");
  });
  document.getElementById("cartModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add("hidden");
    }
  });

  // Checkout placeholder
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const sum = cart.reduce((acc, t) => acc + t.price, 0);
    alert(`Thank you for your purchase! Total: $${sum}\n\nYour download links will be emailed to you.`);
    cart = [];
    updateCartCount();
    document.getElementById("cartModal").classList.add("hidden");
    renderTemplates();
  });

  // Mobile nav toggle
  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("nav").classList.toggle("open");
  });
});
