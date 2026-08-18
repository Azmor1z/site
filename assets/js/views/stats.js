/* ============================================================================
   VUE — Statistiques et gestion de la progression
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  App.views = App.views || {};

  App.views.stats = function () {
    var S = App.store;
    var wrap = U.el('div');
    var totals = S.data.totals;
    var bd = App.srs.breakdown();
    var acc = totals.questions > 0 ? U.pct(totals.correct, totals.questions) : 0;
    var exams = S.data.exams;

    var html = App.ui.pagehead({
      eyebrow: 'Suivi détaillé',
      title: 'Vos statistiques',
      lead: "Toute votre progression est enregistrée localement dans ce navigateur. Aucune donnée n'est envoyée sur un serveur."
    });

    /* ------------------------- Compteurs globaux ------------------------- */
    html += '<div class="grid grid--4" style="margin-bottom:24px">' +
      stat('Maîtrise globale', S.globalProgress() + ' %', '28 sections') +
      stat('Série en cours', S.streak() + (S.streak() > 1 ? ' j' : ' j'), 'record : ' + S.data.streak.best + ' jours') +
      stat('Cartes révisées', totals.cards, bd.total + ' cartes au total') +
      stat('Taux de réussite', acc + ' %', totals.questions + ' questions traitées') +
      '</div>';

    /* ------------------------- Mémorisation ------------------------- */
    html += '<h2 class="h2" style="margin-bottom:12px">État de la mémorisation</h2>' +
      '<div class="card" style="margin-bottom:24px">' +
        '<div class="grid grid--4" style="gap:12px;margin-bottom:16px">' +
          srsBox('Nouvelles', bd.fresh, bd.total, 'var(--text-3)', 'jamais vues') +
          srsBox('En cours', bd.learning, bd.total, 'var(--amber)', 'moins de 4 jours') +
          srsBox('Consolidées', bd.young, bd.total, 'var(--accent)', '4 à 21 jours') +
          srsBox('Acquises', bd.mature, bd.total, 'var(--green)', 'plus de 21 jours') +
        '</div>' +
        '<div style="display:flex;height:11px;border-radius:999px;overflow:hidden;background:var(--surface-3)">' +
          seg(bd.fresh, bd.total, 'var(--surface-3)') +
          seg(bd.learning, bd.total, 'var(--amber)') +
          seg(bd.young, bd.total, 'var(--accent)') +
          seg(bd.mature, bd.total, 'var(--green)') +
        '</div>' +
        '<p class="muted" style="margin-top:11px">Une carte devient « acquise » lorsque son intervalle de révision dépasse 21 jours. ' +
        'L\'objectif est de faire basculer progressivement l\'ensemble des ' + bd.total + ' cartes vers cette catégorie.</p>' +
      '</div>';

    /* ------------------------- Activité 30 jours ------------------------- */
    html += '<h2 class="h2" style="margin-bottom:12px">Activité des 30 derniers jours</h2>' +
      '<div class="card" style="margin-bottom:24px">' + activityChart(S) + '</div>';

    /* ------------------------- Progression par section ------------------------- */
    html += '<h2 class="h2" style="margin-bottom:12px">Progression section par section</h2>' +
      '<div class="card" style="margin-bottom:24px">';
    App.SECTIONS.forEach(function (s, idx) {
      var p = S.sectionProgress(s.id);
      var d = App.getDomain(s.domain);
      html += '<div style="' + (idx > 0 ? 'margin-top:11px' : '') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:4px">' +
          '<a href="#/section/' + s.id + '" style="font-size:13px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
            s.icon + ' ' + s.id + '. ' + U.esc(s.title) + '</a>' +
          '<span class="muted" style="white-space:nowrap;font-weight:650;color:' +
            (p >= 80 ? 'var(--green)' : p >= 40 ? 'var(--amber)' : 'var(--text-3)') + '">' + p + ' %</span>' +
        '</div>' +
        '<div class="bar bar--thin"><i style="width:' + p + '%;background:' + d.color + '"></i></div></div>';
    });
    html += '</div>';

    /* ------------------------- Historique d'examens ------------------------- */
    if (exams.length) {
      var best = exams.reduce(function (a, b) { return b.score > a.score ? b : a; });
      html += '<h2 class="h2" style="margin-bottom:12px">Examens blancs</h2>' +
        '<div class="grid grid--3" style="margin-bottom:14px">' +
          stat('Examens passés', exams.length, '') +
          stat('Meilleur score', best.score, best.score >= 750 ? 'réussi' : 'sous le seuil de 750') +
          stat('Dernier score', exams[0].score, exams[0].score >= 750 ? 'réussi' : 'sous le seuil de 750') +
        '</div>' +
        '<div class="card" style="margin-bottom:24px">' + examChart(exams) + '</div>';
    }

    /* ------------------------- Gestion des données ------------------------- */
    html += '<div class="divider"></div>' +
      '<h2 class="h2" style="margin-bottom:12px">Gestion de votre progression</h2>' +
      '<div class="card">' +
        '<p class="lead" style="margin-bottom:16px">Votre progression vit uniquement dans le stockage local de ce navigateur. ' +
        'Exportez-la pour la sauvegarder ou la transférer sur un autre appareil.</p>' +
        '<div class="btnrow">' +
          '<button class="btn btn--soft" id="exportBtn">⬇ Exporter ma progression</button>' +
          '<button class="btn btn--soft" id="importBtn">⬆ Importer une sauvegarde</button>' +
          '<button class="btn btn--danger" id="resetBtn">Tout réinitialiser</button>' +
        '</div>' +
        '<input type="file" id="fileInput" accept="application/json,.json" hidden>' +
        '<div id="ioFeed" style="margin-top:14px"></div>' +
      '</div>';

    wrap.innerHTML = html;

    /* ---------------------------- Export / import ---------------------------- */
    var feed = wrap.querySelector('#ioFeed');

    wrap.querySelector('#exportBtn').onclick = function () {
      try {
        var blob = new Blob([S.export()], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = U.el('a', { href: url, download: 'secplus-lab-progression-' + U.dayKey() + '.json' });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        App.ui.toast('Sauvegarde exportée', 'ok');
      } catch (e) {
        // Certains environnements bloquent le téléchargement : on affiche le JSON à copier.
        feed.innerHTML = '<div class="callout callout--warn">Le téléchargement automatique a été bloqué. ' +
          'Copiez le contenu ci-dessous et collez-le dans un fichier <span class="mono">.json</span> :</div>' +
          '<textarea readonly style="width:100%;height:170px;margin-top:10px;padding:12px;border-radius:11px;' +
          'background:var(--surface-2);border:1px solid var(--border);font-family:var(--mono);font-size:12px">' +
          U.esc(S.export()) + '</textarea>';
      }
    };

    var fileInput = wrap.querySelector('#fileInput');
    wrap.querySelector('#importBtn').onclick = function () { fileInput.click(); };

    fileInput.addEventListener('change', function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          S.import(String(reader.result));
          App.ui.toast('Progression importée', 'ok');
          App.refreshChrome();
          var v = document.getElementById('view');
          v.innerHTML = '';
          v.appendChild(App.views.stats());
        } catch (err) {
          feed.innerHTML = '<div class="callout callout--warn">Fichier invalide : ' + U.esc(err.message) + '</div>';
        }
      };
      reader.onerror = function () {
        feed.innerHTML = '<div class="callout callout--warn">Impossible de lire ce fichier.</div>';
      };
      reader.readAsText(f);
      fileInput.value = '';
    });

    wrap.querySelector('#resetBtn').onclick = function () {
      App.ui.confirm(
        'Toute votre progression sera définitivement effacée : flashcards, quiz, exercices et examens. Cette action est irréversible.',
        function () {
          S.reset();
          App.ui.toast('Progression réinitialisée', 'ok');
          App.refreshChrome();
          location.hash = '#/';
        });
    };

    return wrap;
  };

  /* ------------------------------ Fragments ------------------------------ */
  function stat(k, v, s) {
    return '<div class="stat"><div class="stat__k">' + U.esc(k) + '</div>' +
      '<div class="stat__v">' + U.esc(String(v)) + '</div>' +
      (s ? '<div class="stat__s">' + U.esc(s) + '</div>' : '') + '</div>';
  }

  function srsBox(label, n, total, color, sub) {
    return '<div style="text-align:center;padding:13px 8px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border)">' +
      '<div style="font-size:23px;font-weight:800;color:' + color + '">' + n + '</div>' +
      '<div style="font-size:12px;font-weight:650;margin-top:2px">' + U.esc(label) + '</div>' +
      '<div class="muted" style="font-size:11px;margin-top:2px">' + U.esc(sub) + '</div></div>';
  }

  function seg(n, total, color) {
    if (!total || !n) return '';
    return '<div style="width:' + (n / total * 100) + '%;background:' + color + '"></div>';
  }

  /** Histogramme d'activité sur 30 jours, en SVG inline (aucune dépendance). */
  function activityChart(S) {
    var days = [];
    var max = 1;
    for (var k = 29; k >= 0; k--) {
      var d = new Date();
      d.setDate(d.getDate() - k);
      var key = U.dayKey(d);
      var a = S.data.activity[key] || { cards: 0, questions: 0, drills: 0 };
      var total = a.cards + a.questions + a.drills;
      if (total > max) max = total;
      days.push({ key: key, total: total, a: a });
    }

    var active = days.filter(function (d) { return d.total > 0; }).length;
    var sum = days.reduce(function (acc, d) { return acc + d.total; }, 0);

    var W = 100, H = 34, gap = 0.7;
    var bw = (W - gap * (days.length - 1)) / days.length;

    var bars = days.map(function (d, i) {
      var h = d.total > 0 ? Math.max(1.6, (d.total / max) * H) : 0.8;
      var x = i * (bw + gap);
      var y = H - h;
      var fill = d.total > 0 ? 'var(--accent)' : 'var(--surface-3)';
      return '<rect x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" width="' + bw.toFixed(2) + '" height="' + h.toFixed(2) + '" ' +
        'rx="0.5" fill="' + fill + '"><title>' + U.esc(U.humanDate(d.key)) + ' : ' + d.total + ' actions</title></rect>';
    }).join('');

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" style="width:100%;height:120px;display:block" role="img" ' +
      'aria-label="Activité des 30 derniers jours">' + bars + '</svg>' +
      '<div style="display:flex;justify-content:space-between;margin-top:9px" class="muted">' +
        '<span>' + U.humanDate(days[0].key) + '</span>' +
        '<span>' + active + ' jours actifs · ' + sum + ' actions au total</span>' +
        '<span>Aujourd\'hui</span>' +
      '</div>';
  }

  /** Courbe d'évolution des scores d'examens, en SVG inline. */
  function examChart(exams) {
    var list = exams.slice(0, 15).reverse();
    if (list.length < 2) {
      return '<p class="muted" style="text-align:center;padding:18px 0">' +
        'Passez au moins deux examens blancs pour visualiser votre progression.</p>';
    }

    var W = 100, H = 40;
    var min = 100, max = 900;
    var pts = list.map(function (e, i) {
      var x = (i / (list.length - 1)) * W;
      var y = H - ((e.score - min) / (max - min)) * H;
      return { x: x, y: y, e: e };
    });

    var line = pts.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ' ' + p.y.toFixed(2); }).join(' ');
    var passY = H - ((750 - min) / (max - min)) * H;

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" style="width:100%;height:150px;display:block" role="img" ' +
      'aria-label="Évolution des scores d\'examen">' +
      '<line x1="0" y1="' + passY.toFixed(2) + '" x2="' + W + '" y2="' + passY.toFixed(2) + '" ' +
        'stroke="var(--green)" stroke-width="0.3" stroke-dasharray="1.5 1"/>' +
      '<path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      pts.map(function (p) {
        return '<circle cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="0.9" ' +
          'fill="' + (p.e.score >= 750 ? 'var(--green)' : 'var(--red)') + '">' +
          '<title>' + new Date(p.e.date).toLocaleDateString('fr-FR') + ' : ' + p.e.score + '/900</title></circle>';
      }).join('') +
      '</svg>' +
      '<div style="display:flex;justify-content:space-between;margin-top:9px" class="muted">' +
        '<span>Plus ancien</span>' +
        '<span><span style="color:var(--green)">— — —</span> seuil de réussite : 750</span>' +
        '<span>Plus récent</span>' +
      '</div>';
  }

})(window.App = window.App || {});
