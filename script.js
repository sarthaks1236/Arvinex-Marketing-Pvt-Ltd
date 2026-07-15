// =========================
// Preloader
// =========================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => preloader.classList.add("done"), 350);
  }
});

// =========================
// Sticky Header Shrink
// =========================

const siteHeader = document.querySelector("header");

if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  });
}

// =========================
// Scrollspy (active nav link)
// =========================

const spySections = document.querySelectorAll("section[id]");
const spyLinks = document.querySelectorAll(".nav-links a[href^='#']");

if (spySections.length && spyLinks.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          spyLinks.forEach((link) => {
            link.classList.toggle(
              "active-link",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  spySections.forEach((sec) => spyObserver.observe(sec));
}

// =========================
// Quote Form — AJAX submit with inline feedback
// =========================

const quoteForm = document.getElementById("quoteForm");
const quoteSubmitBtn = document.getElementById("quoteSubmitBtn");
const formStatus = document.getElementById("formStatus");

if (quoteForm) {
  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    quoteSubmitBtn.classList.add("loading");
    quoteSubmitBtn.disabled = true;
    formStatus.classList.remove("show", "success", "error");

    try {
      const formData = new FormData(quoteForm);
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        formStatus.textContent =
          "Thanks! Your request has been sent — we'll reply within 1 business day.";
        formStatus.classList.add("show", "success");
        quoteForm.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      formStatus.textContent =
        "Something went wrong sending your request. Please try WhatsApp or email us directly.";
      formStatus.classList.add("show", "error");
    } finally {
      quoteSubmitBtn.classList.remove("loading");
      quoteSubmitBtn.disabled = false;
    }
  });
}

// =========================
// Portfolio image fade-in on load
// =========================

document.querySelectorAll(".portfolio-card img").forEach((img) => {
  if (img.complete) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", () => img.classList.add("loaded"));
  }
});

// =========================
// Testimonial Mobile Carousel Dots
// =========================

const testimonialGrid = document.querySelector(".testimonial-grid");
const testimonialDotsWrap = document.getElementById("testimonialDots");

if (testimonialGrid && testimonialDotsWrap) {
  const cards = testimonialGrid.querySelectorAll(".testimonial-card");
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      cards[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    testimonialDotsWrap.appendChild(dot);
  });

  const dots = testimonialDotsWrap.querySelectorAll(".dot");
  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle("active", i === idx));
        }
      });
    },
    { root: testimonialGrid, threshold: 0.6 }
  );
  cards.forEach((card) => dotObserver.observe(card));
}

const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("active");
  });
});

// =========================
// Scroll Reveal (IntersectionObserver + stagger)
// =========================

const reveals = document.querySelectorAll(".reveal");

// Auto-stagger direct grid children inside reveal sections
const staggerSelectors = [
  ".services-grid > .service-card",
  ".why-grid > .why-card",
  ".testimonial-grid > .testimonial-card",
  ".portfolio-grid > .portfolio-card",
  ".trust-grid > .trust-card",
  ".journey-road > .stop",
  ".faq > .faq-item",
  ".values-grid > .value-card",
  ".blog-grid > .blog-card"
];

staggerSelectors.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal-child");
    el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Trigger stagger children within this section
        entry.target
          .querySelectorAll(".reveal-child")
          .forEach((child) => child.classList.add("active"));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: "0px 0px -80px 0px" }
);

reveals.forEach((el) => revealObserver.observe(el));

// Safety net: if any section never triggers (edge cases like very tall
// elements, zero-height ancestors, etc.), force-reveal everything after load
// so content is never stuck invisible.
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.active)").forEach((el) => {
      el.classList.add("active");
      el.querySelectorAll(".reveal-child").forEach((child) =>
        child.classList.add("active")
      );
    });
  }, 2500);
});

// =========================
// Animated Counters (with easing)
// =========================

const counters = document.querySelectorAll(".counter");

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(counter) {
  const target = +counter.dataset.target;
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = easeOutExpo(elapsed);
    const value = Math.floor(eased * target);
    counter.innerText = value;

    if (elapsed < 1) {
      requestAnimationFrame(update);
    } else {
      counter.innerText = target + "+";
      counter.style.transform = "scale(1.12)";
      setTimeout(() => (counter.style.transform = "scale(1)"), 180);
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".counter").forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) counterObserver.observe(heroStats);

// =========================
// Mobile Menu
// =========================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
const navOverlay = document.getElementById("navOverlay");

function closeMenu() {
  navLinks.classList.remove("active");
  menuToggle.classList.remove("active");
  navOverlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

function openMenu() {
  navLinks.classList.add("active");
  menuToggle.classList.add("active");
  navOverlay.classList.add("active");
  document.body.classList.add("menu-open");
}

if (menuToggle && navLinks && navOverlay) {
  menuToggle.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener("click", closeMenu);

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

// =========================
// Scroll Progress
// =========================

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  if (progressBar) progressBar.style.width = progress + "%";
});

// =========================
// Back To Top
// =========================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =========================
// Cursor Glow (desktop only)
// =========================

const cursorGlow = document.getElementById("cursorGlow");
const isFinePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

if (cursorGlow && isFinePointer) {
  window.addEventListener("mousemove", (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    cursorGlow.classList.add("active");
  });
  document.addEventListener("mouseleave", () => cursorGlow.classList.remove("active"));
}

// =========================
// Magnetic Buttons
// =========================

if (isFinePointer) {
  document.querySelectorAll(".btn-primary, .btn-ghost").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}

// =========================
// Button Ripple Effect
// =========================

document.querySelectorAll(".btn-primary, .btn-ghost").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.classList.add("ripple");
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// =========================
// 3D Card Tilt
// =========================

if (isFinePointer) {
  const tiltSelector =
    ".service-card, .portfolio-card, .testimonial-card, .trust-card, .why-card";

  document.querySelectorAll(tiltSelector).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}
