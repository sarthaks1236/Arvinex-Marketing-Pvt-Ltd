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
// FAQ Accordion
// =========================

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
  ".journey-road > .stop"
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
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

reveals.forEach((el) => revealObserver.observe(el));

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

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.innerHTML = navLinks.classList.contains("active") ? "✕" : "☰";
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
