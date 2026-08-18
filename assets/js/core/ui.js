/* ============================================================================
   UI — composants réutilisables et notifications
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  var ui = App.ui = {};

  /* ------------------------------ Toasts ------------------------------ */
  ui.toast = function (msg, kind, ms) {
    var host = document.getElementById('toasts');
    if (!host) return;
    var t = U.el('div', { class: 'toast' + (kind ? ' toast--' + kind : '') },
      [U.el('span', { text: kind === 'ok' ? '✓' : kind === 'err' ? '✕' : 'ℹ' }), U.el('span', { text: msg })]);
    host.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-out');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, ms || 2600);
  };

  /* ---------------------------- Anneau SVG ---------------------------- */
  ui.ring = function (pct, label, size, color) {
    size = size || 128;
    var sw = size > 110 ? 10 : 8;
    var r = (size - sw) / 2;
    var c = 2 * Math.PI * r;
    var off = c * (1 - U.clamp(pct, 0, 100) / 100);
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '">' +
      '<circle class="ring__track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + sw + '"/>' +
      '<circle class="ring__val" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + sw + '" ' +
      (color ? 'stroke="' + color + '" ' : '') +
      'stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '"/>' +
      '</svg>' +
      '<div class="ring__mid"><div class="ring__num">' + Math.round(pct) + '<span style="font-size:.55em">%</span></div>' +
      (label ? '<div class="ring__lbl">' + U.esc(label) + '</div>' : '') + '</div></div>';
  };

  /* ---------------------------- Barre simple ---------------------------- */
  ui.bar = function (pct, mod) {
    var cls = 'bar' + (mod ? ' bar--' + mod : '');
    return '<div class="' + cls + '"><i style="width:' + U.clamp(pct, 0, 100) + '%"></i></div>';
  };

  /** Couleur de barre selon le score : rouge < 50, ambre < 75, vert au-delà. */
  ui.scoreMod = function (pct) { return pct >= 75 ? 'green' : pct >= 50 ? 'amber' : 'red'; };

  /* ---------------------------- Badge domaine ---------------------------- */
  ui.domainBadge = function (domId) {
    var d = App.getDomain(domId);
    return '<span class="badge badge--dom" style="background:' + d.color + '22;color:' + d.color + '">' + U.esc(d.id) + ' ' + U.esc(d.fr) + '</span>';
  };

  /* ------------------------------ En-tête ------------------------------ */
  ui.pagehead = function (opts) {
    return '<div class="pagehead">' +
      (opts.eyebrow ? '<div class="eyebrow">' + U.esc(opts.eyebrow) + '</div>' : '') +
      '<h1 class="h1">' + U.esc(opts.title) + '</h1>' +
      (opts.lead ? '<p class="lead">' + U.esc(opts.lead) + '</p>' : '') +
      '</div>';
  };

  /* ------------------------------- Vide ------------------------------- */
  ui.empty = function (icon, title, msg) {
    return '<div class="empty"><div class="empty__i">' + U.esc(icon) + '</div>' +
      '<div class="empty__t">' + U.esc(title) + '</div>' +
      (msg ? '<div>' + U.esc(msg) + '</div>' : '') + '</div>';
  };

  /* ----------------------- Confirmation modale ----------------------- */
  ui.confirm = function (message, onYes) {
    var wrap = U.el('div', { class: 'modal' });
    wrap.innerHTML =
      '<div class="modal__backdrop"></div>' +
      '<div class="modal__panel" style="max-width:420px;padding:26px">' +
        '<div class="h3" style="margin-bottom:10px">Confirmation</div>' +
        '<p class="lead" style="font-size:14px;margin-bottom:20px">' + U.esc(message) + '</p>' +
        '<div class="btnrow" style="justify-content:flex-end">' +
          '<button class="btn btn--soft" data-no>Annuler</button>' +
          '<button class="btn btn--danger" data-yes>Confirmer</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    function close() { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }
    wrap.querySelector('[data-no]').onclick = close;
    wrap.querySelector('.modal__backdrop').onclick = close;
    wrap.querySelector('[data-yes]').onclick = function () { close(); onYes(); };
  };

  /* ------------------- Barre d'actions collante ------------------- */
  ui.actions = function (html) { return '<div class="sticky-actions">' + html + '</div>'; };

})(window.App = window.App || {});
