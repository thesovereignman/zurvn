(() => {
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const menu = document.querySelector(".mobile-menu");
  const menuLinks = menu ? menu.querySelectorAll("a") : [];

  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (overlay) overlay.hidden = !open;
    if (menu) menu.hidden = !open;
  };

  burger?.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("menu-open"));
  });

  overlay?.addEventListener("click", () => setMenu(false));

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) setMenu(false);
  });

  const easeOutCubic = (t) => 1 - (1 - t) ** 3;

  const animateCount = (el, target, decimals, duration) => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = (target * easeOutCubic(t)).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll("[data-count]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    counters.forEach((el) => {
      el.textContent = Number(el.dataset.count).toFixed(Number(el.dataset.decimals));
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.done) return;
        el.dataset.done = "1";
        const i = Number(el.dataset.i);
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals);
        window.setTimeout(() => {
          animateCount(el, target, decimals, 1500 + i * 80);
        }, 480 + i * 90);
        io.unobserve(el);
      });
    },
    { threshold: 0.25 }
  );

  counters.forEach((el) => io.observe(el));
})();
