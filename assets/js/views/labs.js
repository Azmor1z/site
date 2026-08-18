/* ============================================================================
   VUE — Labs PBQ (performance-based questions à étapes)
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  /* ------------------------------ Liste des labs ------------------------------ */
  App.views.labs = function () {
    var S = App.store;
    var done = App.LABS.filter(function (l) { return S.labDone(l.id); }).length;

    var html = App.ui.pagehead({
      eyebrow: 'Mises en situation',
      title: 'Labs PBQ',
      lead: "Les PBQ (performance-based questions) ouvrent l'examen et pèsent lourd. Chaque lab enchaîne plusieurs décisions dans un scénario réaliste, avec la justification complète à chaque étape."
    });

    html += '<div class="card" style="margin-bottom:22px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">' +
      '<div style="flex:1;min-width:200px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:7px">' +
          '<span style="font-size:13.5px;font-weight:650">Labs terminés</span>' +
          '<span class="muted">' + done + ' / ' + App.LABS.length + '</span></div>' +
        App.ui.bar(U.pct(done, App.LABS.length), App.ui.scoreMod(U.pct(done, App.LABS.length))) +
      '</div></div>';

    html += '<div class="grid grid--2">' + App.LABS.map(function (l) {
      var sec = App.SECTION_BY_ID[l.section];
      var d = App.getDomain(l.domain);
      var isDone = S.labDone(l.id);
      return '<a class="card card--link" href="#/labs/' + l.id + '">' +
        '<div style="display:flex;align-items:flex-start;gap:14px">' +
          '<div style="font-size:30px;line-height:1">' + l.icon + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="chips" style="margin-bottom:8px">' +
              '<span class="badge" style="color:' + d.color + '">' + d.id + '</span>' +
              '<span class="badge">' + U.esc(l.difficulty) + '</span>' +
              (isDone ? '<span class="badge badge--ok">✓ Terminé</span>' : '') +
            '</div>' +
            '<div class="h3" style="margin-bottom:5px">' + U.esc(l.title) + '</div>' +
            '<p class="muted" style="line-height:1.55">' + l.steps.length + ' étapes · Section ' + l.section +
              (sec ? ' — ' + U.esc(sec.title) : '') + '</p>' +
          '</div>' +
        '</div></a>';
    }).join('') + '</div>';

    return html;
  };

  /* ------------------------------ Déroulé d'un lab ------------------------------ */
  App.views.lab = function (id) {
    var lab = App.LAB_BY_ID[id];
    if (!lab) {
      return App.ui.empty('🧭', 'Lab introuvable', "Ce scénario n'existe pas.") +
        '<div style="text-align:center"><a class="btn btn--soft" href="#/labs">Voir tous les labs</a></div>';
    }

    var wrap = U.el('div');
    var i = 0, correctCount = 0, answered = false;
    var d = App.getDomain(lab.domain);
    var sec = App.SECTION_BY_ID[lab.section];

    wrap.innerHTML =
      '<div style="margin-bottom:14px"><a class="btn btn--ghost btn--sm" href="#/labs">← Tous les labs</a></div>' +
      '<div class="card card--pad-lg" style="margin-bottom:20px">' +
        '<div class="chips" style="margin-bottom:12px">' +
          '<span class="badge badge--accent">Lab PBQ</span>' +
          '<span class="badge" style="color:' + d.color + '">' + d.id + ' · ' + U.esc(d.fr) + '</span>' +
          '<span class="badge">' + U.esc(lab.difficulty) + '</span>' +
          '<a class="badge" href="#/section/' + lab.section + '">Section ' + lab.section + (sec ? ' · ' + U.esc(sec.title) : '') + '</a>' +
        '</div>' +
        '<div style="display:flex;align-items:flex-start;gap:16px">' +
          '<div style="font-size:38px;line-height:1">' + lab.icon + '</div>' +
          '<div><h1 class="h1" style="font-size:clamp(21px,2.8vw,28px);margin-bottom:10px">' + U.esc(lab.title) + '</h1>' +
          '<p class="lead">' + U.esc(lab.brief) + '</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="qhead">' +
        '<div class="qprog">' + App.ui.bar(0) + '</div>' +
        '<div class="qcount" id="lCount"></div>' +
      '</div>' +
      '<div id="lHost"></div>';

    var host = wrap.querySelector('#lHost');
    var bar = wrap.querySelector('.bar > i');

    function paint() {
      answered = false;
      var step = lab.steps[i];
      var opts = U.shuffle(step.options.map(function (t, idx) { return { text: t, isCorrect: idx === step.correct }; }));

      wrap.querySelector('#lCount').textContent = 'Étape ' + (i + 1) + ' / ' + lab.steps.length;
      bar.style.width = U.pct(i, lab.steps.length) + '%';

      host.innerHTML = '<div class="qcard">' +
        '<div class="qtext">' + U.rich(step.prompt) + '</div>' +
        '<div class="qopts" id="lOpts">' +
          opts.map(function (o, idx) {
            return '<button class="qopt" data-ok="' + (o.isCorrect ? '1' : '0') + '">' +
              '<span class="qopt__k">' + 'ABCD'[idx] + '</span><span>' + U.rich(o.text) + '</span></button>';
          }).join('') +
        '</div><div id="lFeed"></div></div>';

      U.qsa('.qopt', host).forEach(function (b) {
        b.addEventListener('click', function () { answer(b, opts); });
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function answer(btn, opts) {
      if (answered) return;
      answered = true;
      var isOk = btn.getAttribute('data-ok') === '1';
      if (isOk) correctCount++;

      U.qsa('.qopt', host).forEach(function (b) {
        b.disabled = true;
        if (b.getAttribute('data-ok') === '1') b.classList.add('is-correct');
        else if (b === btn) b.classList.add('is-wrong');
      });

      var correctText = '';
      opts.forEach(function (o, idx) { if (o.isCorrect) correctText = 'ABCD'[idx] + '. ' + o.text; });

      wrap.querySelector('#lFeed').innerHTML =
        '<div class="qfeed ' + (isOk ? 'qfeed--ok' : 'qfeed--err') + '">' +
          '<div class="qfeed__t">' + (isOk ? '✓ Bonne décision' : '✕ Mauvaise décision') + '</div>' +
          (isOk ? '' : '<div class="qfeed__b" style="margin-bottom:9px"><strong>Décision attendue :</strong> ' + U.rich(correctText) + '</div>') +
          '<div class="qfeed__b">' + U.rich(lab.steps[i].why) + '</div>' +
        '</div>' +
        '<div class="btnrow" style="margin-top:16px;justify-content:flex-end">' +
          '<button class="btn btn--primary" id="nextBtn">' +
            (i + 1 >= lab.steps.length ? 'Voir le bilan' : 'Étape suivante →') + '</button></div>';

      var nb = wrap.querySelector('#nextBtn');
      nb.focus();
      nb.onclick = function () {
        i++;
        if (i >= lab.steps.length) return finish();
        paint();
      };
    }

    function finish() {
      bar.style.width = '100%';
      wrap.querySelector('#lCount').textContent = 'Terminé';
      var pct = U.pct(correctCount, lab.steps.length);

      App.store.markLab(lab.id);
      App.refreshChrome();

      var others = App.LABS.filter(function (l) { return l.id !== lab.id && !App.store.labDone(l.id); }).slice(0, 3);

      host.innerHTML = '<div class="card card--pad-lg" style="text-align:center">' +
        '<div style="font-size:44px;margin-bottom:10px">' + (pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪') + '</div>' +
        '<h2 class="h2" style="margin-bottom:8px">Lab terminé</h2>' +
        '<p class="lead" style="margin:0 auto 20px">' + correctCount + ' bonnes décisions sur ' + lab.steps.length + '</p>' +
        '<div style="display:flex;justify-content:center;margin-bottom:22px">' + App.ui.ring(pct, 'réussite', 120) + '</div>' +
        '<div class="btnrow" style="justify-content:center">' +
          '<a class="btn btn--soft" href="#/labs">Tous les labs</a>' +
          '<a class="btn btn--soft" href="#/section/' + lab.section + '">Revoir la section ' + lab.section + '</a>' +
          '<button class="btn btn--primary" id="againBtn">Refaire ce lab</button>' +
        '</div>' +
      '</div>' +
      (others.length
        ? '<h3 class="h3" style="margin:24px 0 12px">Labs suivants</h3><div class="grid grid--3">' +
          others.map(function (l) {
            return '<a class="card card--link" href="#/labs/' + l.id + '">' +
              '<div style="font-size:22px;margin-bottom:8px">' + l.icon + '</div>' +
              '<div style="font-size:14px;font-weight:650;margin-bottom:3px">' + U.esc(l.title) + '</div>' +
              '<p class="muted">' + l.steps.length + ' étapes</p></a>';
          }).join('') + '</div>'
        : '');

      wrap.querySelector('#againBtn').onclick = function () {
        var v = document.getElementById('view');
        v.innerHTML = '';
        v.appendChild(App.views.lab(id));
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function onKey(e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (!answered && e.key >= '1' && e.key <= '4') {
        var btns = U.qsa('.qopt', host);
        var idx = Number(e.key) - 1;
        if (btns[idx]) { e.preventDefault(); btns[idx].click(); }
      } else if (answered && (e.key === 'ArrowRight' || e.key === 'Enter')) {
        var nb = wrap.querySelector('#nextBtn');
        if (nb) { e.preventDefault(); nb.click(); }
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { document.removeEventListener('keydown', onKey); });

    paint();
    return wrap;
  };

})(window.App = window.App || {});
