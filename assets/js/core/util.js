/* ============================================================================
   UTILITAIRES
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util = {};

  /** Échappement HTML — toute donnée injectée dans le DOM passe par ici. */
  U.esc = function (s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /** Met en gras les portions **entourées** et échappe le reste. */
  U.rich = function (s) {
    return U.esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  };

  U.qs  = function (sel, root) { return (root || document).querySelector(sel); };
  U.qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /** Mélange Fisher-Yates sur une copie. */
  U.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  U.sample = function (arr, n) { return U.shuffle(arr).slice(0, Math.max(0, n)); };
  U.clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };
  U.pct = function (a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; };

  /** Clé de jour local au format YYYY-MM-DD (pas UTC : le streak suit l'utilisateur). */
  U.dayKey = function (d) {
    var x = d ? new Date(d) : new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  };

  U.daysBetween = function (aKey, bKey) {
    var a = new Date(aKey + 'T00:00:00'), b = new Date(bKey + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  };

  U.mmss = function (sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  };

  U.plural = function (n, one, many) { return n + ' ' + (n > 1 ? (many || one + 's') : one); };

  /** Normalisation pour comparaison de saisie libre : minuscules, sans accents ni ponctuation. */
  U.norm = function (s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  };

  /** Crée un élément avec attributs et enfants. */
  U.el = function (tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    if (children) [].concat(children).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  };

  /** Identifiant stable et déterministe (sert de clé SRS pour une carte / question). */
  U.hash = function (str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };

  U.debounce = function (fn, ms) {
    var t;
    return function () {
      var self = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  };

  /** Formate une date en français lisible. */
  U.humanDate = function (key) {
    try {
      return new Date(key + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch (e) { return key; }
  };

})(window.App = window.App || {});
