/* ============================================================================
   VUE — Détail d'une section
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  App.views.section = function (id) {
    var sec = App.SECTION_BY_ID[id];
    if (!sec) {
      return App.ui.empty('🧭', 'Section introuvable', 'Cette section n\'existe pas.') +
        '<div style="text-align:center"><a class="btn btn--soft" href="#/parcours">Voir le parcours</a></div>';
    }

    var S = App.store;
    var st = S.section(id);
    var p = S.sectionProgress(id);
    var d = App.getDomain(sec.domain);
    var cards = App.FLASHCARDS[id] || [];
    var qs = App.QUESTIONS[id] || [];
    var dr = App.DRILLS[id] || [];
    var labs = App.LABS.filter(function (l) { return l.section === id; });

    var wrap = U.el('div');
    var html = '';

    /* ---------------- En-tête ---------------- */
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">' +
      '<a class="btn btn--ghost btn--sm" href="#/parcours">← Parcours</a>' +
      (id > 1 ? '<a class="btn btn--ghost btn--sm" href="#/section/' + (id - 1) + '">Section ' + (id - 1) + '</a>' : '') +
      (id < 28 ? '<a class="btn btn--ghost btn--sm" href="#/section/' + (id + 1) + '">Section ' + (id + 1) + ' →</a>' : '') +
      '</div>';

    html += '<div class="card card--pad-lg" style="margin-bottom:22px">' +
      '<div style="display:flex;align-items:flex-start;gap:18px;flex-wrap:wrap">' +
        '<div style="font-size:44px;line-height:1">' + sec.icon + '</div>' +
        '<div style="flex:1;min-width:220px">' +
          '<div class="chips" style="margin-bottom:10px">' +
            '<span class="badge badge--accent">Section ' + sec.id + ' / 28</span>' +
            '<span class="badge" style="color:' + d.color + '">' + d.id + ' · ' + U.esc(d.fr) + '</span>' +
            (sec.objs.length ? sec.objs.map(function (o) { return '<span class="badge">Obj. ' + o + '</span>'; }).join('') : '') +
          '</div>' +
          '<h1 class="h1" style="font-size:clamp(23px,3vw,31px);margin-bottom:8px">' + U.esc(sec.title) + '</h1>' +
          '<p class="lead">' + U.esc(sec.summary) + '</p>' +
        '</div>' +
        '<div style="flex:none">' + App.ui.ring(p, 'maîtrise', 104) + '</div>' +
      '</div>' +
    '</div>';

    /* ---------------- Objectifs officiels ---------------- */
    if (sec.objs.length) {
      html += '<div class="callout" style="margin-bottom:22px">' +
        '<strong style="color:var(--text)">Objectifs CompTIA couverts</strong><br>' +
        sec.objs.map(function (o) {
          return '<span class="mono" style="color:var(--accent)">' + o + '</span> — ' + U.esc(App.OBJECTIVES[o] || '');
        }).join('<br>') +
      '</div>';
    }

    /* ---------------- Leçons du cours ---------------- */
    html += '<h2 class="h2" style="margin-bottom:12px">Leçons de cette section</h2>' +
      '<div class="card" style="margin-bottom:26px">' +
        '<div class="grid grid--2" style="gap:8px 20px">' +
        sec.lessons.map(function (l, i) {
          return '<div style="display:flex;gap:10px;align-items:baseline;font-size:14px;color:var(--text-2)">' +
            '<span class="mono" style="color:var(--text-3);flex:none">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span>' + U.esc(l) + '</span></div>';
        }).join('') +
        '</div>' +
      '</div>';

    /* ---------------- Points clés ---------------- */
    html += '<h2 class="h2" style="margin-bottom:6px">Points clés à mémoriser</h2>' +
      '<p class="muted" style="margin-bottom:14px">Relisez-les après avoir visionné les vidéos, puis validez la section.</p>' +
      '<div class="card" style="margin-bottom:20px"><div class="klist">' +
        sec.keypoints.map(function (k) {
          return '<div class="kitem"><span class="kitem__b"></span><span>' + U.rich(k) + '</span></div>';
        }).join('') +
      '</div></div>';

    /* ---------------- Validation lecture ---------------- */
    html += '<div class="card" style="margin-bottom:26px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div style="flex:1;min-width:200px">' +
        '<div class="h3" style="margin-bottom:3px">' + (st.read ? 'Section marquée comme étudiée' : 'Avez-vous visionné cette section ?') + '</div>' +
        '<p class="muted">Marquez-la comme étudiée après avoir regardé les vidéos Udemy correspondantes.</p>' +
      '</div>' +
      '<button class="btn ' + (st.read ? 'btn--soft' : 'btn--primary') + '" id="readBtn">' +
        (st.read ? '✓ Étudiée — annuler' : 'Marquer comme étudiée') + '</button>' +
    '</div>';

    /* ---------------- Entraînement ---------------- */
    html += '<h2 class="h2" style="margin-bottom:14px">S\'entraîner sur cette section</h2>' +
      '<div class="grid grid--3" style="margin-bottom:26px">';

    html += trainTile('#/flash/' + id, '🃏', 'Flashcards', cards.length + ' cartes', 'Mémorisation active avec répétition espacée.', cards.length > 0);
    html += trainTile('#/quiz/' + id, '✅', 'Quiz', qs.length + ' questions', 'Questions format examen avec explications.', qs.length > 0,
      st.quizBest > 0 ? 'Meilleur score : ' + st.quizBest + ' %' : null);
    html += trainTile('#/drills/' + id, '🧩', 'Exercices', dr.length + ' exercices', 'Association, tri, ordre et textes à trous.', dr.length > 0,
      dr.length ? st.drillsDone.length + ' / ' + dr.length + ' réussis' : null);

    html += '</div>';

    if (labs.length) {
      html += '<h2 class="h2" style="margin-bottom:14px">Lab PBQ associé</h2><div class="grid grid--2" style="margin-bottom:26px">';
      labs.forEach(function (l) {
        html += '<a class="card card--link" href="#/labs/' + l.id + '">' +
          '<div style="display:flex;gap:12px;align-items:flex-start">' +
            '<div style="font-size:24px">' + l.icon + '</div>' +
            '<div><div class="h3" style="margin-bottom:4px">' + U.esc(l.title) + '</div>' +
            '<p class="muted">' + l.steps.length + ' étapes · ' + U.esc(l.difficulty) +
            (S.labDone(l.id) ? ' · <span style="color:var(--green)">✓ terminé</span>' : '') + '</p></div>' +
          '</div></a>';
      });
      html += '</div>';
    }

    /* ---------------- Navigation ---------------- */
    html += '<div class="divider"></div><div class="btnrow" style="justify-content:space-between">' +
      (id > 1 ? '<a class="btn btn--soft" href="#/section/' + (id - 1) + '">← Section ' + (id - 1) + '</a>' : '<span></span>') +
      (id < 28 ? '<a class="btn btn--primary" href="#/section/' + (id + 1) + '">Section ' + (id + 1) + ' : ' + U.esc(App.SECTION_BY_ID[id + 1].title) + ' →</a>' : '<a class="btn btn--primary" href="#/exam">Passer un examen blanc →</a>') +
      '</div>';

    wrap.innerHTML = html;

    wrap.querySelector('#readBtn').addEventListener('click', function () {
      S.markRead(id, !S.section(id).read);
      App.ui.toast(S.section(id).read ? 'Section marquée comme étudiée' : 'Marquage retiré', S.section(id).read ? 'ok' : null);
      App.refreshChrome();
      // Re-rendu de la vue pour refléter l'état
      location.hash = '#/section/' + id;
      var v = document.getElementById('view');
      v.innerHTML = '';
      var out = App.views.section(id);
      if (typeof out === 'string') v.innerHTML = out; else v.appendChild(out);
    });

    return wrap;
  };

  function trainTile(href, icon, title, count, desc, enabled, extra) {
    if (!enabled) {
      return '<div class="card" style="opacity:.5">' +
        '<div style="font-size:24px;margin-bottom:9px">' + icon + '</div>' +
        '<div class="h3" style="margin-bottom:4px">' + U.esc(title) + '</div>' +
        '<p class="muted">Bientôt disponible</p></div>';
    }
    return '<a class="card card--link" href="' + href + '">' +
      '<div style="font-size:24px;margin-bottom:9px">' + icon + '</div>' +
      '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">' +
        '<span class="h3">' + U.esc(title) + '</span>' +
        '<span class="badge badge--accent">' + U.esc(count) + '</span></div>' +
      '<p class="muted" style="line-height:1.55">' + U.esc(desc) + '</p>' +
      (extra ? '<p class="muted" style="margin-top:7px;color:var(--accent)">' + U.esc(extra) + '</p>' : '') +
      '</a>';
  }

})(window.App = window.App || {});
