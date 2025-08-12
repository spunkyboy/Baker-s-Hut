(function () {
  "use strict";

  function select(selector, root = document) {
    return root.querySelector(selector);
  }

  function selectAll(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  const navToggleButton = select(".nav-toggle");
  const primaryNav = select("#primary-navigation");
  const yearEl = select("#year");
  const navLinks = selectAll(".nav-link");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navToggleButton && primaryNav) {
    navToggleButton.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("open");
      navToggleButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Close mobile menu after navigation
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (primaryNav && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        navToggleButton && navToggleButton.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Active link handling based on scroll position
  const sectionTargets = selectAll("main section[id]");
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (!id) return;
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { root: null, threshold: 0.6 }
  );

  sectionTargets.forEach(function (section) { observer.observe(section); });
})();