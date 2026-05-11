// ============================================
//  MERIDIAN REALTY — script.js
// ============================================

/* ─── PROPERTY DATA ─────────────────────── */
const PROPERTIES = [
  {
    id: 1,
    name: "Skyline Penthouse",
    location: "Bandra West, Mumbai",
    price: "₹8.5 Cr",
    type: "Penthouse",
    beds: 4, baths: 4, area: "3800 sq ft",
    badge: "Featured", badgeClass: "",
    bg: "linear-gradient(135deg, #1a1208, #2e2010)",
    icon: "🏙️"
  },
  {
    id: 2,
    name: "The Ivory Villa",
    location: "Whitefield, Bengaluru",
    price: "₹4.2 Cr",
    type: "Villa",
    beds: 5, baths: 4, area: "5200 sq ft",
    badge: "New", badgeClass: "new",
    bg: "linear-gradient(135deg, #0e1a12, #132016)",
    icon: "🌿"
  },
  {
    id: 3,
    name: "The Meridian Tower",
    location: "Golf Course Road, Gurugram",
    price: "₹3.1 Cr",
    type: "Apartment",
    beds: 3, baths: 3, area: "2200 sq ft",
    badge: "Hot", badgeClass: "hot",
    bg: "linear-gradient(135deg, #0a1020, #101828)",
    icon: "🌆"
  },
  {
    id: 4,
    name: "Jade Garden Residence",
    location: "Juhu, Mumbai",
    price: "₹6.8 Cr",
    type: "Villa",
    beds: 6, baths: 5, area: "6100 sq ft",
    badge: "Featured", badgeClass: "",
    bg: "linear-gradient(135deg, #0e1a10, #1a2e18)",
    icon: "🌺"
  },
  {
    id: 5,
    name: "Prestige Heights 3BHK",
    location: "Koramangala, Bengaluru",
    price: "₹1.9 Cr",
    type: "Apartment",
    beds: 3, baths: 2, area: "1600 sq ft",
    badge: "New", badgeClass: "new",
    bg: "linear-gradient(135deg, #1a100e, #2a1812)",
    icon: "🏢"
  },
  {
    id: 6,
    name: "The Azure Crown",
    location: "Worli, Mumbai",
    price: "₹12 Cr",
    type: "Penthouse",
    beds: 5, baths: 5, area: "4800 sq ft",
    badge: "Exclusive", badgeClass: "",
    bg: "linear-gradient(135deg, #0a1020, #0e1828)",
    icon: "✨"
  }
];

let favorites = new Set();

/* ─── RENDER LISTINGS ───────────────────── */
function renderListings(filter = "all") {
  const grid = document.getElementById("listingsGrid");
  if (!grid) return;

  const filtered = filter === "all"
    ? PROPERTIES
    : PROPERTIES.filter(p => p.type === filter);

  grid.innerHTML = "";

  filtered.forEach((prop, i) => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.style.animationDelay = `${i * 0.07}s`;
    card.dataset.type = prop.type;

    const isFav = favorites.has(prop.id);

    card.innerHTML = `
      <div class="property-card__image">
        <div class="property-card__img-placeholder" style="background: ${prop.bg}; font-size: 4rem;">
          ${prop.icon}
        </div>
        <div class="property-card__badge ${prop.badgeClass}">${prop.badge}</div>
        <button class="property-card__fav ${isFav ? 'active' : ''}" data-id="${prop.id}" title="Save to favourites">
          ${isFav ? '♥' : '♡'}
        </button>
      </div>
      <div class="property-card__body">
        <p class="property-card__location">${prop.location}</p>
        <h3 class="property-card__name">${prop.name}</h3>
        <div class="property-card__price">${prop.price} <span>onwards</span></div>
        <div class="property-card__specs">
          <span class="spec"><span class="spec__icon">🛏</span>${prop.beds} Beds</span>
          <span class="spec"><span class="spec__icon">🚿</span>${prop.baths} Baths</span>
          <span class="spec"><span class="spec__icon">⊞</span>${prop.area}</span>
        </div>
      </div>
    `;

    // Fav button toggle
    card.querySelector(".property-card__fav").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(prop.id, e.currentTarget);
    });

    // Card click — scroll to contact
    card.addEventListener("click", () => {
      const interest = document.getElementById("finterest");
      if (interest) interest.value = "Buying a property";
      const msg = document.getElementById("fmessage");
      if (msg) msg.value = `I'm interested in "${prop.name}" (${prop.location}) priced at ${prop.price}.`;
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });

    grid.appendChild(card);
  });
}

