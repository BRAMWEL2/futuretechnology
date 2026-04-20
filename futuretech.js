/* ============================================================
   FUTURETECH — PROFESSIONAL JAVASCRIPT CORE
   Author: FutureTech Editorial bramwel mwombe
   Purpose: Global Technology & Breakthrough News Platform
   Architecture: Modular, Scalable, Enterprise-Grade
   ============================================================ */


/* ============================================================
   GLOBAL CONFIGURATION
   ============================================================ */

const FutureTechConfig = {
    siteName: "FutureTech",
    version: "1.0.0",
    environment: "production",
    enableAnimations: true,
    enableScrollEffects: true,
    enableThemePersistence: true,
    debugMode: false
};


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/**
 * Safe console logging (disabled in production if needed)
 */
function log(...args) {
    if (FutureTechConfig.debugMode) {
        console.log("[FutureTech]", ...args);
    }
}

/**
 * Select single DOM element
 */
function $(selector, scope = document) {
    return scope.querySelector(selector);
}

/**
 * Select multiple DOM elements
 */
function $all(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

/**
 * Throttle function execution (performance optimization)
 */
function throttle(fn, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            fn.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function execution
 */
function debounce(fn, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, args), delay);
    };
}


/* ============================================================
   DOM READY INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    log("Initializing FutureTech Core");

    initHeaderBehavior();
    initScrollAnimations();
    initNewsletterForm();
    initThemeSystem();
    initLiveTime();
    initLazyLoading();
    initBackToTop();
    initAccessibilityEnhancements();

    log("FutureTech Initialized Successfully");
});


/* ============================================================
   HEADER SCROLL BEHAVIOR
   ============================================================ */

function initHeaderBehavior() {
    const header = $("#main-header");
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", throttle(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 120) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            header.classList.add("header-hidden");
        } else {
            header.classList.remove("header-hidden");
        }

        lastScrollY = currentScrollY;
    }, 100));
}


/* ============================================================
   SCROLL-REVEAL ANIMATIONS
   ============================================================ */

function initScrollAnimations() {
    if (!FutureTechConfig.enableScrollEffects) return;

    const revealElements = $all(
        ".news-card, .analysis-section, .category-card, .sidebar-widget"
    );

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        el.classList.add("reveal");
        observer.observe(el);
    });
}


/* ============================================================
   NEWSLETTER FORM HANDLING
   ============================================================ */

function initNewsletterForm() {
    const form = $("#newsletter form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const emailInput = form.querySelector("input[type='email']");
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            showNotification("Please enter a valid email address.", "error");
            return;
        }

        simulateNewsletterSignup(email);
        emailInput.value = "";
    });
}

/**
 * Email validation
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Fake signup simulation (replace with API later)
 */
function simulateNewsletterSignup(email) {
    showNotification("Subscribing...", "info");

    setTimeout(() => {
        showNotification("Successfully subscribed to FutureTech Daily!", "success");
        log("Newsletter signup:", email);
    }, 1200);
}


/* ============================================================
   NOTIFICATION SYSTEM
   ============================================================ */

function showNotification(message, type = "info") {
    let container = $("#notification-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 50);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 400);
    }, 3500);
}


/* ============================================================
   THEME SYSTEM (DARK / LIGHT READY)
   ============================================================ */

function initThemeSystem() {
    if (!FutureTechConfig.enableThemePersistence) return;

    const savedTheme = localStorage.getItem("futuretech-theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
}

/**
 * Toggle theme (hook to button later)
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("futuretech-theme", next);
}


/* ============================================================
   LIVE TIME & DATE
   ============================================================ */

function initLiveTime() {
    const timeElements = $all("time");

    if (!timeElements.length) return;

    setInterval(() => {
        const now = new Date();
        timeElements.forEach(el => {
            if (el.dataset.live === "true") {
                el.textContent = now.toLocaleString();
            }
        });
    }, 1000);
}


/* ============================================================
   LAZY LOADING FOR IMAGES (PERFORMANCE)
   ============================================================ */

function initLazyLoading() {
    const images = $all("img[data-src]");

    if (!("IntersectionObserver" in window) || !images.length) return;

    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "200px"
    });

    images.forEach(img => imgObserver.observe(img));
}


/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */

function initBackToTop() {
    const btn = document.createElement("button");
    btn.id = "back-to-top";
    btn.innerHTML = "↑";
    document.body.appendChild(btn);

    window.addEventListener("scroll", throttle(() => {
        btn.style.display = window.scrollY > 500 ? "block" : "none";
    }, 200));

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* ============================================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================================ */

function initAccessibilityEnhancements() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.activeElement.blur();
        }
    });

    $all("a, button, input").forEach(el => {
        if (!el.getAttribute("aria-label")) {
            el.setAttribute("aria-label", el.textContent.trim() || "interactive element");
        }
    });
}


/* ============================================================
   FUTURE EXTENSIONS (PLACEHOLDERS)
   ============================================================ */

/**
 * fetchLiveNews()
 * connectAIFeed()
 * enableRealtimeUpdates()
 * enableUserAccounts()
 * enableComments()
 * enableAnalytics()
 *
 * These are intentionally left as placeholders for
 * future platform-scale expansion.
 */


/* ============================================================
   END OF FUTURETECH JAVASCRIPT
   ============================================================ */