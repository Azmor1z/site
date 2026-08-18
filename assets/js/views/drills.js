/* ============================================================================
   VUE — Exercices interactifs (match / sort / order / fill)
   Chaque exercice fonctionne au clic ET au glisser-déposer, pour rester
   utilisable au tactile comme à la souris.
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  App.views.drills = function (mode) {
    var list = [], title, lead;

    if (mode === 'all') {
      Object.keys(App.DRILLS).forEach(function (sid) {
        (App.DRILLS[sid] || []).forEach(function (d) { list.push({ d: d, section: Number(sid) }); });
      });
      list = U.shuffle(list).slice(0, 12);
      title = 'Exercices variés';
      lead = "12 exercices tirés au hasard dans tout le programme : association, tri par catégories, ordonnancement et textes à trous.";
    } else {
      var sec = App.SECTION_BY_ID[Number(mode)];
      if (!sec) {
        return App.ui.empty('🧭', 'Section introuvable', "Ces exercices n'existent pas.") +
          '<div style="text-align:center"><a class="btn btn--soft" href="#/parcours">Voir le parcours</a></div>';
      }
      list = (App.DRILLS[mode] || []).map(function (d) { return { d: d, section: Number(mode) }; });
      title = 'Exercices — ' + sec.title;
      lead = 'Section ' + sec.id + ' · ' + list.length + ' exercices pour ancrer la mémorisation par la manipulation.';
    }

    if (!list.length) {
      return App.ui.pagehead({ eyebrow: 'Exercices', title: title }) +
        App.ui.empty('📭', 'Aucun exercice disponible ici', '') +
        '<div style="text-align:center"><a class="btn btn--soft" href="#/">Tableau de bord</a></div>';
    }

    var wrap = U.el('div');
    var i = 0, doneCount = 0;

    wrap.innerHTML =
      App.ui.pagehead({ eyebrow: 'Exercices', title: title, lead: lead }) +
      '<div class="qhead">' +
        '<div class="qprog">' + App.ui.bar(0) + '</div>' +
        '<div class="qcount" id="dCount"></div>' +
      '</div>' +
      '<div id="dHost"></div>';

    var host = wrap.querySelector('#dHost');
    var bar = wrap.querySelector('.bar > i');

    function paint() {
      var cur = list[i];
      wrap.querySelector('#dCount').textContent = (i + 1) + ' / ' + list.length;
      bar.style.width = U.pct(i, list.length) + '%';
      host.innerHTML = '';
      host.appendChild(buildDrill(cur.d, cur.section, onDone));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function onDone(success, sectionId, drillId) {
      if (success) {
        doneCount++;
        App.store.markDrill(sectionId, drillId);
        App.refreshChrome();
      }
      var nav = U.el('div', { class: 'btnrow', style: 'margin-top:18px;justify-content:flex-end' });
      var btn = U.el('button', { class: 'btn btn--primary', text: (i + 1 >= list.length ? 'Voir le bilan' : 'Exercice suivant →') });
      btn.onclick = function () {
        i++;
        if (i >= list.length) return finish();
        paint();
      };
      nav.appendChild(btn);
      host.querySelector('.drill').appendChild(nav);
      btn.focus();
    }

    function finish() {
      bar.style.width = '100%';
      wrap.querySelector('#dCount').textContent = 'Terminé';
      var pct = U.pct(doneCount, list.length);
      host.innerHTML = '<div class="card card--pad-lg" style="text-align:center">' +
        '<div style="font-size:44px;margin-bottom:10px">' + (pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪') + '</div>' +
        '<h2 class="h2" style="margin-bottom:8px">Série terminée</h2>' +
        '<p class="lead" style="margin:0 auto 20px">' + doneCount + ' exercice' + (doneCount > 1 ? 's' : '') +
          ' réussi' + (doneCount > 1 ? 's' : '') + ' du premier coup sur ' + list.length + '</p>' +
        '<div style="display:flex;justify-content:center;margin-bottom:22px">' + App.ui.ring(pct, 'réussite', 120) + '</div>' +
        '<div class="btnrow" style="justify-content:center">' +
          '<a class="btn btn--soft" href="#/">Tableau de bord</a>' +
          '<button class="btn btn--primary" id="againBtn">Recommencer</button>' +
        '</div></div>';
      wrap.querySelector('#againBtn').onclick = function () {
        var v = document.getElementById('view');
        v.innerHTML = '';
        var out = App.views.drills(mode);
        if (typeof out === 'string') v.innerHTML = out; else v.appendChild(out);
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    paint();
    return wrap;
  };

  /* ====================================================================== */
  /*  Construction d'un exercice selon son type                              */
  /* ====================================================================== */
  function buildDrill(d, sectionId, onDone) {
    var box = U.el('div', { class: 'drill' });
    var sec = App.SECTION_BY_ID[sectionId];

    box.innerHTML =
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span class="badge">' + typeLabel(d.type) + '</span>' +
        '<span class="badge badge--accent">Section ' + sectionId + (sec ? ' · ' + U.esc(sec.title) : '') + '</span>' +
      '</div>' +
      '<div class="drill__t">' + U.esc(d.title) + '</div>' +
      '<div class="drill__d">' + U.esc(d.desc || '') + '</div>' +
      '<div id="drillBody"></div>';

    var body = box.querySelector('#drillBody');
    var builder = { match: buildMatch, sort: buildSort, order: buildOrder, fill: buildFill }[d.type];

    if (!builder) {
      body.innerHTML = '<p class="muted">Type d\'exercice non reconnu.</p>';
      setTimeout(function () { onDone(false, sectionId, d.id); }, 0);
      return box;
    }

    builder(body, d, function (success) { onDone(success, sectionId, d.id); });
    return box;
  }

  function typeLabel(t) {
    return { match: '🔗 Association', sort: '🗂️ Tri par catégories', order: '🔢 Mise en ordre', fill: '✍️ Texte à trous' }[t] || 'Exercice';
  }

  /* ---------------------------------------------------------------------- */
  /*  1. ASSOCIATION — cliquer un élément à gauche puis son correspondant    */
  /* ---------------------------------------------------------------------- */
  function buildMatch(host, d, done) {
    var lefts = d.pairs.map(function (p, i) { return { text: p[0], key: i }; });
    var rights = U.shuffle(d.pairs.map(function (p, i) { return { text: p[1], key: i }; }));
    var solved = {}, sel = null, mistakes = 0;

    host.innerHTML = '<div class="matchwrap">' +
      '<div class="matchcol"><div class="matchcol__h">Terme</div>' +
        lefts.map(function (l) { return '<button class="mitem" data-side="l" data-key="' + l.key + '">' + U.rich(l.text) + '</button>'; }).join('') +
      '</div>' +
      '<div class="matchcol"><div class="matchcol__h">Définition</div>' +
        rights.map(function (r) { return '<button class="mitem" data-side="r" data-key="' + r.key + '">' + U.rich(r.text) + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="btnrow" style="margin-top:16px">' +
        '<button class="btn btn--soft btn--sm" id="giveUpBtn">Afficher les réponses</button>' +
      '</div>' +
      '<p class="muted" style="margin-top:12px" id="mHint">Cliquez un terme, puis sa définition correspondante.</p>';

    var hint = host.querySelector('#mHint');
    var finished = false;

    // Sans échappatoire, un utilisateur bloqué ne pourrait jamais passer à la suite.
    host.querySelector('#giveUpBtn').onclick = function () {
      if (finished) return;
      U.qsa('.mitem', host).forEach(function (el) {
        if (el.disabled) return;
        var k = el.getAttribute('data-key');
        el.disabled = true;
        el.classList.remove('is-sel');
        el.classList.add('is-ko');
        if (el.getAttribute('data-side') === 'l') {
          el.innerHTML = U.rich(d.pairs[k][0]) + ' <span class="muted">→ ' + U.esc(d.pairs[k][1]) + '</span>';
        }
      });
      sel = null;
      finishMatch(true);
    };

    U.qsa('.mitem', host).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        var side = b.getAttribute('data-side');
        var key = b.getAttribute('data-key');

        if (!sel) {
          U.qsa('.mitem.is-sel', host).forEach(function (x) { x.classList.remove('is-sel'); });
          b.classList.add('is-sel');
          sel = { el: b, side: side, key: key };
          return;
        }

        // Re-cliquer le même élément annule la sélection
        if (sel.el === b) { b.classList.remove('is-sel'); sel = null; return; }

        // Cliquer un élément du même côté déplace la sélection
        if (sel.side === side) {
          sel.el.classList.remove('is-sel');
          b.classList.add('is-sel');
          sel = { el: b, side: side, key: key };
          return;
        }

        if (sel.key === key) {
          sel.el.classList.remove('is-sel');
          sel.el.classList.add('is-ok'); b.classList.add('is-ok');
          sel.el.disabled = true; b.disabled = true;
          solved[key] = true;
          sel = null;
          hint.textContent = Object.keys(solved).length + ' / ' + d.pairs.length + ' associations trouvées.';
          if (Object.keys(solved).length === d.pairs.length) {
            finishMatch();
          }
        } else {
          mistakes++;
          var a = sel.el;
          a.classList.remove('is-sel');
          a.classList.add('is-ko'); b.classList.add('is-ko');
          sel = null;
          hint.textContent = 'Ce n\'est pas la bonne correspondance. Réessayez.';
          setTimeout(function () { a.classList.remove('is-ko'); b.classList.remove('is-ko'); }, 500);
        }
      });
    });

    function finishMatch(gaveUp) {
      if (finished) return;
      finished = true;
      host.querySelector('#giveUpBtn').disabled = true;
      var ok = !gaveUp && mistakes === 0;
      hint.innerHTML = ok
        ? '<span style="color:var(--green);font-weight:650">✓ Sans faute. Toutes les associations sont correctes.</span>'
        : gaveUp
          ? '<span style="color:var(--amber);font-weight:650">Réponses affichées. Relisez chaque correspondance avant de continuer.</span>'
          : '<span style="color:var(--amber);font-weight:650">Terminé avec ' + U.plural(mistakes, 'erreur') + '. Relisez les paires ci-dessus.</span>';
      done(ok);
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  2. TRI PAR CATÉGORIES — glisser-déposer + sélection au clic            */
  /* ---------------------------------------------------------------------- */
  function buildSort(host, d, done) {
    var binNames = Object.keys(d.bins);
    var tokens = [];
    binNames.forEach(function (b) {
      d.bins[b].forEach(function (t) { tokens.push({ text: t, bin: b }); });
    });
    tokens = U.shuffle(tokens);

    host.innerHTML =
      '<div class="sortpool" id="pool"></div>' +
      '<div class="sortbins">' +
        binNames.map(function (b, i) {
          return '<div class="sortbin" data-bin="' + i + '">' +
            '<div class="sortbin__h">📁 ' + U.esc(b) + '</div>' +
            '<div class="sortbin__items"></div></div>';
        }).join('') +
      '</div>' +
      '<div class="btnrow" style="margin-top:16px">' +
        '<button class="btn btn--primary" id="checkBtn" disabled>Vérifier</button>' +
        '<button class="btn btn--soft" id="resetBtn">Réinitialiser</button>' +
      '</div>' +
      '<p class="muted" style="margin-top:12px" id="sHint">Glissez chaque étiquette dans la bonne catégorie, ou cliquez une étiquette puis sa catégorie.</p>';

    var pool = host.querySelector('#pool');
    var checkBtn = host.querySelector('#checkBtn');
    var hint = host.querySelector('#sHint');
    var selected = null;
    var checked = false;

    function makeToken(t, idx) {
      var el = U.el('div', { class: 'stoken', draggable: 'true', 'data-i': idx, text: t.text });

      el.addEventListener('dragstart', function (e) {
        if (checked) return;
        e.dataTransfer.setData('text/plain', String(idx));
        e.dataTransfer.effectAllowed = 'move';
        el.classList.add('is-drag');
      });
      el.addEventListener('dragend', function () { el.classList.remove('is-drag'); });

      el.addEventListener('click', function (ev) {
        if (checked) return;
        // Si une AUTRE étiquette est déjà sélectionnée, ce clic vise le conteneur :
        // on laisse l'événement remonter au bac pour qu'il effectue le dépôt.
        if (selected && selected !== el) return;
        ev.stopPropagation();
        if (selected === el) { el.classList.remove('is-sel'); selected = null; return; }
        el.classList.add('is-sel');
        selected = el;
        hint.textContent = 'Cliquez maintenant la catégorie de destination.';
      });

      return el;
    }

    tokens.forEach(function (t, idx) { pool.appendChild(makeToken(t, idx)); });

    function place(el, container) {
      container.appendChild(el);
      el.classList.remove('is-sel');
      selected = null;
      updateBtn();
    }

    function updateBtn() {
      checkBtn.disabled = pool.children.length > 0;
      if (!checked) {
        hint.textContent = pool.children.length > 0
          ? U.plural(pool.children.length, 'étiquette') + ' encore à classer.'
          : 'Toutes les étiquettes sont classées. Vérifiez votre réponse.';
      }
    }

    U.qsa('.sortbin', host).forEach(function (bin) {
      var items = bin.querySelector('.sortbin__items');

      bin.addEventListener('dragover', function (e) {
        if (checked) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        bin.classList.add('is-over');
      });
      bin.addEventListener('dragleave', function () { bin.classList.remove('is-over'); });
      bin.addEventListener('drop', function (e) {
        if (checked) return;
        e.preventDefault();
        bin.classList.remove('is-over');
        var idx = e.dataTransfer.getData('text/plain');
        var el = host.querySelector('.stoken[data-i="' + idx + '"]');
        if (el) place(el, items);
      });
      bin.addEventListener('click', function () {
        if (checked || !selected) return;
        place(selected, items);
      });
    });

    // Le pool accepte aussi le retour d'une étiquette
    pool.addEventListener('dragover', function (e) { if (!checked) { e.preventDefault(); pool.classList.add('is-over'); } });
    pool.addEventListener('dragleave', function () { pool.classList.remove('is-over'); });
    pool.addEventListener('drop', function (e) {
      if (checked) return;
      e.preventDefault();
      pool.classList.remove('is-over');
      var idx = e.dataTransfer.getData('text/plain');
      var el = host.querySelector('.stoken[data-i="' + idx + '"]');
      if (el) place(el, pool);
    });
    // Cliquer le pool renvoie l'étiquette sélectionnée à sa place initiale.
    pool.addEventListener('click', function () {
      if (checked || !selected) return;
      place(selected, pool);
    });

    host.querySelector('#resetBtn').onclick = function () {
      if (checked) return;
      U.qsa('.stoken', host).forEach(function (el) {
        el.classList.remove('is-ok', 'is-ko', 'is-sel');
        pool.appendChild(el);
      });
      selected = null;
      updateBtn();
    };

    checkBtn.onclick = function () {
      if (checked) return;
      checked = true;
      var right = 0, total = tokens.length;

      U.qsa('.sortbin', host).forEach(function (bin, bIdx) {
        var name = binNames[bIdx];
        U.qsa('.stoken', bin).forEach(function (el) {
          var t = tokens[Number(el.getAttribute('data-i'))];
          if (t.bin === name) { el.classList.add('is-ok'); right++; }
          else {
            el.classList.add('is-ko');
            el.title = 'Catégorie attendue : ' + t.bin;
            el.textContent = t.text + ' → ' + t.bin;
          }
        });
      });

      U.qsa('.stoken', host).forEach(function (el) { el.setAttribute('draggable', 'false'); });
      checkBtn.disabled = true;
      host.querySelector('#resetBtn').disabled = true;

      var ok = right === total;
      hint.innerHTML = ok
        ? '<span style="color:var(--green);font-weight:650">✓ Classement parfait : ' + right + ' / ' + total + '.</span>'
        : '<span style="color:var(--amber);font-weight:650">' + right + ' / ' + total + ' correctement classées. La catégorie attendue est indiquée après la flèche.</span>';
      done(ok);
    };

    updateBtn();
  }

  /* ---------------------------------------------------------------------- */
  /*  3. MISE EN ORDRE — glisser-déposer + boutons monter/descendre          */
  /* ---------------------------------------------------------------------- */
  function buildOrder(host, d, done) {
    var correct = d.steps.slice();
    var current = U.shuffle(correct);
    // Un mélange identique à la solution rendrait l'exercice trivial
    var guard = 0;
    while (guard++ < 20 && current.join('|') === correct.join('|')) current = U.shuffle(correct);

    var checked = false;

    host.innerHTML = '<div class="orderlist" id="oList"></div>' +
      '<div class="btnrow" style="margin-top:16px">' +
        '<button class="btn btn--primary" id="checkBtn">Vérifier l\'ordre</button>' +
        '<button class="btn btn--soft" id="shuffleBtn">Remélanger</button>' +
      '</div>' +
      '<p class="muted" style="margin-top:12px" id="oHint">Glissez les éléments ou utilisez les flèches pour les réordonner.</p>';

    var listEl = host.querySelector('#oList');
    var hint = host.querySelector('#oHint');

    function render() {
      listEl.innerHTML = '';
      current.forEach(function (text, idx) {
        var row = U.el('div', { class: 'oitem', draggable: checked ? 'false' : 'true', 'data-i': idx });
        row.innerHTML =
          '<span class="oitem__n">' + (idx + 1) + '</span>' +
          '<span class="oitem__t">' + U.rich(text) + '</span>' +
          (checked ? '' :
            '<span class="oitem__mv">' +
              '<button data-mv="up" aria-label="Monter">▲</button>' +
              '<button data-mv="down" aria-label="Descendre">▼</button>' +
            '</span>' +
            '<span class="oitem__g">⋮⋮</span>');
        listEl.appendChild(row);
      });
      if (!checked) bindDnd();
    }

    function bindDnd() {
      var dragIdx = null;

      U.qsa('.oitem', listEl).forEach(function (row) {
        var idx = Number(row.getAttribute('data-i'));

        row.addEventListener('dragstart', function (e) {
          dragIdx = idx;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(idx));
          row.classList.add('is-drag');
        });
        row.addEventListener('dragend', function () { row.classList.remove('is-drag'); dragIdx = null; });
        row.addEventListener('dragover', function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
        row.addEventListener('drop', function (e) {
          e.preventDefault();
          var from = dragIdx !== null ? dragIdx : Number(e.dataTransfer.getData('text/plain'));
          if (isNaN(from) || from === idx) return;
          var item = current.splice(from, 1)[0];
          current.splice(idx, 0, item);
          render();
        });

        U.qsa('[data-mv]', row).forEach(function (b) {
          b.addEventListener('click', function (ev) {
            ev.stopPropagation();
            var dir = b.getAttribute('data-mv') === 'up' ? -1 : 1;
            var to = idx + dir;
            if (to < 0 || to >= current.length) return;
            var tmp = current[idx]; current[idx] = current[to]; current[to] = tmp;
            render();
          });
        });
      });
    }

    host.querySelector('#shuffleBtn').onclick = function () {
      if (checked) return;
      current = U.shuffle(current);
      render();
    };

    host.querySelector('#checkBtn').onclick = function () {
      if (checked) return;
      checked = true;
      var right = 0;
      render();

      U.qsa('.oitem', listEl).forEach(function (row, idx) {
        if (current[idx] === correct[idx]) { row.classList.add('is-ok'); right++; }
        else {
          row.classList.add('is-ko');
          var pos = correct.indexOf(current[idx]) + 1;
          row.querySelector('.oitem__t').innerHTML += ' <span class="muted">(position attendue : ' + pos + ')</span>';
        }
      });

      host.querySelector('#checkBtn').disabled = true;
      host.querySelector('#shuffleBtn').disabled = true;

      var ok = right === correct.length;
      hint.innerHTML = ok
        ? '<span style="color:var(--green);font-weight:650">✓ Ordre exact : ' + right + ' / ' + correct.length + '.</span>'
        : '<span style="color:var(--amber);font-weight:650">' + right + ' / ' + correct.length +
          ' à la bonne place. Ordre correct : ' + correct.map(function (c, n) { return (n + 1) + '. ' + c; }).join(' — ') + '</span>';
      done(ok);
    };

    render();
  }

  /* ---------------------------------------------------------------------- */
  /*  4. TEXTE À TROUS — saisie libre avec banque de mots proposée           */
  /* ---------------------------------------------------------------------- */
  function buildFill(host, d, done) {
    var answers = [];
    var html = U.esc(d.text).replace(/\{\{(.+?)\}\}/g, function (_, ans) {
      var i = answers.length;
      answers.push(ans);
      return '<input class="fillgap" data-i="' + i + '" type="text" autocomplete="off" spellcheck="false" ' +
        'size="' + Math.max(8, Math.min(24, ans.length + 2)) + '" aria-label="Trou ' + (i + 1) + '">';
    });

    var poolWords = U.shuffle(answers.concat(d.pool || []));

    host.innerHTML =
      '<div class="fillbox">' + html + '</div>' +
      '<div class="fillsel">' +
        '<span class="muted" style="width:100%;margin-bottom:6px">Mots proposés (certains sont des leurres) :</span>' +
        poolWords.map(function (w) { return '<button class="chip" data-w="' + U.esc(w) + '">' + U.esc(w) + '</button>'; }).join('') +
      '</div>' +
      '<div class="btnrow" style="margin-top:16px">' +
        '<button class="btn btn--primary" id="checkBtn">Vérifier</button>' +
        '<button class="btn btn--soft" id="clearBtn">Effacer</button>' +
      '</div>' +
      '<p class="muted" style="margin-top:12px" id="fHint">Saisissez votre réponse ou cliquez un mot proposé après avoir sélectionné un trou.</p>';

    var inputs = U.qsa('.fillgap', host);
    var hint = host.querySelector('#fHint');
    var checked = false;
    var focused = inputs[0] || null;

    inputs.forEach(function (inp) {
      inp.addEventListener('focus', function () { focused = inp; });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); host.querySelector('#checkBtn').click(); }
      });
    });

    U.qsa('.chip', host).forEach(function (c) {
      c.addEventListener('click', function () {
        if (checked) return;
        var target = focused && !focused.value ? focused : inputs.filter(function (x) { return !x.value; })[0];
        if (!target) { hint.textContent = 'Tous les trous sont déjà remplis. Effacez-en un pour le modifier.'; return; }
        target.value = c.getAttribute('data-w');
        var nextEmpty = inputs.filter(function (x) { return !x.value; })[0];
        if (nextEmpty) { nextEmpty.focus(); focused = nextEmpty; }
      });
    });

    host.querySelector('#clearBtn').onclick = function () {
      if (checked) return;
      inputs.forEach(function (inp) { inp.value = ''; inp.classList.remove('is-ok', 'is-ko'); });
      if (inputs[0]) inputs[0].focus();
    };

    host.querySelector('#checkBtn').onclick = function () {
      if (checked) return;
      checked = true;
      var right = 0;

      inputs.forEach(function (inp, i) {
        var ok = U.norm(inp.value) === U.norm(answers[i]);
        inp.classList.add(ok ? 'is-ok' : 'is-ko');
        inp.disabled = true;
        if (ok) right++;
        else {
          inp.value = answers[i];
          inp.size = Math.max(8, answers[i].length + 2);
          inp.title = 'Réponse attendue : ' + answers[i];
        }
      });

      U.qsa('.chip', host).forEach(function (c) { c.disabled = true; c.style.opacity = '.5'; });
      host.querySelector('#checkBtn').disabled = true;
      host.querySelector('#clearBtn').disabled = true;

      var ok = right === answers.length;
      hint.innerHTML = ok
        ? '<span style="color:var(--green);font-weight:650">✓ Toutes les réponses sont exactes (' + right + ' / ' + answers.length + ').</span>'
        : '<span style="color:var(--amber);font-weight:650">' + right + ' / ' + answers.length +
          ' correctes. Les bonnes réponses ont été insérées en rouge.</span>';
      done(ok);
    };

    if (inputs[0]) inputs[0].focus();
  }

})(window.App = window.App || {});