function toggleFavorite(id, btn) {
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.classList.remove("active");
    btn.textContent = "♡";
  } else {
    favorites.add(id);
    btn.classList.add("active");
    btn.textContent = "♥";
    btn.style.transform = "scale(1.3)";
    setTimeout(() => (btn.style.transform = ""), 200);
  }
}

/* ─── FILTER TABS ───────────────────────── */
function initFilterTabs() {
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderListings(tab.dataset.filter);
    });
  });
}

/* ─── SEARCH ────────────────────────────── */
function initSearch() {
  const btn = document.getElementById("searchBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const type = document.getElementById("searchType").value;
    const budget = document.getElementById("searchBudget").value;
    const location = document.getElementById("searchLocation").value;

    // Filter properties based on search
    let results = PROPERTIES;

    if (type) results = results.filter(p => p.type === type);

    if (budget) {
      results = results.filter(p => {
        const num = parseFloat(p.price.replace(/[^0-9.]/g, ""));
        if (budget === "Under ₹1 Cr") return num < 1;
        if (budget === "₹1 Cr – ₹3 Cr") return num >= 1 && num <= 3;
        if (budget === "₹3 Cr – ₹5 Cr") return num >= 3 && num <= 5;
        if (budget === "₹5 Cr+") return num > 5;
        return true;
      });
    }

    // Scroll to listings and render filtered
    document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const grid = document.getElementById("listingsGrid");
      grid.innerHTML = "";
      if (results.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 3rem; font-size: 1.1rem;">No properties match your criteria. Try adjusting your filters.</p>`;
      } else {
        results.forEach((prop, i) => {
          const card = createCard(prop, i);
          grid.appendChild(card);
        });
      }
      // reset filter tabs
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      document.querySelector(".filter-tab").classList.add("active");
    }, 500);
  });
}

function createCard(prop, i) {
  const card = document.createElement("div");
  card.className = "property-card";
  card.style.animationDelay = `${i * 0.07}s`;
  const isFav = favorites.has(prop.id);
  card.innerHTML = `
    <div class="property-card__image">
      <div class="property-card__img-placeholder" style="background: ${prop.bg}; font-size: 4rem;">${prop.icon}</div>
      <div class="property-card__badge ${prop.badgeClass}">${prop.badge}</div>
      <button class="property-card__fav ${isFav ? 'active' : ''}" data-id="${prop.id}">
        ${isFav ? '♥' : '♡'}
      </button>
    </div>
    <div class="property-card__body">
      <p class="property-card__location">${prop.location}</p>
      <h3 class="property-card__name">${prop.name}</h3>
      <div class="property-card__price">${prop.price} <span>onwards</span></div>
      <div class="property-card__specs">
        <span class="spec"><span class="spec__icon">🛏</span>${prop.beds} Beds</span>
        <span class="spec"><span class="spec__icon">🚿</span>${prop.baths} Baths</span>
        <span class="spec"><span class="spec__icon">⊞</span>${prop.area}</span>
      </div>
    </div>
  `;
  card.querySelector(".property-card__fav").addEventListener("click", e => {
    e.stopPropagation();
    toggleFavorite(prop.id, e.currentTarget);
  });
  card.addEventListener("click", () => {
    const msg = document.getElementById("fmessage");
    if (msg) msg.value = `I'm interested in "${prop.name}" (${prop.location}) priced at ${prop.price}.`;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
  return card;
}

/* ─── NAV SCROLL ────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

/* ─── MOBILE BURGER ─────────────────────── */
function initBurger() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    menu.classList.toggle("open");
    document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
  });

  document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", () => {
      burger.classList.remove("open");
      menu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ─── COUNTER ANIMATION ──────────────────── */
