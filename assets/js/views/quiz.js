/* ============================================================================
   VUE — Quiz format examen
   mode : 'all', 'weak' (mes erreurs), ou un id de section
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  /** Identifiant stable d'une question, indépendant de l'ordre d'affichage. */
  function qid(sectionId, index) { return 'q' + sectionId + '-' + index; }
  App.quizId = qid;

  /** Toutes les questions sous forme de liste plate enrichie. */
  App.allQuestions = function () {
    var out = [];
    Object.keys(App.QUESTIONS).forEach(function (sid) {
      (App.QUESTIONS[sid] || []).forEach(function (q, idx) {
        out.push({ id: qid(sid, idx), q: q, section: Number(sid) });
      });
    });
    return out;
  };

  App.views.quiz = function (mode) {
    var pool, title, lead;

    if (mode === 'weak') {
      var weak = App.store.weakQuestionIds();
      var map = {};
      App.allQuestions().forEach(function (x) { map[x.id] = x; });
      pool = weak.map(function (id) { return map[id]; }).filter(Boolean);
      title = 'Mes erreurs';
      lead = "Uniquement les questions que vous avez ratées la dernière fois. Elles sortent de cette liste dès que vous y répondez correctement.";
    } else if (mode === 'all') {
      pool = U.sample(App.allQuestions(), 25);
      title = 'Quiz libre';
      lead = '25 questions tirées au hasard dans tout le programme, format examen.';
    } else {
      var sec = App.SECTION_BY_ID[Number(mode)];
      if (!sec) {
        return App.ui.empty('🧭', 'Section introuvable', "Ce quiz n'existe pas.") +
          '<div style="text-align:center"><a class="btn btn--soft" href="#/parcours">Voir le parcours</a></div>';
      }
      pool = (App.QUESTIONS[mode] || []).map(function (q, idx) {
        return { id: qid(mode, idx), q: q, section: Number(mode) };
      });
      title = 'Quiz — ' + sec.title;
      lead = 'Section ' + sec.id + ' · ' + pool.length + ' questions avec explication détaillée.';
    }

    if (!pool.length) {
      return App.ui.pagehead({ eyebrow: 'Quiz', title: title }) +
        App.ui.empty(mode === 'weak' ? '🎉' : '📭',
          mode === 'weak' ? 'Aucune erreur en attente' : 'Aucune question disponible',
          mode === 'weak' ? "Vous avez corrigé toutes vos erreurs. Lancez un quiz libre pour en générer de nouvelles." : '') +
        '<div style="text-align:center"><a class="btn btn--primary" href="#/quiz/all">Lancer un quiz libre</a></div>';
    }

    return runQuiz(U.shuffle(pool), { title: title, lead: lead, mode: mode });
  };

  /* ========================== Moteur de quiz ========================== */
  function runQuiz(items, opts) {
    var wrap = U.el('div');
    var i = 0, answered = false, correctCount = 0;
    var log = [];

    wrap.innerHTML =
      App.ui.pagehead({ eyebrow: 'Quiz', title: opts.title, lead: opts.lead }) +
      '<div class="qhead">' +
        '<div class="qprog">' + App.ui.bar(0) + '</div>' +
        '<div class="qcount" id="qCount"></div>' +
      '</div>' +
      '<div id="qHost"></div>';

    var host = wrap.querySelector('#qHost');
    var bar = wrap.querySelector('.bar > i');

    function paint() {
      answered = false;
      var item = items[i];
      var q = item.q;
      var sec = App.SECTION_BY_ID[item.section];

      // Mélange des options en conservant la trace de la bonne réponse
      var opts2 = q.o.map(function (text, idx) { return { text: text, isCorrect: idx === q.c }; });
      opts2 = U.shuffle(opts2);

      wrap.querySelector('#qCount').textContent = (i + 1) + ' / ' + items.length;
      bar.style.width = U.pct(i, items.length) + '%';

      host.innerHTML = '<div class="qcard">' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' +
          '<span class="badge">Section ' + item.section + (sec ? ' · ' + U.esc(sec.title) : '') + '</span>' +
          (q.obj ? '<span class="badge badge--accent">Obj. ' + U.esc(q.obj) + '</span>' : '') +
        '</div>' +
        '<div class="qtext">' + U.rich(q.q) + '</div>' +
        '<div class="qopts" id="qOpts">' +
          opts2.map(function (o, idx) {
            return '<button class="qopt" data-i="' + idx + '" data-ok="' + (o.isCorrect ? '1' : '0') + '">' +
              '<span class="qopt__k">' + 'ABCD'[idx] + '</span>' +
              '<span>' + U.rich(o.text) + '</span></button>';
          }).join('') +
        '</div>' +
        '<div id="qFeed"></div>' +
      '</div>';

      U.qsa('.qopt', host).forEach(function (b) {
        b.addEventListener('click', function () { answer(b, opts2); });
      });
    }

    function answer(btn, opts2) {
      if (answered) return;
      answered = true;

      var isOk = btn.getAttribute('data-ok') === '1';
      var item = items[i];

      U.qsa('.qopt', host).forEach(function (b) {
        b.disabled = true;
        if (b.getAttribute('data-ok') === '1') b.classList.add('is-correct');
        else if (b === btn) b.classList.add('is-wrong');
      });

      if (isOk) correctCount++;
      App.store.recordQuestion(item.id, isOk);
      App.store.save();
      log.push({ item: item, ok: isOk });

      var correctText = '';
      opts2.forEach(function (o, idx) { if (o.isCorrect) correctText = 'ABCD'[idx] + '. ' + o.text; });

      var feed = wrap.querySelector('#qFeed');
      feed.innerHTML = '<div class="qfeed ' + (isOk ? 'qfeed--ok' : 'qfeed--err') + '">' +
        '<div class="qfeed__t">' + (isOk ? '✓ Bonne réponse' : '✕ Réponse incorrecte') + '</div>' +
        (isOk ? '' : '<div class="qfeed__b" style="margin-bottom:9px"><strong>Bonne réponse :</strong> ' + U.rich(correctText) + '</div>') +
        '<div class="qfeed__b">' + U.rich(item.q.e) + '</div>' +
        (item.q.obj ? '<div class="qfeed__obj">Objectif CompTIA ' + U.esc(item.q.obj) +
          (App.OBJECTIVES[item.q.obj] ? ' — ' + U.esc(App.OBJECTIVES[item.q.obj]) : '') + '</div>' : '') +
        '</div>' +
        '<div class="btnrow" style="margin-top:16px;justify-content:flex-end">' +
          '<button class="btn btn--primary" id="nextBtn">' +
            (i + 1 >= items.length ? 'Voir le résultat' : 'Question suivante →') + '</button>' +
        '</div>';

      var nb = wrap.querySelector('#nextBtn');
      nb.focus();
      nb.onclick = next;
    }

    function next() {
      i++;
      if (i >= items.length) return finish();
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function finish() {
      bar.style.width = '100%';
      wrap.querySelector('#qCount').textContent = 'Terminé';
      var pct = U.pct(correctCount, items.length);

      // Enregistrement du meilleur score si le quiz portait sur une section
      if (opts.mode !== 'all' && opts.mode !== 'weak') {
        App.store.setQuizBest(Number(opts.mode), pct);
      }
      App.refreshChrome();

      var wrongs = log.filter(function (l) { return !l.ok; });

      host.innerHTML = '<div class="card card--pad-lg">' +
        '<div style="text-align:center;margin-bottom:22px">' +
          '<div style="font-size:44px;margin-bottom:10px">' + (pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪') + '</div>' +
          '<h2 class="h2" style="margin-bottom:8px">' +
            (pct >= 80 ? 'Excellent résultat' : pct >= 60 ? 'Bon résultat' : 'À retravailler') + '</h2>' +
          '<p class="lead" style="margin:0 auto 18px">' + correctCount + ' bonnes réponses sur ' + items.length + '</p>' +
          '<div style="display:flex;justify-content:center">' + App.ui.ring(pct, 'réussite', 128) + '</div>' +
        '</div>' +
        (wrongs.length
          ? '<div class="divider"></div><h3 class="h3" style="margin-bottom:12px">Points à revoir (' + wrongs.length + ')</h3>' +
            '<div style="display:grid;gap:9px">' + wrongs.map(function (w) {
              var s = App.SECTION_BY_ID[w.item.section];
              return '<a class="card card--link card--flat" href="#/section/' + w.item.section + '" style="padding:13px 15px">' +
                '<div style="font-size:13.5px;font-weight:600;margin-bottom:3px">' + U.esc(trim(w.item.q.q, 110)) + '</div>' +
                '<div class="muted">Section ' + w.item.section + ' · ' + U.esc(s ? s.title : '') + '</div></a>';
            }).join('') + '</div>'
          : '<div class="callout callout--tip">Sans faute. Ces questions sortent de votre liste d\'erreurs.</div>') +
        '<div class="btnrow" style="margin-top:22px;justify-content:center">' +
          '<a class="btn btn--soft" href="#/">Tableau de bord</a>' +
          (wrongs.length ? '<a class="btn btn--soft" href="#/quiz/weak">Rejouer mes erreurs</a>' : '') +
          '<button class="btn btn--primary" id="retryBtn">Nouveau quiz</button>' +
        '</div>' +
      '</div>';

      wrap.querySelector('#retryBtn').onclick = function () {
        var v = document.getElementById('view');
        v.innerHTML = '';
        var out = App.views.quiz(opts.mode);
        if (typeof out === 'string') v.innerHTML = out; else v.appendChild(out);
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
  }

  function trim(s, n) { return s.length > n ? s.slice(0, n) + '…' : s; }

})(window.App = window.App || {});
