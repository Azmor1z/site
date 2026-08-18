/* ============================================================================
   VUES — Références : acronymes, ports, formules de risque, objectifs CompTIA
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  /* =============================== ACRONYMES =============================== */
  App.views.acronyms = function () {
    var wrap = U.el('div');

    wrap.innerHTML =
      App.ui.pagehead({
        eyebrow: 'Référence officielle',
        title: 'Acronymes SY0-701',
        lead: App.ACRONYMS.length + " acronymes issus de la liste officielle CompTIA. Filtrez par thème, cherchez, ou lancez le mode entraînement pour vous tester."
      }) +
      '<div class="btnrow" style="margin-bottom:16px">' +
        '<button class="btn btn--primary" id="trainBtn">🎯 Mode entraînement</button>' +
      '</div>' +
      '<input type="search" class="searchInput" id="acSearch" placeholder="Rechercher un acronyme ou sa signification…" ' +
        'style="background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:14px;padding:13px 17px;font-size:14.5px">' +
      '<div class="chips" id="acCats" style="margin-bottom:18px">' +
        '<button class="chip is-on" data-c="all">Tous</button>' +
        App.ACRONYM_CATS.map(function (c) {
          var n = App.ACRONYMS.filter(function (a) { return a.c === c; }).length;
          return '<button class="chip" data-c="' + U.esc(c) + '">' + U.esc(c) + ' (' + n + ')</button>';
        }).join('') +
      '</div>' +
      '<div id="acHost"></div>';

    var host = wrap.querySelector('#acHost');
    var search = wrap.querySelector('#acSearch');
    var cat = 'all';

    function render() {
      var q = U.norm(search.value);
      var list = App.ACRONYMS.filter(function (a) {
        if (cat !== 'all' && a.c !== cat) return false;
        if (!q) return true;
        return U.norm(a.a + ' ' + a.f + ' ' + (a.fr || '')).indexOf(q) !== -1;
      });

      if (!list.length) {
        host.innerHTML = App.ui.empty('🔍', 'Aucun acronyme trouvé', 'Essayez un autre terme ou une autre catégorie.');
        return;
      }

      host.innerHTML = '<p class="muted" style="margin-bottom:10px">' + U.plural(list.length, 'acronyme') + '</p>' +
        '<div class="tablewrap"><table class="tbl"><thead><tr>' +
          '<th style="width:110px">Acronyme</th><th>Signification (anglais)</th><th>Repère</th>' +
        '</tr></thead><tbody>' +
        list.map(function (a) {
          return '<tr>' +
            '<td class="tbl__code">' + U.esc(a.a) + '</td>' +
            '<td><strong>' + U.esc(a.f) + '</strong></td>' +
            '<td class="muted">' + U.esc(a.fr || '') + '</td>' +
          '</tr>';
        }).join('') + '</tbody></table></div>';
    }

    search.addEventListener('input', U.debounce(render, 120));
    wrap.querySelector('#acCats').addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]');
      if (!b) return;
      U.qsa('.chip', wrap).forEach(function (c) { c.classList.remove('is-on'); });
      b.classList.add('is-on');
      cat = b.getAttribute('data-c');
      render();
    });
    wrap.querySelector('#trainBtn').onclick = function () {
      var v = document.getElementById('view');
      v.innerHTML = '';
      v.appendChild(acronymTrainer(cat));
    };

    render();
    return wrap;
  };

  /* --------------------- Entraînement aux acronymes --------------------- */
  function acronymTrainer(cat) {
    var pool = App.ACRONYMS.filter(function (a) { return cat === 'all' || a.c === cat; });
    var items = U.sample(pool, Math.min(20, pool.length));
    var i = 0, correct = 0, answered = false;

    var wrap = U.el('div');
    wrap.innerHTML =
      App.ui.pagehead({ eyebrow: 'Entraînement', title: 'Que signifie cet acronyme ?', lead: 'Choisissez la bonne signification parmi quatre propositions.' }) +
      '<div class="qhead"><div class="qprog">' + App.ui.bar(0) + '</div><div class="qcount" id="aCount"></div></div>' +
      '<div id="aHost"></div>';

    var host = wrap.querySelector('#aHost');
    var bar = wrap.querySelector('.bar > i');

    function paint() {
      answered = false;
      var a = items[i];
      // Trois leurres pris dans la même catégorie quand c'est possible
      var sameCat = App.ACRONYMS.filter(function (x) { return x.c === a.c && x.a !== a.a; });
      var pool2 = sameCat.length >= 3 ? sameCat : App.ACRONYMS.filter(function (x) { return x.a !== a.a; });
      var opts = U.shuffle(U.sample(pool2, 3).map(function (x) { return { text: x.f, ok: false }; })
        .concat([{ text: a.f, ok: true }]));

      wrap.querySelector('#aCount').textContent = (i + 1) + ' / ' + items.length;
      bar.style.width = U.pct(i, items.length) + '%';

      host.innerHTML = '<div class="qcard">' +
        '<div style="text-align:center;margin-bottom:22px">' +
          '<div class="mono" style="font-size:clamp(32px,7vw,52px);font-weight:800;color:var(--accent);letter-spacing:-.02em">' + U.esc(a.a) + '</div>' +
          '<div class="muted" style="margin-top:6px">Catégorie : ' + U.esc(a.c) + '</div>' +
        '</div>' +
        '<div class="qopts">' + opts.map(function (o, idx) {
          return '<button class="qopt" data-ok="' + (o.ok ? '1' : '0') + '">' +
            '<span class="qopt__k">' + 'ABCD'[idx] + '</span><span>' + U.esc(o.text) + '</span></button>';
        }).join('') + '</div><div id="aFeed"></div></div>';

      U.qsa('.qopt', host).forEach(function (b) {
        b.onclick = function () {
          if (answered) return;
          answered = true;
          var ok = b.getAttribute('data-ok') === '1';
          if (ok) correct++;
          U.qsa('.qopt', host).forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute('data-ok') === '1') x.classList.add('is-correct');
            else if (x === b) x.classList.add('is-wrong');
          });
          wrap.querySelector('#aFeed').innerHTML =
            '<div class="qfeed ' + (ok ? 'qfeed--ok' : 'qfeed--err') + '">' +
              '<div class="qfeed__t">' + (ok ? '✓ Correct' : '✕ Incorrect') + '</div>' +
              '<div class="qfeed__b"><strong>' + U.esc(a.a) + '</strong> — ' + U.esc(a.f) +
              (a.fr ? '<br><span class="muted">' + U.esc(a.fr) + '</span>' : '') + '</div></div>' +
            '<div class="btnrow" style="margin-top:16px;justify-content:flex-end">' +
              '<button class="btn btn--primary" id="nextBtn">' + (i + 1 >= items.length ? 'Voir le résultat' : 'Suivant →') + '</button></div>';
          var nb = wrap.querySelector('#nextBtn');
          nb.focus();
          nb.onclick = function () { i++; if (i >= items.length) return finish(); paint(); };
        };
      });
    }

    function finish() {
      bar.style.width = '100%';
      wrap.querySelector('#aCount').textContent = 'Terminé';
      var pct = U.pct(correct, items.length);
      host.innerHTML = '<div class="card card--pad-lg" style="text-align:center">' +
        '<div style="font-size:44px;margin-bottom:10px">' + (pct >= 80 ? '🎉' : '💪') + '</div>' +
        '<h2 class="h2" style="margin-bottom:8px">Série terminée</h2>' +
        '<p class="lead" style="margin:0 auto 20px">' + correct + ' bonnes réponses sur ' + items.length + '</p>' +
        '<div style="display:flex;justify-content:center;margin-bottom:22px">' + App.ui.ring(pct, 'réussite', 120) + '</div>' +
        '<div class="btnrow" style="justify-content:center">' +
          '<a class="btn btn--soft" href="#/acronymes">Retour à la liste</a>' +
          '<button class="btn btn--primary" id="againBtn">Nouvelle série</button></div></div>';
      wrap.querySelector('#againBtn').onclick = function () {
        var v = document.getElementById('view');
        v.innerHTML = '';
        v.appendChild(acronymTrainer(cat));
      };
    }

    function onKey(e) {
      if (e.key >= '1' && e.key <= '4') {
        var btns = U.qsa('.qopt', host);
        if (btns[Number(e.key) - 1]) { e.preventDefault(); btns[Number(e.key) - 1].click(); }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        var nb = wrap.querySelector('#nextBtn');
        if (nb) { e.preventDefault(); nb.click(); }
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { document.removeEventListener('keydown', onKey); });

    paint();
    return wrap;
  }

  /* ================================= PORTS ================================= */
  App.views.ports = function () {
    var wrap = U.el('div');

    wrap.innerHTML =
      App.ui.pagehead({
        eyebrow: 'Référence',
        title: 'Ports & protocoles',
        lead: "Les ports tombent systématiquement à l'examen. Retenez surtout les paires clair/chiffré : c'est là que se jouent la plupart des questions."
      }) +
      '<div class="btnrow" style="margin-bottom:16px">' +
        '<button class="btn btn--primary" id="trainBtn">🎯 Mode entraînement</button>' +
      '</div>' +
      '<div class="card" style="margin-bottom:20px">' +
        '<div class="h3" style="margin-bottom:11px">Repères de mémorisation</div>' +
        '<div class="klist">' + App.PORT_TIPS.map(function (t) {
          return '<div class="kitem"><span class="kitem__b"></span><span>' + U.rich(t) + '</span></div>';
        }).join('') + '</div>' +
      '</div>' +
      '<input type="search" class="searchInput" id="pSearch" placeholder="Rechercher un port ou un protocole…" ' +
        'style="background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;padding:13px 17px;font-size:14.5px">' +
      '<div id="pHost"></div>';

    var host = wrap.querySelector('#pHost');
    var search = wrap.querySelector('#pSearch');

    function render() {
      var q = U.norm(search.value);
      var list = App.PORTS.filter(function (p) {
        if (!q) return true;
        return U.norm(p.port + ' ' + p.name + ' ' + p.desc + ' ' + p.proto).indexOf(q) !== -1;
      });

      if (!list.length) {
        host.innerHTML = App.ui.empty('🔍', 'Aucun résultat', 'Essayez un autre terme.');
        return;
      }

      host.innerHTML = '<div class="tablewrap"><table class="tbl"><thead><tr>' +
        '<th style="width:92px">Port</th><th style="width:80px">Proto</th><th>Service</th><th>Description</th>' +
        '</tr></thead><tbody>' +
        list.map(function (p) {
          return '<tr>' +
            '<td class="tbl__code">' + U.esc(p.port) + '</td>' +
            '<td class="muted">' + U.esc(p.proto) + '</td>' +
            '<td><strong>' + U.esc(p.name) + '</strong> ' +
              (p.secure ? '<span class="badge badge--ok" style="margin-left:5px">chiffré</span>'
                        : '<span class="badge badge--warn" style="margin-left:5px">en clair</span>') + '</td>' +
            '<td class="muted">' + U.esc(p.desc) +
              (p.alt ? '<br><span style="color:var(--accent)">→ préférer : ' + U.esc(p.alt) + '</span>' : '') + '</td>' +
          '</tr>';
        }).join('') + '</tbody></table></div>';
    }

    search.addEventListener('input', U.debounce(render, 120));
    wrap.querySelector('#trainBtn').onclick = function () {
      var v = document.getElementById('view');
      v.innerHTML = '';
      v.appendChild(portTrainer());
    };

    render();
    return wrap;
  };

  /* ----------------------- Entraînement aux ports ----------------------- */
  function portTrainer() {
    var items = U.sample(App.PORTS, Math.min(20, App.PORTS.length));
    var i = 0, correct = 0, answered = false;
    var wrap = U.el('div');

    wrap.innerHTML =
      App.ui.pagehead({ eyebrow: 'Entraînement', title: 'Quel port pour ce service ?', lead: 'Associez chaque service à son port standard.' }) +
      '<div class="qhead"><div class="qprog">' + App.ui.bar(0) + '</div><div class="qcount" id="pCount"></div></div>' +
      '<div id="ptHost"></div>';

    var host = wrap.querySelector('#ptHost');
    var bar = wrap.querySelector('.bar > i');

    function paint() {
      answered = false;
      var p = items[i];
      var others = U.sample(App.PORTS.filter(function (x) { return x.port !== p.port; }), 3);
      var opts = U.shuffle(others.map(function (x) { return { text: x.port, ok: false }; })
        .concat([{ text: p.port, ok: true }]));

      wrap.querySelector('#pCount').textContent = (i + 1) + ' / ' + items.length;
      bar.style.width = U.pct(i, items.length) + '%';

      host.innerHTML = '<div class="qcard">' +
        '<div style="text-align:center;margin-bottom:22px">' +
          '<div style="font-size:clamp(24px,5vw,36px);font-weight:800;letter-spacing:-.02em">' + U.esc(p.name) + '</div>' +
          '<div class="muted" style="margin-top:6px">' + U.esc(p.proto) + '</div>' +
        '</div>' +
        '<div class="qopts">' + opts.map(function (o, idx) {
          return '<button class="qopt" data-ok="' + (o.ok ? '1' : '0') + '" style="justify-content:center">' +
            '<span class="qopt__k">' + 'ABCD'[idx] + '</span>' +
            '<span class="mono" style="font-size:17px;font-weight:700">' + U.esc(o.text) + '</span></button>';
        }).join('') + '</div><div id="ptFeed"></div></div>';

      U.qsa('.qopt', host).forEach(function (b) {
        b.onclick = function () {
          if (answered) return;
          answered = true;
          var ok = b.getAttribute('data-ok') === '1';
          if (ok) correct++;
          U.qsa('.qopt', host).forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute('data-ok') === '1') x.classList.add('is-correct');
            else if (x === b) x.classList.add('is-wrong');
          });
          wrap.querySelector('#ptFeed').innerHTML =
            '<div class="qfeed ' + (ok ? 'qfeed--ok' : 'qfeed--err') + '">' +
              '<div class="qfeed__t">' + (ok ? '✓ Correct' : '✕ Incorrect') + '</div>' +
              '<div class="qfeed__b"><strong>' + U.esc(p.name) + ' → port ' + U.esc(p.port) + ' (' + U.esc(p.proto) + ')</strong><br>' +
              U.esc(p.desc) + (p.alt ? '<br><span style="color:var(--accent)">Alternative sécurisée : ' + U.esc(p.alt) + '</span>' : '') +
              '</div></div>' +
            '<div class="btnrow" style="margin-top:16px;justify-content:flex-end">' +
              '<button class="btn btn--primary" id="nextBtn">' + (i + 1 >= items.length ? 'Voir le résultat' : 'Suivant →') + '</button></div>';
          var nb = wrap.querySelector('#nextBtn');
          nb.focus();
          nb.onclick = function () { i++; if (i >= items.length) return finish(); paint(); };
        };
      });
    }

    function finish() {
      bar.style.width = '100%';
      wrap.querySelector('#pCount').textContent = 'Terminé';
      var pct = U.pct(correct, items.length);
      host.innerHTML = '<div class="card card--pad-lg" style="text-align:center">' +
        '<div style="font-size:44px;margin-bottom:10px">' + (pct >= 80 ? '🎉' : '💪') + '</div>' +
        '<h2 class="h2" style="margin-bottom:8px">Série terminée</h2>' +
        '<p class="lead" style="margin:0 auto 20px">' + correct + ' bonnes réponses sur ' + items.length + '</p>' +
        '<div style="display:flex;justify-content:center;margin-bottom:22px">' + App.ui.ring(pct, 'réussite', 120) + '</div>' +
        '<div class="btnrow" style="justify-content:center">' +
          '<a class="btn btn--soft" href="#/ports">Retour au tableau</a>' +
          '<button class="btn btn--primary" id="againBtn">Nouvelle série</button></div></div>';
      wrap.querySelector('#againBtn').onclick = function () {
        var v = document.getElementById('view');
        v.innerHTML = '';
        v.appendChild(portTrainer());
      };
    }

    function onKey(e) {
      if (e.key >= '1' && e.key <= '4') {
        var btns = U.qsa('.qopt', host);
        if (btns[Number(e.key) - 1]) { e.preventDefault(); btns[Number(e.key) - 1].click(); }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        var nb = wrap.querySelector('#nextBtn');
        if (nb) { e.preventDefault(); nb.click(); }
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { document.removeEventListener('keydown', onKey); });

    paint();
    return wrap;
  }

  /* ========================== FORMULES DE RISQUE ========================== */
  App.views.formulas = function () {
    var wrap = U.el('div');

    wrap.innerHTML =
      App.ui.pagehead({
        eyebrow: 'Entraînement au calcul',
        title: 'Formules de risque',
        lead: "Les calculs SLE / ARO / ALE tombent presque à chaque examen. Cet exercice génère un énoncé différent à chaque tirage : entraînez-vous jusqu'à ce que ce soit automatique."
      }) +
      '<div class="card" style="margin-bottom:20px">' +
        '<div class="h3" style="margin-bottom:12px">Les formules à connaître par cœur</div>' +
        '<div class="grid grid--3">' +
          formulaCard('SLE', 'AV × EF', 'Single Loss Expectancy : la perte pour UN seul incident. AV = valeur de l\'actif, EF = pourcentage détruit.') +
          formulaCard('ARO', '1 / nb d\'années', 'Annualized Rate of Occurrence : combien de fois par an l\'événement survient.') +
          formulaCard('ALE', 'SLE × ARO', 'Annualized Loss Expectancy : la perte attendue par an. C\'est elle qui justifie un budget.') +
        '</div>' +
        '<div class="callout callout--tip" style="margin-top:16px">' +
          '<strong>Règle de décision :</strong> une contre-mesure est rentable si son <strong>coût annuel est inférieur à la réduction d\'ALE</strong> qu\'elle procure. ' +
          'Si elle coûte plus cher que la perte annuelle attendue, on ne l\'achète pas.' +
        '</div>' +
      '</div>' +
      '<div id="fHost"></div>';

    var host = wrap.querySelector('#fHost');

    function newProblem() {
      var p = App.riskProblem();
      var done = false;

      host.innerHTML = '<div class="drill">' +
        '<div class="drill__t">Énoncé</div>' +
        '<p class="lead" style="margin-bottom:20px">' + U.rich(p.text) + '</p>' +
        '<div class="grid grid--3" style="gap:14px">' +
          p.questions.map(function (q, idx) {
            return '<div>' +
              '<label style="display:block;font-size:13px;font-weight:650;margin-bottom:6px">' + U.esc(q.label) + '</label>' +
              '<input type="text" inputmode="decimal" class="fillgap" data-q="' + idx + '" ' +
                'style="width:100%;min-width:0;text-align:left;padding:11px 13px" placeholder="' + U.esc(q.hint) + '">' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="btnrow" style="margin-top:18px">' +
          '<button class="btn btn--primary" id="checkBtn">Vérifier</button>' +
          '<button class="btn btn--soft" id="newBtn">Nouvel énoncé</button>' +
        '</div>' +
        '<div id="fFeed" style="margin-top:16px"></div>' +
      '</div>';

      var inputs = U.qsa('[data-q]', host);
      inputs.forEach(function (inp) {
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); host.querySelector('#checkBtn').click(); }
        });
      });

      host.querySelector('#newBtn').onclick = newProblem;

      host.querySelector('#checkBtn').onclick = function () {
        if (done) return;
        done = true;
        var right = 0;

        inputs.forEach(function (inp, idx) {
          var q = p.questions[idx];
          // Tolérance : on accepte les espaces, virgules décimales et le symbole €
          var raw = inp.value.replace(/[€\s ]/g, '').replace(',', '.');
          var val = parseFloat(raw);
          var expected = q.answer;
          // Marge de 1 % pour absorber les arrondis de l'utilisateur
          var ok = !isNaN(val) && Math.abs(val - expected) <= Math.max(Math.abs(expected) * 0.01, 0.0005);
          inp.classList.add(ok ? 'is-ok' : 'is-ko');
          inp.disabled = true;
          if (ok) right++;
        });

        host.querySelector('#checkBtn').disabled = true;

        var fmt = function (n) { return n.toLocaleString('fr-FR', { maximumFractionDigits: 2 }); };
        host.querySelector('#fFeed').innerHTML =
          '<div class="qfeed ' + (right === 3 ? 'qfeed--ok' : 'qfeed--err') + '">' +
            '<div class="qfeed__t">' + (right === 3 ? '✓ Les trois calculs sont exacts' : right + ' / 3 correct' + (right > 1 ? 's' : '')) + '</div>' +
            '<div class="qfeed__b">' +
              '<strong>SLE</strong> = AV × EF = ' + fmt(p.av) + ' × ' + p.ef + ' = <strong>' + fmt(p.sle) + ' €</strong><br>' +
              '<strong>ARO</strong> = 1 / ' + p.years + ' = <strong>' + p.aro.toFixed(4) + '</strong><br>' +
              '<strong>ALE</strong> = SLE × ARO = ' + fmt(p.sle) + ' × ' + p.aro.toFixed(4) + ' = <strong>' + fmt(p.ale) + ' €/an</strong><br><br>' +
              '<span class="muted">Une contre-mesure coûtant moins de ' + fmt(p.ale) + ' € par an serait économiquement justifiée.</span>' +
            '</div>' +
          '</div>';
      };
    }

    newProblem();
    return wrap;
  };

  function formulaCard(name, formula, desc) {
    return '<div style="padding:16px;border-radius:13px;background:var(--surface-2);border:1px solid var(--border)">' +
      '<div class="mono" style="font-size:19px;font-weight:800;color:var(--accent);margin-bottom:4px">' + U.esc(name) + '</div>' +
      '<div class="mono" style="font-size:14px;font-weight:700;margin-bottom:8px">' + U.esc(formula) + '</div>' +
      '<p class="muted" style="line-height:1.55">' + U.esc(desc) + '</p></div>';
  }

  /* ============================ OBJECTIFS COMPTIA ============================ */
  App.views.objectives = function () {
    var S = App.store;
    var html = App.ui.pagehead({
      eyebrow: 'Référentiel officiel',
      title: 'Objectifs d\'examen SY0-701',
      lead: "Les 28 objectifs officiels CompTIA, avec les sections du cours qui les couvrent et votre niveau de maîtrise sur chacun."
    });

    App.DOMAINS.forEach(function (d) {
      var objs = Object.keys(App.OBJECTIVES).filter(function (o) { return o.charAt(0) === d.id.charAt(0); });
      var secs = App.SECTIONS.filter(function (s) { return s.domain === d.id; });
      var avg = secs.length ? Math.round(secs.reduce(function (a, s) { return a + S.sectionProgress(s.id); }, 0) / secs.length) : 0;

      html += '<div class="card" style="margin-bottom:16px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">' +
          '<div><div class="h3" style="color:' + d.color + '">' + d.id + ' · ' + U.esc(d.name) + '</div>' +
          '<p class="muted">' + U.esc(d.fr) + ' — ' + d.weight + ' % de l\'examen</p></div>' +
          '<div style="font-size:21px;font-weight:800;color:' + (avg >= 75 ? 'var(--green)' : avg >= 50 ? 'var(--amber)' : 'var(--text-3)') + '">' + avg + ' %</div>' +
        '</div>' +
        '<div style="display:grid;gap:9px">' +
        objs.map(function (o) {
          var rel = App.SECTIONS.filter(function (s) { return s.objs.indexOf(o) !== -1; });
          return '<div style="padding:12px 14px;border-radius:11px;background:var(--surface-2);border:1px solid var(--border)">' +
            '<div style="display:flex;gap:10px;align-items:baseline;margin-bottom:5px">' +
              '<span class="mono" style="color:' + d.color + ';font-weight:700;flex:none">' + o + '</span>' +
              '<span style="font-size:13.5px;font-weight:600">' + U.esc(App.OBJECTIVES[o]) + '</span></div>' +
            (rel.length
              ? '<div class="chips" style="margin-top:8px">' + rel.map(function (s) {
                  var p = S.sectionProgress(s.id);
                  return '<a class="badge' + (p >= 80 ? ' badge--ok' : '') + '" href="#/section/' + s.id + '">' +
                    s.icon + ' Section ' + s.id + ' · ' + p + ' %</a>';
                }).join('') + '</div>'
              : '<p class="muted" style="margin-top:5px">Transversal à plusieurs sections</p>') +
          '</div>';
        }).join('') +
        '</div></div>';
    });

    return html;
  };

})(window.App = window.App || {});
