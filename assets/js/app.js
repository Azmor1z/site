/* ============================================================================
   APP — routeur, navigation, recherche globale, raccourcis clavier
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  var viewEl, mainEl;

  /* ============================== Routes ============================== */
  var routes = [
    { re: /^\/$/,                 view: function () { return App.views.dashboard(); } },
    { re: /^\/parcours$/,         view: function () { return App.views.roadmap(); } },
    { re: /^\/section\/(\d+)$/,   view: function (m) { return App.views.section(+m[1]); } },
    { re: /^\/flash\/(all|\d+)$/, view: function (m) { return App.views.flashcards(m[1]); } },
    { re: /^\/revision$/,         view: function () { return App.views.flashcards('due'); } },
    { re: /^\/quiz\/(all|weak|\d+)$/, view: function (m) { return App.views.quiz(m[1]); } },
    { re: /^\/drills\/(all|\d+)$/,view: function (m) { return App.views.drills(m[1]); } },
    { re: /^\/exam$/,             view: function () { return App.views.exam(); } },
    { re: /^\/labs$/,             view: function () { return App.views.labs(); } },
    { re: /^\/labs\/([\w-]+)$/,   view: function (m) { return App.views.lab(m[1]); } },
    { re: /^\/acronymes$/,        view: function () { return App.views.acronyms(); } },
    { re: /^\/ports$/,            view: function () { return App.views.ports(); } },
    { re: /^\/formules$/,         view: function () { return App.views.formulas(); } },
    { re: /^\/objectifs$/,        view: function () { return App.views.objectives(); } },
    { re: /^\/stats$/,            view: function () { return App.views.stats(); } }
  ];

  /** Nettoie proprement la vue précédente (timers, écouteurs globaux). */
  var cleanup = null;
  App.onLeave = function (fn) { cleanup = fn; };

  function currentPath() {
    var h = location.hash.replace(/^#/, '');
    return h || '/';
  }

  function render() {
    if (typeof cleanup === 'function') {
      try { cleanup(); } catch (e) { /* la vue précédente ne doit jamais bloquer la suivante */ }
      cleanup = null;
    }

    var path = currentPath();
    var matched = null, params = null;

    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i].re);
      if (m) { matched = routes[i]; params = m; break; }
    }

    viewEl.innerHTML = '';
    window.scrollTo(0, 0);

    if (!matched) {
      viewEl.innerHTML = App.ui.empty('🧭', 'Page introuvable',
        "Cette adresse n'existe pas.") +
        '<div style="text-align:center"><a class="btn btn--primary" href="#/">Retour au tableau de bord</a></div>';
      setActiveNav(path);
      return;
    }

    try {
      var out = matched.view(params);
      if (typeof out === 'string') viewEl.innerHTML = out;
      else if (out instanceof Node) viewEl.appendChild(out);
    } catch (err) {
      // Une vue qui plante ne doit jamais laisser un écran blanc.
      console.error('Erreur de rendu :', err);
      viewEl.innerHTML = App.ui.empty('⚠️', 'Une erreur est survenue',
        "Cette page n'a pas pu s'afficher. Le reste du site reste utilisable.") +
        '<div style="text-align:center"><a class="btn btn--soft" href="#/">Retour au tableau de bord</a></div>';
    }

    setActiveNav(path);
    refreshChrome();
  }

  /* ============================ Navigation ============================ */
  function setActiveNav(path) {
    U.qsa('.navlink').forEach(function (a) {
      var r = a.getAttribute('data-route');
      var on = (r === '/') ? (path === '/') : (path.indexOf(r) === 0);
      a.classList.toggle('is-active', on);
    });
    U.qsa('.navsec').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + path);
    });
  }

  function buildSectionNav() {
    var host = document.getElementById('sectionNav');
    if (!host) return;
    host.innerHTML = App.SECTIONS.map(function (s) {
      var p = App.store.sectionProgress(s.id);
      return '<a class="navsec' + (p >= 80 ? ' is-done' : '') + '" href="#/section/' + s.id + '" title="' + U.esc(s.title) + '">' +
        '<span class="navsec__n">' + (p >= 80 ? '✓' : s.id) + '</span>' +
        '<span class="navsec__t">' + U.esc(s.title) + '</span></a>';
    }).join('');
  }

  /** Met à jour les éléments persistants (série, badge de révision, nav). */
  function refreshChrome() {
    var sv = document.getElementById('streakVal');
    if (sv) sv.textContent = App.store.streak();

    var due = App.srs.dueCount();
    var badge = document.getElementById('dueBadge');
    if (badge) {
      badge.textContent = due > 99 ? '99+' : due;
      badge.hidden = due === 0;
    }
    buildSectionNav();
    setActiveNav(currentPath());
  }
  App.refreshChrome = refreshChrome;

  /* ============================== Thème ============================== */
  function setupTheme() {
    var btn = document.getElementById('themeBtn');
    function paint() { btn.textContent = App.store.getTheme() === 'dark' ? '🌙' : '☀️'; }
    paint();
    btn.addEventListener('click', function () {
      App.store.setTheme(App.store.getTheme() === 'dark' ? 'light' : 'dark');
      paint();
    });
  }

  /* ============================ Menu mobile ============================ */
  function setupSidebar() {
    var burger = document.getElementById('burger');
    var sidebar = document.getElementById('sidebar');
    var scrim = document.getElementById('scrim');

    function open(v) {
      sidebar.classList.toggle('is-open', v);
      scrim.hidden = !v;
      burger.setAttribute('aria-expanded', v ? 'true' : 'false');
      document.body.style.overflow = v ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { open(!sidebar.classList.contains('is-open')); });
    scrim.addEventListener('click', function () { open(false); });
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth <= 1000) open(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) open(false);
    });
  }

  /* =========================== Recherche =========================== */
  var searchIndex = null;

  function buildIndex() {
    if (searchIndex) return searchIndex;
    var idx = [];

    App.SECTIONS.forEach(function (s) {
      idx.push({ t: 'Section ' + s.id + ' — ' + s.title, m: s.fr + ' · ' + App.getDomain(s.domain).fr, h: '#/section/' + s.id, k: (s.title + ' ' + s.fr + ' ' + s.summary + ' ' + s.lessons.join(' ')).toLowerCase() });
      (s.keypoints || []).forEach(function (kp) {
        idx.push({ t: kp.length > 90 ? kp.slice(0, 90) + '…' : kp, m: 'Point clé · Section ' + s.id, h: '#/section/' + s.id, k: kp.toLowerCase() });
      });
    });

    (App.ACRONYMS || []).forEach(function (a) {
      idx.push({ t: a.a + ' — ' + a.f, m: 'Acronyme' + (a.fr ? ' · ' + a.fr : ''), h: '#/acronymes', k: (a.a + ' ' + a.f + ' ' + (a.fr || '')).toLowerCase() });
    });

    (App.PORTS || []).forEach(function (p) {
      idx.push({ t: 'Port ' + p.port + ' — ' + p.name, m: p.proto + ' · ' + p.desc, h: '#/ports', k: (p.port + ' ' + p.name + ' ' + p.desc).toLowerCase() });
    });

    Object.keys(App.FLASHCARDS || {}).forEach(function (sid) {
      (App.FLASHCARDS[sid] || []).forEach(function (c) {
        idx.push({ t: c.q, m: 'Flashcard · Section ' + sid, h: '#/flash/' + sid, k: (c.q + ' ' + c.a).toLowerCase() });
      });
    });

    searchIndex = idx;
    return idx;
  }

  function setupSearch() {
    var modal = document.getElementById('searchModal');
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var cur = -1;

    function open() {
      modal.hidden = false;
      input.value = '';
      results.innerHTML = '<div class="muted" style="padding:16px;text-align:center">Tapez pour rechercher parmi les sections, points clés, flashcards, acronymes et ports.</div>';
      cur = -1;
      setTimeout(function () { input.focus(); }, 40);
    }
    function close() { modal.hidden = true; }
    App.openSearch = open;

    document.getElementById('searchBtn').addEventListener('click', open);
    modal.querySelector('[data-close]').addEventListener('click', close);

    input.addEventListener('input', U.debounce(function () {
      var q = U.norm(input.value);
      cur = -1;
      if (q.length < 2) {
        results.innerHTML = '<div class="muted" style="padding:16px;text-align:center">Saisissez au moins 2 caractères.</div>';
        return;
      }
      var terms = q.split(' ').filter(Boolean);
      var hits = buildIndex().filter(function (it) {
        var k = U.norm(it.k);
        return terms.every(function (t) { return k.indexOf(t) !== -1; });
      }).slice(0, 40);

      if (!hits.length) {
        results.innerHTML = '<div class="muted" style="padding:16px;text-align:center">Aucun résultat.</div>';
        return;
      }
      results.innerHTML = hits.map(function (it, i) {
        return '<a class="sres" href="' + it.h + '" data-i="' + i + '">' +
          '<div class="sres__t">' + U.esc(it.t) + '</div>' +
          '<div class="sres__m">' + U.esc(it.m) + '</div></a>';
      }).join('');
    }, 130));

    results.addEventListener('click', function (e) { if (e.target.closest('.sres')) close(); });

    input.addEventListener('keydown', function (e) {
      var items = U.qsa('.sres', results);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        items.forEach(function (x) { x.classList.remove('is-cur'); });
        cur = (e.key === 'ArrowDown') ? (cur + 1) % items.length : (cur - 1 + items.length) % items.length;
        items[cur].classList.add('is-cur');
        items[cur].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (cur >= 0 && items[cur]) { location.hash = items[cur].getAttribute('href').slice(1); close(); }
        else if (items.length) { location.hash = items[0].getAttribute('href').slice(1); close(); }
      } else if (e.key === 'Escape') { close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) { close(); return; }
      // « / » ouvre la recherche, sauf en cours de saisie.
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (e.key === '/' && modal.hidden) { e.preventDefault(); open(); }
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); }
    });
  }

  /* ============================ Démarrage ============================ */
  function boot() {
    viewEl = document.getElementById('view');
    mainEl = document.getElementById('main');

    // Vérification d'intégrité : sans données, mieux vaut un message clair qu'un écran mort.
    if (!App.SECTIONS || !App.SECTIONS.length) {
      document.getElementById('boot').innerHTML = '<div style="text-align:center;padding:30px"><div style="font-size:40px">⚠️</div><p>Données du cours introuvables.</p></div>';
      return;
    }

    setupTheme();
    setupSidebar();
    setupSearch();

    window.addEventListener('hashchange', render);
    render();

    document.getElementById('topbar').hidden = false;
    document.getElementById('sidebar').hidden = false;
    mainEl.hidden = false;

    setTimeout(function () {
      var b = document.getElementById('boot');
      b.classList.add('is-done');
      setTimeout(function () { b.remove(); }, 450);
    }, 260);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window.App = window.App || {});
