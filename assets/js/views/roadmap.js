/* ============================================================================
   VUE — Parcours des 28 sections
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  App.views.roadmap = function () {
    var S = App.store;
    var wrap = U.el('div');

    var done = App.SECTIONS.filter(function (s) { return S.sectionProgress(s.id) >= 80; }).length;

    var head = App.ui.pagehead({
      eyebrow: 'Parcours complet',
      title: 'Les 28 sections du cours',
      lead: "Exactement l'ordre du cours Jason Dion. Travaillez-les dans l'ordre : chaque section s'appuie sur les précédentes."
    });

    var filters = '<div class="tabs" id="domFilter">' +
      '<button class="tab is-on" data-dom="all">Tout (28)</button>' +
      App.DOMAINS.map(function (d) {
        var n = App.SECTIONS.filter(function (s) { return s.domain === d.id; }).length;
        return '<button class="tab" data-dom="' + d.id + '">' + d.id + ' · ' + U.esc(d.fr) + ' (' + n + ')</button>';
      }).join('') + '</div>';

    var progress = '<div class="card" style="margin-bottom:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">' +
      '<div style="flex:1;min-width:200px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:7px">' +
          '<span style="font-size:13.5px;font-weight:650">Avancement du parcours</span>' +
          '<span class="muted">' + done + ' / 28 sections maîtrisées</span>' +
        '</div>' +
        App.ui.bar(U.pct(done, 28), App.ui.scoreMod(U.pct(done, 28))) +
      '</div>' +
      '<a class="btn btn--soft btn--sm" href="#/stats">Voir les statistiques</a>' +
      '</div>';

    wrap.innerHTML = head + progress + filters + '<div class="seclist" id="secList"></div>';

    var list = wrap.querySelector('#secList');

    function render(dom) {
      var items = App.SECTIONS.filter(function (s) { return dom === 'all' || s.domain === dom; });
      list.innerHTML = items.map(function (s) {
        var p = S.sectionProgress(s.id);
        var d = App.getDomain(s.domain);
        var nCards = (App.FLASHCARDS[s.id] || []).length;
        var nQ = (App.QUESTIONS[s.id] || []).length;
        var nD = (App.DRILLS[s.id] || []).length;
        return '<a class="secitem" href="#/section/' + s.id + '">' +
          '<div class="secitem__num">' + s.icon +
            (p >= 80 ? '<span class="secitem__badge">✓</span>' : '') + '</div>' +
          '<div style="min-width:0">' +
            '<div class="secitem__t">' + s.id + '. ' + U.esc(s.title) + '</div>' +
            '<div class="secitem__m">' +
              '<span style="color:' + d.color + ';font-weight:650">' + d.id + '</span>' +
              '<span>·</span><span>' + nCards + ' cartes</span>' +
              '<span>·</span><span>' + nQ + ' questions</span>' +
              '<span>·</span><span>' + nD + ' exercices</span>' +
            '</div>' +
            '<div class="bar bar--thin" style="margin-top:8px;max-width:280px"><i style="width:' + p + '%"></i></div>' +
          '</div>' +
          '<div class="secitem__pct">' + p + ' %</div>' +
        '</a>';
      }).join('');
    }

    render('all');

    wrap.querySelector('#domFilter').addEventListener('click', function (e) {
      var b = e.target.closest('[data-dom]');
      if (!b) return;
      U.qsa('.tab', wrap).forEach(function (t) { t.classList.remove('is-on'); });
      b.classList.add('is-on');
      render(b.getAttribute('data-dom'));
    });

    return wrap;
  };

})(window.App = window.App || {});
