/* ============================================================================
   VUE — Examen blanc : 90 questions en 90 minutes, conditions réelles
   Sélection pondérée selon le poids réel de chaque domaine à l'examen.
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  var TOTAL_Q = 90;
  var DURATION = 90 * 60; // secondes
  var PASS = 750;

  App.views.exam = function () {
    var wrap = U.el('div');
    var history = App.store.data.exams;

    wrap.innerHTML =
      App.ui.pagehead({
        eyebrow: 'Simulation officielle',
        title: 'Examen blanc SY0-701',
        lead: "90 questions en 90 minutes, réparties selon la pondération réelle des cinq domaines. Le score est calculé sur l'échelle 100–900, avec 750 comme seuil de réussite."
      }) +
      '<div class="grid grid--4" style="margin-bottom:22px">' +
        info('Durée', '90 min') +
        info('Questions', '90 max') +
        info('Seuil', '750 / 900') +
        info('Pondération', 'Officielle') +
      '</div>' +
      '<div class="card card--pad-lg" style="margin-bottom:22px">' +
        '<h3 class="h3" style="margin-bottom:12px">Répartition des questions</h3>' +
        App.DOMAINS.map(function (d) {
          var n = Math.round(TOTAL_Q * d.weight / 100);
          return '<div style="margin-bottom:11px">' +
            '<div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:5px">' +
              '<span><span style="color:' + d.color + ';font-weight:700">' + d.id + '</span> ' + U.esc(d.fr) + '</span>' +
              '<span class="muted">' + n + ' questions · ' + d.weight + ' %</span></div>' +
            '<div class="bar bar--thin"><i style="width:' + d.weight * 4 + '%;background:' + d.color + '"></i></div></div>';
        }).join('') +
        '<div class="callout callout--tip" style="margin-top:16px">' +
          '<strong>Conseil du jour J :</strong> commencez par un brain dump mental des formules SLE/ALE/ARO, ' +
          'des ports, des 7 phases de la réponse à incident et des modèles de contrôle d\'accès. ' +
          'Marquez les questions incertaines et revenez-y à la fin.' +
        '</div>' +
        '<div class="btnrow" style="margin-top:20px">' +
          '<button class="btn btn--primary btn--lg" id="startBtn">Démarrer l\'examen</button>' +
          '<button class="btn btn--soft btn--lg" id="startShort">Version courte (30 questions, 30 min)</button>' +
        '</div>' +
      '</div>' +
      (history.length ? historyBlock(history) : '');

    wrap.querySelector('#startBtn').onclick = function () { launch(90, DURATION); };
    wrap.querySelector('#startShort').onclick = function () { launch(30, 30 * 60); };

    function launch(n, secs) {
      var v = document.getElementById('view');
      v.innerHTML = '';
      v.appendChild(runExam(n, secs));
    }

    return wrap;
  };

  function info(k, v) {
    return '<div class="stat"><div class="stat__k">' + U.esc(k) + '</div><div class="stat__v" style="font-size:21px">' + U.esc(v) + '</div></div>';
  }

  function historyBlock(history) {
    return '<h2 class="h2" style="margin-bottom:12px">Historique de vos examens</h2>' +
      '<div class="tablewrap"><table class="tbl"><thead><tr>' +
        '<th>Date</th><th>Format</th><th>Bonnes réponses</th><th>Score</th><th>Résultat</th>' +
      '</tr></thead><tbody>' +
      history.slice(0, 12).map(function (e) {
        return '<tr>' +
          '<td>' + U.esc(new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })) + '</td>' +
          '<td>' + e.total + ' questions</td>' +
          '<td>' + e.correct + ' / ' + e.total + ' (' + U.pct(e.correct, e.total) + ' %)</td>' +
          '<td class="tbl__code">' + e.score + '</td>' +
          '<td>' + (e.score >= PASS
            ? '<span class="badge badge--ok">Réussi</span>'
            : '<span class="badge badge--err">Échoué</span>') + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  /* ====================== Sélection pondérée des questions ====================== */
  function pickQuestions(n) {
    var all = App.allQuestions();
    var byDomain = {};

    all.forEach(function (item) {
      var sec = App.SECTION_BY_ID[item.section];
      var dom = sec ? sec.domain : '1.0';
      (byDomain[dom] = byDomain[dom] || []).push(item);
    });

    var picked = [];
    App.DOMAINS.forEach(function (d) {
      var want = Math.round(n * d.weight / 100);
      var pool = byDomain[d.id] || [];
      picked = picked.concat(U.sample(pool, Math.min(want, pool.length)));
    });

    // Complète si un domaine manquait de questions, sans doublon
    if (picked.length < n) {
      var taken = {};
      picked.forEach(function (p) { taken[p.id] = true; });
      var rest = U.shuffle(all.filter(function (x) { return !taken[x.id]; }));
      picked = picked.concat(rest.slice(0, n - picked.length));
    }

    return U.shuffle(picked).slice(0, n);
  }

  /* ============================== Déroulé de l'examen ============================== */
  function runExam(n, duration) {
    var items = pickQuestions(n);
    var answers = new Array(items.length).fill(null); // index de l'option choisie
    var flags = new Array(items.length).fill(false);
    var shuffled = items.map(function (it) {
      return U.shuffle(it.q.o.map(function (text, idx) { return { text: text, isCorrect: idx === it.q.c }; }));
    });

    var i = 0, remaining = duration, timer = null, submitted = false;
    var wrap = U.el('div');

    wrap.innerHTML =
      '<div class="examtimer">' +
        '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
          '<span class="examtimer__c" id="clock">' + U.mmss(remaining) + '</span>' +
          '<span class="muted" id="progTxt"></span>' +
        '</div>' +
        '<div class="btnrow">' +
          '<button class="btn btn--soft btn--sm" id="flagBtn">⚑ Marquer</button>' +
          '<button class="btn btn--primary btn--sm" id="submitBtn">Terminer</button>' +
        '</div>' +
      '</div>' +
      '<div id="examHost"></div>' +
      '<div class="card" style="margin-top:20px">' +
        '<div class="h3" style="margin-bottom:11px">Navigation rapide</div>' +
        '<div class="examgrid" id="grid"></div>' +
        '<p class="muted" style="margin-top:11px">' +
          '<span style="color:var(--accent)">■</span> répondu · ' +
          '<span style="color:var(--amber)">■</span> marquée · ' +
          '<span style="color:var(--text-3)">■</span> non traitée</p>' +
      '</div>';

    var host = wrap.querySelector('#examHost');
    var clock = wrap.querySelector('#clock');
    var grid = wrap.querySelector('#grid');

    /* ------------------------------- Chronomètre ------------------------------- */
    timer = setInterval(function () {
      remaining--;
      clock.textContent = U.mmss(remaining);
      clock.classList.toggle('is-warn', remaining <= 600 && remaining > 300);
      clock.classList.toggle('is-crit', remaining <= 300);
      if (remaining <= 0) {
        App.ui.toast('Temps écoulé — examen soumis automatiquement', 'err', 4000);
        submit();
      }
    }, 1000);

    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    App.onLeave(stopTimer);

    /* ------------------------------- Rendu ------------------------------- */
    function paint() {
      var item = items[i];
      var opts = shuffled[i];

      wrap.querySelector('#progTxt').textContent =
        'Question ' + (i + 1) + ' / ' + items.length + ' · ' +
        answers.filter(function (a) { return a !== null; }).length + ' répondues';

      wrap.querySelector('#flagBtn').classList.toggle('btn--primary', flags[i]);
      wrap.querySelector('#flagBtn').classList.toggle('btn--soft', !flags[i]);

      host.innerHTML = '<div class="qcard">' +
        '<div class="qtext">' + U.rich(item.q.q) + '</div>' +
        '<div class="qopts">' +
          opts.map(function (o, idx) {
            return '<button class="qopt' + (answers[i] === idx ? ' is-correct' : '') + '" data-i="' + idx + '">' +
              '<span class="qopt__k">' + 'ABCD'[idx] + '</span><span>' + U.rich(o.text) + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="btnrow" style="margin-top:20px;justify-content:space-between">' +
          '<button class="btn btn--soft" id="prevBtn"' + (i === 0 ? ' disabled' : '') + '>← Précédente</button>' +
          '<button class="btn btn--soft" id="nextBtn"' + (i >= items.length - 1 ? ' disabled' : '') + '>Suivante →</button>' +
        '</div>' +
      '</div>';

      // L'index est figé ici : si l'utilisateur navigue via la grille pendant
      // le court délai d'enchaînement, la réponse reste attachée à sa question.
      var answeredIdx = i;
      U.qsa('.qopt', host).forEach(function (b) {
        b.addEventListener('click', function () {
          answers[answeredIdx] = Number(b.getAttribute('data-i'));
          U.qsa('.qopt', host).forEach(function (x) { x.classList.remove('is-correct'); });
          b.classList.add('is-correct');
          paintGrid();
          wrap.querySelector('#progTxt').textContent =
            'Question ' + (i + 1) + ' / ' + items.length + ' · ' +
            answers.filter(function (a) { return a !== null; }).length + ' répondues';
          // Enchaînement automatique, comme à l'examen réel
          if (answeredIdx < items.length - 1) {
            setTimeout(function () {
              if (submitted || i !== answeredIdx) return;
              i = answeredIdx + 1;
              paint();
            }, 180);
          }
        });
      });

      var pb = wrap.querySelector('#prevBtn'), nb = wrap.querySelector('#nextBtn');
      if (pb) pb.onclick = function () { if (i > 0) { i--; paint(); } };
      if (nb) nb.onclick = function () { if (i < items.length - 1) { i++; paint(); } };

      paintGrid();
    }

    function paintGrid() {
      grid.innerHTML = items.map(function (_, idx) {
        var cls = 'js-g';
        if (flags[idx]) cls += ' is-flag';
        else if (answers[idx] !== null) cls += ' is-done';
        if (idx === i) cls += ' is-cur';
        return '<button class="' + cls + '" data-g="' + idx + '">' + (idx + 1) + '</button>';
      }).join('');
      U.qsa('[data-g]', grid).forEach(function (b) {
        b.onclick = function () { i = Number(b.getAttribute('data-g')); paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      });
    }

    wrap.querySelector('#flagBtn').onclick = function () {
      flags[i] = !flags[i];
      paint();
    };

    wrap.querySelector('#submitBtn').onclick = function () {
      var unanswered = answers.filter(function (a) { return a === null; }).length;
      if (unanswered > 0) {
        App.ui.confirm(
          unanswered + ' question' + (unanswered > 1 ? 's' : '') + ' sans réponse. ' +
          "À l'examen réel il n'y a aucun point négatif : mieux vaut toujours répondre. Terminer malgré tout ?",
          submit);
      } else {
        App.ui.confirm('Terminer et corriger l\'examen ?', submit);
      }
    };

    /* ------------------------------- Correction ------------------------------- */
    function submit() {
      if (submitted) return;
      submitted = true;
      stopTimer();

      var correct = 0;
      var perDomain = {};
      App.DOMAINS.forEach(function (d) { perDomain[d.id] = { ok: 0, total: 0 }; });

      items.forEach(function (item, idx) {
        var sec = App.SECTION_BY_ID[item.section];
        var dom = sec ? sec.domain : '1.0';
        if (!perDomain[dom]) perDomain[dom] = { ok: 0, total: 0 };
        perDomain[dom].total++;

        var chosen = answers[idx];
        var isOk = chosen !== null && shuffled[idx][chosen] && shuffled[idx][chosen].isCorrect;
        if (isOk) { correct++; perDomain[dom].ok++; }
        App.store.recordQuestion(item.id, !!isOk);
      });

      // Conversion en échelle CompTIA 100-900 : 750 correspond à ~75 % de réussite
      var ratio = correct / items.length;
      var score = Math.round(100 + ratio * 800);
      var passed = score >= PASS;

      App.store.recordExam({
        date: Date.now(), total: items.length, correct: correct, score: score,
        timeUsed: duration - remaining, perDomain: perDomain
      });
      App.refreshChrome();

      wrap.querySelector('.examtimer').remove();
      wrap.querySelector('#grid').closest('.card').remove();

      host.innerHTML =
        '<div class="card card--pad-lg">' +
          '<div class="scorehero">' +
            '<div class="scorehero__v ' + (passed ? 'is-pass' : 'is-fail') + '">' + score + '</div>' +
            '<div class="scorehero__l">' +
              (passed ? '🎉 Réussi — seuil de 750 atteint' : 'Échoué — il faut atteindre 750 sur 900') + '<br>' +
              correct + ' bonnes réponses sur ' + items.length + ' (' + U.pct(correct, items.length) + ' %) · ' +
              'Temps utilisé : ' + U.mmss(duration - remaining) +
            '</div>' +
          '</div>' +

          '<div class="divider"></div>' +
          '<h3 class="h3" style="margin-bottom:14px">Résultat par domaine</h3>' +
          App.DOMAINS.map(function (d) {
            var p = perDomain[d.id] || { ok: 0, total: 0 };
            var pc = p.total ? U.pct(p.ok, p.total) : 0;
            return '<div style="margin-bottom:13px">' +
              '<div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:5px">' +
                '<span><span style="color:' + d.color + ';font-weight:700">' + d.id + '</span> ' + U.esc(d.fr) + '</span>' +
                '<span class="muted">' + p.ok + ' / ' + p.total + ' · <strong style="color:var(--text-2)">' + pc + ' %</strong></span>' +
              '</div>' + App.ui.bar(pc, App.ui.scoreMod(pc)) + '</div>';
          }).join('') +

          weakAdvice(perDomain) +

          '<div class="btnrow" style="margin-top:22px;justify-content:center">' +
            '<a class="btn btn--soft" href="#/">Tableau de bord</a>' +
            '<a class="btn btn--soft" href="#/quiz/weak">Revoir mes erreurs</a>' +
            '<a class="btn btn--primary" href="#/exam">Nouvel examen</a>' +
          '</div>' +
        '</div>' +

        detailBlock(items, shuffled, answers);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function weakAdvice(perDomain) {
      var weak = App.DOMAINS.filter(function (d) {
        var p = perDomain[d.id];
        return p && p.total > 0 && U.pct(p.ok, p.total) < 70;
      });
      if (!weak.length) {
        return '<div class="callout callout--tip" style="margin-top:16px">' +
          'Tous vos domaines dépassent 70 %. Continuez à réviser régulièrement pour consolider.</div>';
      }
      return '<div class="callout callout--warn" style="margin-top:16px">' +
        '<strong>Domaines à retravailler en priorité :</strong><br>' +
        weak.map(function (d) {
          var secs = App.SECTIONS.filter(function (s) { return s.domain === d.id; })
            .map(function (s) { return '<a href="#/section/' + s.id + '" style="color:var(--accent)">' + s.id + '</a>'; }).join(', ');
          return d.id + ' ' + U.esc(d.fr) + ' — sections ' + secs;
        }).join('<br>') + '</div>';
    }

    function detailBlock(items, shuffled, answers) {
      var wrongs = [];
      items.forEach(function (item, idx) {
        var chosen = answers[idx];
        var isOk = chosen !== null && shuffled[idx][chosen] && shuffled[idx][chosen].isCorrect;
        if (!isOk) wrongs.push({ item: item, idx: idx, chosen: chosen });
      });
      if (!wrongs.length) return '';

      return '<h2 class="h2" style="margin:26px 0 14px">Correction détaillée (' + wrongs.length + ' erreurs)</h2>' +
        wrongs.map(function (w) {
          var opts = shuffled[w.idx];
          var correctText = '';
          opts.forEach(function (o, k) { if (o.isCorrect) correctText = 'ABCD'[k] + '. ' + o.text; });
          var chosenText = w.chosen === null ? 'Aucune réponse donnée' : 'ABCD'[w.chosen] + '. ' + opts[w.chosen].text;
          var sec = App.SECTION_BY_ID[w.item.section];

          return '<div class="card" style="margin-bottom:12px">' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">' +
              '<span class="badge">Q' + (w.idx + 1) + '</span>' +
              '<a class="badge badge--accent" href="#/section/' + w.item.section + '">Section ' + w.item.section +
                (sec ? ' · ' + U.esc(sec.title) : '') + '</a>' +
              (w.item.q.obj ? '<span class="badge">Obj. ' + U.esc(w.item.q.obj) + '</span>' : '') +
            '</div>' +
            '<div style="font-size:15px;font-weight:640;line-height:1.5;margin-bottom:12px">' + U.rich(w.item.q.q) + '</div>' +
            '<div class="qfeed qfeed--err" style="margin-bottom:9px"><div class="qfeed__b">' +
              '<strong>Votre réponse :</strong> ' + U.rich(chosenText) + '</div></div>' +
            '<div class="qfeed qfeed--ok" style="margin-bottom:9px"><div class="qfeed__b">' +
              '<strong>Bonne réponse :</strong> ' + U.rich(correctText) + '</div></div>' +
            '<div class="qfeed"><div class="qfeed__b">' + U.rich(w.item.q.e) + '</div></div>' +
          '</div>';
        }).join('');
    }

    /* ------------------------------- Raccourcis ------------------------------- */
    function onKey(e) {
      if (submitted) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key >= '1' && e.key <= '4') {
        var btns = U.qsa('.qopt', host);
        var idx = Number(e.key) - 1;
        if (btns[idx]) { e.preventDefault(); btns[idx].click(); }
      } else if (e.key === 'ArrowRight') {
        if (i < items.length - 1) { i++; paint(); }
      } else if (e.key === 'ArrowLeft') {
        if (i > 0) { i--; paint(); }
      } else if (e.key === 'f' || e.key === 'F') {
        flags[i] = !flags[i]; paint();
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { stopTimer(); document.removeEventListener('keydown', onKey); });

    paint();
    return wrap;
  }

})(window.App = window.App || {});
