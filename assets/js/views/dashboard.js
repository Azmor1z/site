/* ============================================================================
   VUE — Tableau de bord
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  App.views.dashboard = function () {
    var S = App.store;
    var global = S.globalProgress();
    var due = App.srs.dueCount();
    var bd = App.srs.breakdown();
    var streak = S.streak();
    var totals = S.data.totals;
    var acc = totals.questions > 0 ? U.pct(totals.correct, totals.questions) : 0;

    // Section en cours : la première non maîtrisée
    var next = null;
    for (var i = 0; i < App.SECTIONS.length; i++) {
      if (S.sectionProgress(App.SECTIONS[i].id) < 80) { next = App.SECTIONS[i]; break; }
    }
    var finished = !next;

    var lastExam = S.data.exams[0] || null;

    var html = '';

    /* ---------------- En-tête ---------------- */
    html += '<div class="pagehead">' +
      '<div class="eyebrow">CompTIA Security+ SY0-701 · Parcours Jason Dion</div>' +
      '<h1 class="h1">' + (global === 0 ? 'Prêt à commencer ?' : 'Votre progression') + '</h1>' +
      '<p class="lead">Cette plateforme suit exactement l\'ordre des 28 sections du cours Udemy. ' +
      'Chaque section combine points clés, flashcards à répétition espacée, QCM format examen et exercices interactifs.</p>' +
      '</div>';

    /* ---------------- Bloc principal ---------------- */
    html += '<div class="grid grid--2" style="margin-bottom:16px">';

    // Carte progression
    html += '<div class="card" style="display:flex;align-items:center;gap:22px">' +
      App.ui.ring(global, 'maîtrise', 132) +
      '<div style="flex:1;min-width:0">' +
        '<div class="h3" style="margin-bottom:6px">Progression globale</div>' +
        '<p class="muted" style="margin-bottom:14px">' +
          App.SECTIONS.filter(function (s) { return S.sectionProgress(s.id) >= 80; }).length +
          ' section' + (App.SECTIONS.filter(function (s) { return S.sectionProgress(s.id) >= 80; }).length > 1 ? 's' : '') +
          ' maîtrisée' + (App.SECTIONS.filter(function (s) { return S.sectionProgress(s.id) >= 80; }).length > 1 ? 's' : '') +
          ' sur 28</p>' +
        (finished
          ? '<a class="btn btn--primary btn--sm" href="#/exam">Passer un examen blanc</a>'
          : '<a class="btn btn--primary btn--sm" href="#/section/' + next.id + '">Continuer : section ' + next.id + '</a>') +
      '</div></div>';

    // Carte révision du jour
    html += '<div class="card">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px">' +
        '<div><div class="h3" style="margin-bottom:4px">Révision du jour</div>' +
        '<p class="muted">' + (due === 0
          ? 'Aucune carte à revoir. Tout est à jour.'
          : U.plural(due, 'carte') + ' à revoir aujourd\'hui') + '</p></div>' +
        '<div style="font-size:32px;line-height:1">' + (due === 0 ? '✅' : '🔁') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        srsPill('Nouvelles', bd.fresh, 'var(--text-3)') +
        srsPill('En cours', bd.learning, 'var(--amber)') +
        srsPill('Consolidées', bd.young, 'var(--accent)') +
        srsPill('Acquises', bd.mature, 'var(--green)') +
      '</div>' +
      (due > 0
        ? '<a class="btn btn--primary btn--sm btn--block" href="#/revision">Réviser maintenant</a>'
        : '<a class="btn btn--soft btn--sm btn--block" href="#/flash/all">Parcourir les flashcards</a>') +
      '</div>';

    html += '</div>';

    /* ---------------- Statistiques ---------------- */
    html += '<div class="grid grid--4" style="margin-bottom:26px">' +
      stat('Série en cours', streak + (streak > 1 ? ' jours' : ' jour'), streak > 0 ? '🔥 Record : ' + S.data.streak.best : 'Étudiez aujourd\'hui') +
      stat('Cartes révisées', totals.cards, 'depuis le début') +
      stat('Questions traitées', totals.questions, totals.questions > 0 ? acc + ' % de réussite' : 'aucune pour l\'instant') +
      stat('Examens blancs', S.data.exams.length, lastExam ? 'dernier : ' + lastExam.score + '/900' : 'aucun passé') +
      '</div>';

    /* ---------------- Accès rapides ---------------- */
    html += '<h2 class="h2" style="margin-bottom:14px">Modes d\'entraînement</h2>';
    html += '<div class="grid grid--3" style="margin-bottom:26px">' +
      tile('#/quiz/all', '✅', 'Quiz libre', 'Questions format examen, toutes sections confondues, avec explication détaillée.') +
      tile('#/quiz/weak', '🎯', 'Mes erreurs', 'Rejouez uniquement les questions que vous avez ratées la dernière fois.') +
      tile('#/flash/all', '🃏', 'Flashcards', 'Mémorisation active pilotée par répétition espacée.') +
      tile('#/drills/all', '🧩', 'Exercices', 'Association, tri par catégories, ordonnancement et textes à trous.') +
      tile('#/labs', '🖥️', 'Labs PBQ', 'Mises en situation à étapes, comme les questions de performance.') +
      tile('#/exam', '⏱️', 'Examen blanc', '90 questions en 90 minutes, dans les conditions réelles.') +
      '</div>';

    /* ---------------- Progression par domaine ---------------- */
    html += '<h2 class="h2" style="margin-bottom:14px">Progression par domaine d\'examen</h2>';
    html += '<div class="card" style="margin-bottom:26px">';
    App.DOMAINS.forEach(function (d, i) {
      var secs = App.SECTIONS.filter(function (s) { return s.domain === d.id; });
      var avg = secs.length ? Math.round(secs.reduce(function (a, s) { return a + S.sectionProgress(s.id); }, 0) / secs.length) : 0;
      html += '<div style="' + (i > 0 ? 'margin-top:16px' : '') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:6px">' +
          '<span style="font-size:13.5px;font-weight:650">' +
            '<span style="color:' + d.color + '">' + d.id + '</span> ' + U.esc(d.fr) + '</span>' +
          '<span class="muted" style="white-space:nowrap">' + d.weight + ' % de l\'examen · <strong style="color:var(--text-2)">' + avg + ' %</strong></span>' +
        '</div>' +
        '<div class="bar"><i style="width:' + avg + '%;background:' + d.color + '"></i></div>' +
      '</div>';
    });
    html += '</div>';

    /* ---------------- Prochaine étape ---------------- */
    if (next) {
      var dom = App.getDomain(next.domain);
      html += '<h2 class="h2" style="margin-bottom:14px">Votre prochaine section</h2>' +
        '<a class="card card--link" href="#/section/' + next.id + '" style="display:block">' +
          '<div style="display:flex;align-items:flex-start;gap:16px">' +
            '<div style="font-size:34px;line-height:1">' + next.icon + '</div>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:6px">' +
                '<span class="badge badge--accent">Section ' + next.id + '</span>' +
                '<span class="badge" style="color:' + dom.color + '">' + dom.id + '</span>' +
              '</div>' +
              '<div class="h3" style="margin-bottom:6px">' + U.esc(next.title) + '</div>' +
              '<p class="muted" style="line-height:1.6">' + U.esc(next.summary) + '</p>' +
            '</div>' +
          '</div>' +
        '</a>';
    }

    /* ---------------- Aide ---------------- */
    html += '<div class="divider"></div>' +
      '<p class="muted" style="text-align:center">' +
      'Raccourcis : <span class="kbd">/</span> recherche · <span class="kbd">1</span>–<span class="kbd">4</span> répondre en quiz · ' +
      '<span class="kbd">Espace</span> retourner une carte · <span class="kbd">→</span> question suivante' +
      '</p>';

    return html;
  };

  /* ---------------------------- Fragments ---------------------------- */
  function stat(k, v, s) {
    return '<div class="stat"><div class="stat__k">' + U.esc(k) + '</div>' +
      '<div class="stat__v">' + U.esc(String(v)) + '</div>' +
      '<div class="stat__s">' + U.esc(s) + '</div></div>';
  }

  function tile(href, icon, title, desc) {
    return '<a class="card card--link" href="' + href + '">' +
      '<div style="font-size:26px;margin-bottom:10px">' + icon + '</div>' +
      '<div class="h3" style="margin-bottom:5px">' + U.esc(title) + '</div>' +
      '<p class="muted" style="line-height:1.55">' + U.esc(desc) + '</p></a>';
  }

  function srsPill(label, n, color) {
    return '<div style="flex:1;text-align:center;padding:8px 4px;border-radius:9px;background:var(--surface-2);border:1px solid var(--border)">' +
      '<div style="font-size:17px;font-weight:800;color:' + color + '">' + n + '</div>' +
      '<div style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-top:1px">' + U.esc(label) + '</div></div>';
  }

})(window.App = window.App || {});
