/* ============================================================================
   VUE — Flashcards avec répétition espacée
   mode : 'all' (toutes), 'due' (révision du jour), ou un id de section
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  App.views.flashcards = function (mode) {
    var deck = buildDeck(mode);
    var title, lead;

    if (mode === 'due') {
      title = 'Révision du jour';
      lead = "Les cartes dont l'échéance est atteinte, toutes sections confondues. Notez-vous honnêtement : l'algorithme ajuste les prochaines échéances.";
    } else if (mode === 'all') {
      title = 'Toutes les flashcards';
      lead = "L'intégralité des cartes du programme, mélangées. Idéal pour un balayage large.";
    } else {
      var sec = App.SECTION_BY_ID[Number(mode)];
      if (!sec) return notFound();
      title = 'Flashcards — ' + sec.title;
      lead = 'Section ' + sec.id + ' · ' + deck.length + ' cartes.';
    }

    if (!deck.length) {
      return App.ui.pagehead({ eyebrow: 'Flashcards', title: title }) +
        App.ui.empty('✅', 'Rien à réviser pour le moment',
          mode === 'due' ? "Toutes vos cartes sont à jour. Revenez demain ou parcourez une section." : "Aucune carte disponible ici.") +
        '<div style="text-align:center"><a class="btn btn--soft" href="#/">Retour au tableau de bord</a></div>';
    }

    deck = U.shuffle(deck);

    var wrap = U.el('div');
    var i = 0, flipped = false;
    var session = { seen: 0, again: 0, good: 0 };

    wrap.innerHTML =
      App.ui.pagehead({ eyebrow: 'Flashcards', title: title, lead: lead }) +
      '<div class="qhead">' +
        '<div class="qprog">' + App.ui.bar(0) + '</div>' +
        '<div class="qcount" id="fcCount"></div>' +
      '</div>' +
      '<div class="fcstage"><div class="fc" id="fc">' +
        '<div class="fc__face fc__face--front">' +
          '<div class="fc__tag" id="fcTagF"></div>' +
          '<div class="fc__q" id="fcQ"></div>' +
          '<div class="fc__hint">Cliquez ou appuyez sur <span class="kbd">Espace</span> pour retourner</div>' +
        '</div>' +
        '<div class="fc__face fc__face--back">' +
          '<div class="fc__tag" id="fcTagB"></div>' +
          '<div class="fc__a" id="fcA"></div>' +
        '</div>' +
      '</div></div>' +
      '<div id="fcActions"></div>';

    var fc = wrap.querySelector('#fc');
    var actions = wrap.querySelector('#fcActions');
    var bar = wrap.querySelector('.bar > i');

    function paint() {
      var item = deck[i];
      var sec = App.SECTION_BY_ID[item.section];
      var tag = 'Section ' + item.section + ' · ' + (sec ? sec.title : '');
      var e = App.store.data.srs[item.id];
      var state = !e || e.reps === 0 ? 'Nouvelle' : (e.interval < 4 ? 'En cours' : (e.interval < 21 ? 'Consolidée' : 'Acquise'));

      wrap.querySelector('#fcTagF').textContent = tag;
      wrap.querySelector('#fcTagB').textContent = state + (e && e.reps ? ' · vue ' + e.reps + '×' : '');
      wrap.querySelector('#fcQ').innerHTML = U.rich(item.card.q);
      wrap.querySelector('#fcA').innerHTML = U.rich(item.card.a);
      wrap.querySelector('#fcCount').textContent = (i + 1) + ' / ' + deck.length;
      bar.style.width = U.pct(i, deck.length) + '%';

      flipped = false;
      fc.classList.remove('is-flipped');
      renderActions();
    }

    function renderActions() {
      if (!flipped) {
        actions.innerHTML = '<button class="btn btn--soft btn--block btn--lg" id="showBtn">Afficher la réponse</button>';
        actions.querySelector('#showBtn').onclick = flip;
      } else {
        actions.innerHTML = '<div class="fcgrade">' +
          '<button class="g0" data-g="0">Oublié<small>revoir maintenant</small></button>' +
          '<button class="g1" data-g="1">Difficile<small>bientôt</small></button>' +
          '<button class="g2" data-g="2">Correct<small>plus tard</small></button>' +
          '<button class="g3" data-g="3">Facile<small>beaucoup plus tard</small></button>' +
        '</div>';
        U.qsa('[data-g]', actions).forEach(function (b) {
          b.onclick = function () { grade(Number(b.getAttribute('data-g'))); };
        });
      }
    }

    function flip() {
      flipped = true;
      fc.classList.add('is-flipped');
      renderActions();
    }

    function grade(q) {
      var item = deck[i];
      App.srs.grade(item.id, q);
      App.store.save();
      session.seen++;
      if (q === 0) { session.again++; deck.push(item); } else { session.good++; }

      i++;
      if (i >= deck.length) return finish();
      paint();
    }

    function finish() {
      bar.style.width = '100%';
      var pct = session.seen ? U.pct(session.good, session.seen) : 0;
      wrap.querySelector('.fcstage').innerHTML =
        '<div class="card card--pad-lg" style="text-align:center">' +
          '<div style="font-size:44px;margin-bottom:12px">' + (pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪') + '</div>' +
          '<h2 class="h2" style="margin-bottom:8px">Session terminée</h2>' +
          '<p class="lead" style="margin:0 auto 20px">' +
            U.plural(session.seen, 'carte') + ' révisée' + (session.seen > 1 ? 's' : '') + ' · ' +
            session.good + ' réussie' + (session.good > 1 ? 's' : '') + ' · ' +
            session.again + ' à revoir' + '</p>' +
          '<div style="display:flex;justify-content:center;margin-bottom:22px">' + App.ui.ring(pct, 'réussite', 116) + '</div>' +
          '<div class="btnrow" style="justify-content:center">' +
            '<a class="btn btn--soft" href="#/">Tableau de bord</a>' +
            '<button class="btn btn--primary" id="againBtn">Refaire une session</button>' +
          '</div>' +
        '</div>';
      wrap.querySelector('#fcCount').textContent = 'Terminé';
      actions.innerHTML = '';
      wrap.querySelector('#againBtn').onclick = function () {
        var v = document.getElementById('view');
        v.innerHTML = '';
        v.appendChild(App.views.flashcards(mode));
      };
      App.refreshChrome();
    }

    fc.addEventListener('click', function () { if (!flipped) flip(); });

    function onKey(e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!flipped) flip();
      } else if (flipped && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        grade(Number(e.key) - 1);
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { document.removeEventListener('keydown', onKey); });

    paint();
    return wrap;
  };

  /* --------------------------- Construction du paquet --------------------------- */
  function buildDeck(mode) {
    var out = [];
    if (mode === 'due') return App.srs.dueCards();

    var sections = (mode === 'all')
      ? Object.keys(App.FLASHCARDS)
      : [String(Number(mode))];

    sections.forEach(function (sid) {
      (App.FLASHCARDS[sid] || []).forEach(function (card, idx) {
        out.push({ id: App.srs.cardId(sid, idx), card: card, section: Number(sid), index: idx });
      });
    });
    return out;
  }

  function notFound() {
    return App.ui.empty('🧭', 'Section introuvable', "Ce paquet de cartes n'existe pas.") +
      '<div style="text-align:center"><a class="btn btn--soft" href="#/parcours">Voir le parcours</a></div>';
  }

})(window.App = window.App || {});