function animateCounters() {
  const nums = document.querySelectorAll(".stat__num");
  nums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ─── REVEAL ON SCROLL ───────────────────── */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  let statsAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));

  // Stats counter trigger
  const statsEl = document.querySelector(".hero__stats");
  if (statsEl) {
    const statsObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
      }
    }, { threshold: 0.5 });
    statsObs.observe(statsEl);
  }

  // Generic reveal for sections
  const sectionEls = document.querySelectorAll(
    ".service-card, .pillar, .about__text-col, .about__image-col, .contact__left, .contact__right"
  );
  sectionEls.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    observer.observe(el);
    // make visible when class 'visible' — reuse same observer
    const secObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        entries[0].target.style.opacity = "1";
        entries[0].target.style.transform = "translateY(0)";
        secObs.unobserve(entries[0].target);
      }
    }, { threshold: 0.15 });
    secObs.observe(el);
  });
}

/* ─── TESTIMONIALS CAROUSEL ──────────────── */
function initTestimonials() {
  const track = document.getElementById("testimonialTrack");
  const dotsContainer = document.getElementById("testimonialDots");
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll(".testimonial-card");
  const total = Math.ceil(cards.length / 2);
  let current = 0;

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = index;
    const offset = index * (track.parentElement.offsetWidth + 24);
    track.style.transform = `translateX(-${index * 50}%)`;
    dotsContainer.querySelectorAll("button").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  // Auto-advance
  let autoplay = setInterval(() => {
    goTo((current + 1) % total);
  }, 5000);

  track.addEventListener("mouseenter", () => clearInterval(autoplay));
  track.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => goTo((current + 1) % total), 5000);
  });
}

/* ─── CONTACT FORM ───────────────────────── */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const fname = document.getElementById("fname");
    const femail = document.getElementById("femail");
    const fphone = document.getElementById("fphone");

    // Clear errors
    ["fname", "femail", "fphone"].forEach(id => {
      document.getElementById(id).classList.remove("error");
      document.getElementById(id + "Error").textContent = "";
    });

    if (!fname.value.trim() || fname.value.trim().length < 2) {
      fname.classList.add("error");
      document.getElementById("fnameError").textContent = "Please enter your full name.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(femail.value.trim())) {
      femail.classList.add("error");
      document.getElementById("femailError").textContent = "Please enter a valid email address.";
      valid = false;
    }

    const phoneRegex = /^[\d\s+\-()]{7,15}$/;
    if (!phoneRegex.test(fphone.value.trim())) {
      fphone.classList.add("error");
      document.getElementById("fphoneError").textContent = "Please enter a valid phone number.";
      valid = false;
    }

    if (!valid) return;

    // Simulate form submission
    const btn = form.querySelector("button[type=submit]");
    btn.textContent = "Sending…";
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = "Send Message";
      btn.disabled = false;
      const success = document.getElementById("formSuccess");
      success.classList.add("show");
      setTimeout(() => success.classList.remove("show"), 5000);
    }, 1200);
  });
}

/* ─── SMOOTH ANCHOR LINKS ────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ─── HERO PARALLAX ──────────────────────── */
function initParallax() {
  const lines = document.querySelector(".hero__lines");
  if (!lines) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    lines.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* ─── INIT ───────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderListings();
  initFilterTabs();
  initSearch();
  initNavScroll();
  initBurger();
  initReveal();
  initTestimonials();
  initContactForm();
  initSmoothLinks();
  initParallax();

  // Trigger hero reveals
  setTimeout(() => {
    document.querySelectorAll(".hero .reveal").forEach(el => el.classList.add("visible"));
  }, 100);
});
