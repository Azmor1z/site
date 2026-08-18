/* ============================================================================
   SRS — répétition espacée (variante simplifiée de SM-2)
   Note de rappel : 0 = oublié, 1 = difficile, 2 = correct, 3 = facile.
   ========================================================================== */
(function (App) {
  'use strict';

  var U = App.util;
  var R = App.srs = {};

  R.cardId = function (sectionId, index) { return 's' + sectionId + 'c' + index; };

  /** Copie défensive : l'appelant ne peut pas muter l'état stocké par inadvertance. */
  function entry(id) {
    var e = App.store.data.srs[id];
    if (!e) return { ease: 2.5, interval: 0, due: U.dayKey(), reps: 0, lapses: 0, last: null };
    return { ease: e.ease, interval: e.interval, due: e.due, reps: e.reps, lapses: e.lapses, last: e.last };
  }
  R.entry = entry;

  /** Une carte est due si elle n'a jamais été vue ou si sa date d'échéance est atteinte. */
  R.isDue = function (id) {
    var e = App.store.data.srs[id];
    if (!e) return true;
    return U.daysBetween(e.due, U.dayKey()) >= 0;
  };

  R.isNew = function (id) { return !App.store.data.srs[id]; };

  /** Applique une note et calcule la prochaine échéance. */
  R.grade = function (id, q) {
    var e = entry(id);
    q = U.clamp(q, 0, 3);

    if (q === 0) {
      // Oubli : on repart du début et on pénalise la facilité.
      e.lapses++;
      e.reps = 0;
      e.interval = 0;          // à revoir dans la même session
      e.ease = Math.max(1.3, e.ease - 0.25);
    } else {
      e.reps++;
      if (e.reps === 1)      e.interval = (q === 1) ? 1 : (q === 2 ? 2 : 4);
      else if (e.reps === 2) e.interval = (q === 1) ? 3 : (q === 2 ? 6 : 10);
      else                   e.interval = Math.round(e.interval * e.ease * (q === 1 ? 0.6 : (q === 3 ? 1.3 : 1)));

      // Ajustement de la facilité selon la qualité du rappel.
      var delta = (q === 1) ? -0.15 : (q === 3 ? 0.10 : 0);
      e.ease = U.clamp(e.ease + delta, 1.3, 2.8);
      e.interval = U.clamp(e.interval, 1, 365);
    }

    var d = new Date();
    d.setDate(d.getDate() + e.interval);
    e.due = U.dayKey(d);
    e.last = U.dayKey();

    App.store.data.srs[id] = e;
    App.store.data.totals.cards++;
    App.store.touch('cards', 1);
    return e;
  };

  /** Toutes les cartes dues, tous chapitres confondus (ou une section donnée). */
  R.dueCards = function (sectionId) {
    var out = [];
    var sections = sectionId ? [sectionId] : Object.keys(App.FLASHCARDS || {});
    sections.forEach(function (sid) {
      var list = (App.FLASHCARDS || {})[sid] || [];
      list.forEach(function (card, i) {
        var id = R.cardId(sid, i);
        if (R.isDue(id)) out.push({ id: id, card: card, section: Number(sid), index: i });
      });
    });
    return out;
  };

  R.dueCount = function () { return R.dueCards().length; };

  /** Répartition des cartes par état de maîtrise, pour les statistiques. */
  R.breakdown = function () {
    var b = { fresh: 0, learning: 0, young: 0, mature: 0, total: 0 };
    Object.keys(App.FLASHCARDS || {}).forEach(function (sid) {
      ((App.FLASHCARDS || {})[sid] || []).forEach(function (c, i) {
        var e = App.store.data.srs[R.cardId(sid, i)];
        b.total++;
        if (!e || e.reps === 0) b.fresh++;
        else if (e.interval < 4) b.learning++;
        else if (e.interval < 21) b.young++;
        else b.mature++;
      });
    });
    return b;
  };

})(window.App = window.App || {});
