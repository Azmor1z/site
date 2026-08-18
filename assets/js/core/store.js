/* ============================================================================
   STORE — persistance locale de toute la progression
   Tolérant aux pannes : si localStorage est indisponible (navigation privée
   stricte, quota dépassé), on bascule sur un stockage mémoire sans casser l'app.
   ========================================================================== */
(function (App) {
  'use strict';

  var KEY = 'secplus-lab:v1';
  var U = App.util;

  var memoryFallback = null;

  function readRaw() {
    if (memoryFallback) return memoryFallback;
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeRaw(obj) {
    if (memoryFallback) { memoryFallback = obj; return; }
    try {
      localStorage.setItem(KEY, JSON.stringify(obj));
    } catch (e) {
      // Quota ou accès refusé : on continue en mémoire pour la session.
      memoryFallback = obj;
      if (!writeRaw._warned) {
        writeRaw._warned = true;
        if (App.ui && App.ui.toast) App.ui.toast('Sauvegarde locale indisponible : la progression ne sera pas conservée après fermeture.', 'err', 6000);
      }
    }
  }

  function defaults() {
    return {
      version: 1,
      created: Date.now(),
      // null = aucun choix explicite : on suivra la préférence du système.
      theme: null,
      // SRS : { cardId: {ease, interval, due (dayKey), reps, lapses, last} }
      srs: {},
      // Quiz : { questionId: {seen, ok, ko, lastOk} }
      quiz: {},
      // Sections : { sectionId: {read: bool, quizBest: 0-100, drillsDone: [ids]} }
      sections: {},
      // Historique d'examens blancs
      exams: [],
      // Activité quotidienne : { dayKey: {cards, questions, minutes} }
      activity: {},
      streak: { current: 0, best: 0, last: null },
      // Compteurs cumulés
      totals: { cards: 0, questions: 0, correct: 0, drills: 0 },
      labsDone: []
    };
  }

  /** Fusion défensive : garantit que toutes les clés existent même après une MAJ. */
  function migrate(data) {
    var d = defaults();
    if (!data || typeof data !== 'object') return d;
    for (var k in d) {
      if (k === 'theme') continue; // null est une valeur valide : « suivre le système »
      if (!(k in data) || data[k] === null || data[k] === undefined) data[k] = d[k];
    }
    if (data.theme !== 'light' && data.theme !== 'dark') data.theme = null;
    if (typeof data.srs !== 'object') data.srs = {};
    if (typeof data.quiz !== 'object') data.quiz = {};
    if (typeof data.sections !== 'object') data.sections = {};
    if (typeof data.activity !== 'object') data.activity = {};
    if (!Array.isArray(data.exams)) data.exams = [];
    if (!Array.isArray(data.labsDone)) data.labsDone = [];
    if (typeof data.totals !== 'object') data.totals = d.totals;
    if (typeof data.streak !== 'object') data.streak = d.streak;
    return data;
  }

  var state = migrate(readRaw());

  var S = App.store = {};

  S.data = state;
  S.save = function () { writeRaw(state); };

  S.reset = function () {
    state = defaults();
    S.data = state;
    S.save();
  };

  /* ---------------------- Thème ---------------------- */
  /** Tant que l'utilisateur n'a rien choisi, on respecte la préférence du système. */
  S.getTheme = function () {
    if (state.theme === 'light' || state.theme === 'dark') return state.theme;
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    } catch (e) { /* matchMedia indisponible : on retombe sur le thème sombre */ }
    return 'dark';
  };
  S.setTheme = function (t) {
    state.theme = (t === 'light') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    S.save();
  };

  /* ---------------------- Activité & série ---------------------- */
  function todayEntry() {
    var k = U.dayKey();
    if (!state.activity[k]) state.activity[k] = { cards: 0, questions: 0, drills: 0 };
    return state.activity[k];
  }

  /** Enregistre une activité et met à jour la série de jours consécutifs. */
  S.touch = function (kind, n) {
    var e = todayEntry();
    if (kind && (kind in e)) e[kind] += (n || 1);

    var today = U.dayKey();
    var st = state.streak;
    if (st.last !== today) {
      if (st.last && U.daysBetween(st.last, today) === 1) st.current += 1;
      else st.current = 1;
      st.last = today;
      if (st.current > st.best) st.best = st.current;
    }
    S.save();
  };

  S.streak = function () {
    var st = state.streak;
    if (!st.last) return 0;
    var gap = U.daysBetween(st.last, U.dayKey());
    // La série reste valable aujourd'hui et hier ; au-delà elle est rompue.
    return gap <= 1 ? st.current : 0;
  };

  /* ---------------------- Quiz ---------------------- */
  S.recordQuestion = function (qid, correct) {
    var q = state.quiz[qid] || { seen: 0, ok: 0, ko: 0, lastOk: false };
    q.seen++;
    if (correct) { q.ok++; q.lastOk = true; } else { q.ko++; q.lastOk = false; }
    state.quiz[qid] = q;
    state.totals.questions++;
    if (correct) state.totals.correct++;
    S.touch('questions', 1);
  };

  S.questionStat = function (qid) { return state.quiz[qid] || null; };

  /** Questions déjà vues et ratées la dernière fois — cœur du mode « mes erreurs ». */
  S.weakQuestionIds = function () {
    var out = [];
    for (var id in state.quiz) if (!state.quiz[id].lastOk && state.quiz[id].seen > 0) out.push(id);
    return out;
  };

  /* ---------------------- Sections ---------------------- */
  S.section = function (id) {
    if (!state.sections[id]) state.sections[id] = { read: false, quizBest: 0, drillsDone: [] };
    if (!Array.isArray(state.sections[id].drillsDone)) state.sections[id].drillsDone = [];
    return state.sections[id];
  };

  S.markRead = function (id, val) {
    S.section(id).read = val !== false;
    S.save();
  };

  S.setQuizBest = function (id, pct) {
    var s = S.section(id);
    if (pct > s.quizBest) s.quizBest = pct;
    S.save();
  };

  S.markDrill = function (sectionId, drillId) {
    var s = S.section(sectionId);
    if (s.drillsDone.indexOf(drillId) === -1) {
      s.drillsDone.push(drillId);
      state.totals.drills++;
      S.touch('drills', 1);
    }
    S.save();
  };

  /** Score de maîtrise d'une section, de 0 à 100. */
  S.sectionProgress = function (id) {
    var sec = App.SECTION_BY_ID[id];
    if (!sec) return 0;
    var s = S.section(id);
    var parts = [];

    parts.push({ w: 20, v: s.read ? 100 : 0 });
    parts.push({ w: 45, v: s.quizBest });

    var drills = (App.DRILLS && App.DRILLS[id]) || [];
    parts.push({ w: 20, v: drills.length ? U.pct(Math.min(s.drillsDone.length, drills.length), drills.length) : (s.read ? 100 : 0) });

    var cards = (App.FLASHCARDS && App.FLASHCARDS[id]) || [];
    if (cards.length) {
      var known = 0;
      cards.forEach(function (c, i) {
        var e = state.srs[App.srs.cardId(id, i)];
        if (e && e.reps > 0 && e.interval >= 4) known++;
      });
      parts.push({ w: 15, v: U.pct(known, cards.length) });
    } else {
      parts.push({ w: 15, v: s.read ? 100 : 0 });
    }

    var tw = 0, acc = 0;
    parts.forEach(function (p) { tw += p.w; acc += p.w * U.clamp(p.v, 0, 100); });
    return Math.round(acc / tw);
  };

  S.globalProgress = function () {
    var sum = 0;
    App.SECTIONS.forEach(function (s) { sum += S.sectionProgress(s.id); });
    return Math.round(sum / App.SECTIONS.length);
  };

  /* ---------------------- Examens ---------------------- */
  S.recordExam = function (rec) {
    state.exams.unshift(rec);
    if (state.exams.length > 40) state.exams.length = 40;
    S.touch(null);
    S.save();
  };

  /* ---------------------- Labs ---------------------- */
  S.markLab = function (id) {
    if (state.labsDone.indexOf(id) === -1) { state.labsDone.push(id); S.touch(null); S.save(); }
  };
  S.labDone = function (id) { return state.labsDone.indexOf(id) !== -1; };

  /* ---------------------- Export / import ---------------------- */
  S.export = function () { return JSON.stringify(state, null, 2); };

  S.import = function (json) {
    var parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') throw new Error('Format invalide');
    state = migrate(parsed);
    S.data = state;
    S.save();
  };

  // Applique le thème enregistré immédiatement.
  document.documentElement.setAttribute('data-theme', S.getTheme());

})(window.App = window.App || {});
