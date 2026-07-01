/* =========================================================================
   Pjesme mora i kamena — interakcije
   Bez vanjskih ovisnosti. Poštuje prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     KONFIGURACIJA PLAĆANJA
     -----------------------------------------------------------------------
     Kada dobijete Stripe poveznicu, zalijepite je ovdje (jedno jedino mjesto).
     Čim STRIPE_URL više ne bude prazan, gumbi za kupnju automatski se
     aktiviraju i vode na tu poveznicu.
  */
  var STRIPE_URL = ""; // npr. "https://buy.stripe.com/xxxxxxxx"

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); };
  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  document.documentElement.classList.remove("no-js");

  /* -----------------------------------------------------------------------
     1. Sticky zaglavlje (sjena kad se skrola)
     ----------------------------------------------------------------------- */
  var header = $(".site-header");
  var onScrollHeader = function () {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 12);
  };
  onScrollHeader();

  /* -----------------------------------------------------------------------
     2. Mobilna navigacija
     ----------------------------------------------------------------------- */
  var toggle = $(".nav__toggle");
  var closeNav = function () { document.body.classList.remove("nav-open"); if (toggle) toggle.setAttribute("aria-expanded", "false"); };
  on(toggle, "click", function () {
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$(".nav__links a").forEach(function (a) { on(a, "click", closeNav); });
  on(document, "keydown", function (e) { if (e.key === "Escape") closeNav(); });
  // Zatvori izbornik na resize prema širokom ekranu
  var mq = window.matchMedia("(min-width: 721px)");
  (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function () { closeNav(); });

  /* -----------------------------------------------------------------------
     3. Scroll reveal (IntersectionObserver)
     ----------------------------------------------------------------------- */
  var revealEls = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* -----------------------------------------------------------------------
     4. FAQ akordeon (<details>) — glatko otvaranje + samo jedan otvoren
     ----------------------------------------------------------------------- */
  var faqItems = $$(".qa");
  faqItems.forEach(function (item) {
    var summary = $(".qa__q", item);
    var panel = $(".qa__a", item);
    if (!summary || !panel) return;

    on(summary, "click", function (e) {
      e.preventDefault();
      var isOpen = item.hasAttribute("open");
      // zatvori ostale
      faqItems.forEach(function (other) {
        if (other !== item && other.hasAttribute("open")) collapse(other);
      });
      if (isOpen) collapse(item); else expand(item);
    });

    function expand(el) {
      var p = $(".qa__a", el);
      el.setAttribute("open", "");
      if (reduceMotion) return;
      var h = p.scrollHeight;
      p.style.height = "0px";
      requestAnimationFrame(function () {
        p.style.transition = "height .4s cubic-bezier(.16,1,.3,1)";
        p.style.height = h + "px";
      });
      on(p, "transitionend", function te() { p.style.height = ""; p.style.transition = ""; p.removeEventListener("transitionend", te); });
    }
    function collapse(el) {
      var p = $(".qa__a", el);
      if (reduceMotion) { el.removeAttribute("open"); return; }
      var h = p.scrollHeight;
      p.style.height = h + "px";
      requestAnimationFrame(function () {
        p.style.transition = "height .35s cubic-bezier(.16,1,.3,1)";
        p.style.height = "0px";
      });
      on(p, "transitionend", function te() { el.removeAttribute("open"); p.style.height = ""; p.style.transition = ""; p.removeEventListener("transitionend", te); });
    }
  });

  /* -----------------------------------------------------------------------
     5. Back-to-top + progress bar čitanja
     ----------------------------------------------------------------------- */
  var toTop = $(".to-top");
  on(toTop, "click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  var progress = $(".progress");
  var ticking = false;
  var onScroll = function () {
    onScrollHeader();
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 600);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
    ticking = false;
  };
  on(window, "scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* -----------------------------------------------------------------------
     6. Suptilni parallax naslovne knjige (miš)
     ----------------------------------------------------------------------- */
  var book = $(".book");
  var stage = $(".book-stage");
  if (book && stage && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    on(stage, "mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      book.style.transform = "rotateY(" + (-22 + x * 16) + "deg) rotateX(" + (6 - y * 12) + "deg)";
    });
    on(stage, "mouseleave", function () { book.style.transform = ""; });
  }

  /* -----------------------------------------------------------------------
     7. Gumbi za kupnju — Stripe poveznica
     ----------------------------------------------------------------------- */
  var buyButtons = $$("[data-buy]");
  buyButtons.forEach(function (btn) {
    if (STRIPE_URL) {
      btn.removeAttribute("disabled");
      btn.setAttribute("aria-disabled", "false");
      var label = btn.getAttribute("data-buy-label");
      if (label) { var span = $(".buy-label", btn); if (span) span.textContent = label; }
      on(btn, "click", function () { window.location.href = STRIPE_URL; });
    } else {
      btn.setAttribute("disabled", "");
      btn.setAttribute("aria-disabled", "true");
    }
  });

  /* -----------------------------------------------------------------------
     8. Newsletter (samo vizualna potvrda — spoji na servis kasnije)
     ----------------------------------------------------------------------- */
  var nlForm = $(".newsletter");
  on(nlForm, "submit", function (e) {
    e.preventDefault();
    var msg = $(".newsletter__msg");
    var input = $("input", nlForm);
    if (input && input.value && /.+@.+\..+/.test(input.value)) {
      if (msg) msg.textContent = "Hvala! Javit ćemo vam se čim knjiga izađe iz tiska.";
      input.value = "";
    } else {
      if (msg) msg.textContent = "Molimo unesite ispravnu e-mail adresu.";
    }
  });

  /* -----------------------------------------------------------------------
     9. Godina u podnožju
     ----------------------------------------------------------------------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* -----------------------------------------------------------------------
     10. Aktivna oznaka u navigaciji prema trenutnoj stranici
     ----------------------------------------------------------------------- */
  var path = location.pathname.split("/").pop() || "index.html";
  $$(".nav__link").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "index.html" && (href === "./" || href === "index.html"))) {
      a.setAttribute("aria-current", "page");
    }
  });
})();
