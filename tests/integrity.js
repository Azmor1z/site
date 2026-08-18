/* Test d'intégrité des données du site — exécuté hors navigateur */
const fs = require('fs');
const path = require('path');
const ROOT = require('path').join(__dirname, '..');

global.window = {};
global.document = { documentElement: { setAttribute() {} } };
global.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] || null; },
  setItem(k, v) { this._d[k] = v; },
};

const files = [
  'data/curriculum.js', 'data/acronyms.js', 'data/ports.js', 'data/flashcards.js',
  'data/questions.js', 'data/drills.js', 'data/labs.js',
  'core/util.js', 'core/store.js', 'core/srs.js',
];
files.forEach(f => require(path.join(ROOT, 'assets/js', f)));

const App = global.window.App;
const errors = [];
const warn = [];
const E = m => errors.push(m);

// ---- 1. index.html référence-t-il tous les scripts existants ? ----
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
srcs.forEach(s => {
  if (!fs.existsSync(path.join(ROOT, s))) E(`index.html référence un fichier absent : ${s}`);
});
const onDisk = [];
(function walk(d) {
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.js')) onDisk.push(path.relative(ROOT, p));
  });
})(path.join(ROOT, 'assets/js'));
onDisk.forEach(f => { if (!srcs.includes(f)) E(`Fichier JS non chargé par index.html : ${f}`); });

const css = [...html.matchAll(/<link[^>]*href="([^"]+\.css)"/g)].map(m => m[1]);
css.forEach(c => { if (!fs.existsSync(path.join(ROOT, c))) E(`CSS absent : ${c}`); });

// ---- 2. Curriculum ----
if (App.SECTIONS.length !== 28) E(`SECTIONS attendues 28, trouvées ${App.SECTIONS.length}`);
const ids = App.SECTIONS.map(s => s.id);
for (let i = 1; i <= 28; i++) if (!ids.includes(i)) E(`Section ${i} manquante`);
if (new Set(ids).size !== ids.length) E('Ids de section dupliqués');
App.SECTIONS.forEach(s => {
  if (!s.title || !s.summary || !s.icon) E(`Section ${s.id} : métadonnées incomplètes`);
  if (!App.DOMAINS.some(d => d.id === s.domain)) E(`Section ${s.id} : domaine inconnu ${s.domain}`);
  if (!s.lessons || !s.lessons.length) E(`Section ${s.id} : aucune leçon`);
  if (!s.keypoints || s.keypoints.length < 5) E(`Section ${s.id} : moins de 5 points clés`);
  s.objs.forEach(o => { if (!App.OBJECTIVES[o]) E(`Section ${s.id} : objectif inconnu ${o}`); });
});
const totalWeight = App.DOMAINS.reduce((a, d) => a + d.weight, 0);
if (totalWeight !== 100) E(`Pondération des domaines = ${totalWeight}, attendu 100`);

// Chaque objectif officiel doit être couvert par au moins une section
Object.keys(App.OBJECTIVES).forEach(o => {
  if (!App.SECTIONS.some(s => s.objs.includes(o))) E(`Objectif ${o} couvert par aucune section`);
});

// ---- 3. Flashcards ----
let nCards = 0;
for (let i = 1; i <= 28; i++) {
  const list = App.FLASHCARDS[i];
  if (!list || !list.length) { E(`Flashcards manquantes section ${i}`); continue; }
  nCards += list.length;
  if (list.length < 6) warn.push(`Section ${i} : seulement ${list.length} flashcards`);
  const seen = new Set();
  list.forEach((c, k) => {
    if (!c.q || !c.a) E(`Flashcard ${i}#${k} incomplète`);
    if (seen.has(c.q)) E(`Flashcard dupliquée section ${i} : ${c.q.slice(0, 45)}`);
    seen.add(c.q);
    // Les ** doivent aller par paires
    const stars = (c.a.match(/\*\*/g) || []).length;
    if (stars % 2 !== 0) E(`Flashcard ${i}#${k} : balises ** non appariées`);
  });
}

// ---- 4. Questions ----
let nQ = 0;
for (let i = 1; i <= 28; i++) {
  const list = App.QUESTIONS[i];
  if (!list || !list.length) { E(`Questions manquantes section ${i}`); continue; }
  nQ += list.length;
  const seen = new Set();
  list.forEach((q, k) => {
    const tag = `Q ${i}#${k}`;
    if (!q.q) E(`${tag} : énoncé vide`);
    if (!Array.isArray(q.o) || q.o.length !== 4) E(`${tag} : doit avoir exactement 4 options (${q.o?.length})`);
    if (typeof q.c !== 'number' || q.c < 0 || q.c >= q.o.length) E(`${tag} : index de bonne réponse invalide`);
    if (!q.e || q.e.length < 40) E(`${tag} : explication absente ou trop courte`);
    if (new Set(q.o).size !== q.o.length) E(`${tag} : options dupliquées`);
    if (seen.has(q.q)) E(`${tag} : énoncé dupliqué dans la section`);
    seen.add(q.q);
    const stars = (q.e.match(/\*\*/g) || []).length;
    if (stars % 2 !== 0) E(`${tag} : balises ** non appariées dans l'explication`);
    if (q.obj && !App.OBJECTIVES[q.obj] && !/Stratégie|Format/.test(q.obj)) E(`${tag} : objectif inconnu ${q.obj}`);
  });
}

// Distribution : chaque domaine doit avoir assez de questions pour un examen de 90
const perDom = {};
App.DOMAINS.forEach(d => perDom[d.id] = 0);
Object.keys(App.QUESTIONS).forEach(sid => {
  const sec = App.SECTION_BY_ID[sid];
  if (sec) perDom[sec.domain] += App.QUESTIONS[sid].length;
});
App.DOMAINS.forEach(d => {
  const need = Math.round(90 * d.weight / 100);
  if (perDom[d.id] < need) E(`Domaine ${d.id} : ${perDom[d.id]} questions, ${need} nécessaires pour un examen de 90`);
});

// ---- 5. Drills ----
let nD = 0;
const drillIds = new Set();
for (let i = 1; i <= 28; i++) {
  const list = App.DRILLS[i];
  if (!list || !list.length) { E(`Exercices manquants section ${i}`); continue; }
  nD += list.length;
  list.forEach(d => {
    if (drillIds.has(d.id)) E(`Id d'exercice dupliqué : ${d.id}`);
    drillIds.add(d.id);
    if (!['match', 'sort', 'order', 'fill'].includes(d.type)) E(`${d.id} : type inconnu ${d.type}`);
    if (!d.title) E(`${d.id} : titre manquant`);
    if (d.type === 'match') {
      if (!d.pairs || d.pairs.length < 3) E(`${d.id} : moins de 3 paires`);
      const rights = d.pairs.map(p => p[1]);
      if (new Set(rights).size !== rights.length) E(`${d.id} : définitions dupliquées (ambiguïté)`);
      d.pairs.forEach((p, k) => { if (!p[0] || !p[1]) E(`${d.id} paire ${k} incomplète`); });
    }
    if (d.type === 'sort') {
      const bins = Object.keys(d.bins || {});
      if (bins.length < 2) E(`${d.id} : moins de 2 catégories`);
      const all = [];
      bins.forEach(b => {
        if (!d.bins[b].length) E(`${d.id} : catégorie vide « ${b} »`);
        d.bins[b].forEach(t => all.push(t));
      });
      if (new Set(all).size !== all.length) E(`${d.id} : étiquette présente dans deux catégories`);
    }
    if (d.type === 'order') {
      if (!d.steps || d.steps.length < 3) E(`${d.id} : moins de 3 étapes`);
      if (new Set(d.steps).size !== d.steps.length) E(`${d.id} : étapes dupliquées`);
    }
    if (d.type === 'fill') {
      const gaps = (d.text || '').match(/\{\{(.+?)\}\}/g) || [];
      if (gaps.length < 3) E(`${d.id} : moins de 3 trous`);
      // Un leurre identique à une réponse rendrait l'exercice ambigu
      const answers = gaps.map(g => g.slice(2, -2));
      (d.pool || []).forEach(p => {
        if (answers.some(a => App.util.norm(a) === App.util.norm(p))) E(`${d.id} : leurre « ${p} » identique à une réponse`);
      });
    }
  });
}

// ---- 6. Labs ----
const labIds = new Set();
App.LABS.forEach(l => {
  if (labIds.has(l.id)) E(`Id de lab dupliqué : ${l.id}`);
  labIds.add(l.id);
  if (!App.SECTION_BY_ID[l.section]) E(`Lab ${l.id} : section ${l.section} inexistante`);
  if (!App.DOMAINS.some(d => d.id === l.domain)) E(`Lab ${l.id} : domaine inconnu`);
  if (!l.brief || l.brief.length < 40) E(`Lab ${l.id} : brief trop court`);
  if (l.steps.length < 3) E(`Lab ${l.id} : moins de 3 étapes`);
  l.steps.forEach((s, k) => {
    if (!s.prompt) E(`Lab ${l.id} étape ${k} : énoncé manquant`);
    if (!Array.isArray(s.options) || s.options.length !== 4) E(`Lab ${l.id} étape ${k} : 4 options requises`);
    if (typeof s.correct !== 'number' || s.correct < 0 || s.correct >= s.options.length) E(`Lab ${l.id} étape ${k} : correct invalide`);
    if (!s.why || s.why.length < 30) E(`Lab ${l.id} étape ${k} : justification trop courte`);
    if (new Set(s.options).size !== s.options.length) E(`Lab ${l.id} étape ${k} : options dupliquées`);
  });
});

// ---- 7. Acronymes & ports ----
App.ACRONYMS.forEach((a, i) => {
  if (!a.a || !a.f) E(`Acronyme ${i} incomplet`);
  if (!App.ACRONYM_CATS.includes(a.c)) E(`Acronyme ${a.a} : catégorie inconnue ${a.c}`);
});
App.PORTS.forEach((p, i) => {
  if (!p.port || !p.name || !p.proto || !p.desc) E(`Port ${i} incomplet`);
});
// Le trainer de ports tire 3 leurres : il faut au moins 4 ports distincts
if (App.PORTS.length < 4) E('Pas assez de ports pour le mode entraînement');
App.ACRONYM_CATS.forEach(c => {
  const n = App.ACRONYMS.filter(a => a.c === c).length;
  if (n < 4) warn.push(`Catégorie d'acronymes « ${c} » : seulement ${n} entrées (leurres limités)`);
});

// ---- 8. Fonctions utilitaires ----
const U = App.util;
if (U.norm('Confidentialité') !== 'confidentialite') E(`norm() ne retire pas les accents : "${U.norm('Confidentialité')}"`);
if (U.norm('  A-B_C  ') !== 'a b c') E(`norm() ponctuation : "${U.norm('  A-B_C  ')}"`);
if (U.esc('<script>') !== '&lt;script&gt;') E('esc() n\'échappe pas le HTML');
if (U.rich('a **b** c') !== 'a <strong>b</strong> c') E('rich() ne gère pas le gras');
if (U.pct(1, 4) !== 25) E('pct() incorrect');
if (U.mmss(90) !== '01:30') E('mmss() incorrect');
if (U.daysBetween('2026-01-01', '2026-01-03') !== 2) E('daysBetween() incorrect');
if (U.shuffle([1,2,3]).length !== 3) E('shuffle() perd des éléments');
if (U.sample([1,2,3], 10).length !== 3) E('sample() dépasse la taille du tableau');

// ---- 9. Générateur de risque : cohérence mathématique ----
for (let i = 0; i < 300; i++) {
  const p = App.riskProblem();
  if (Math.abs(p.sle - p.av * p.ef) > 0.01) E('riskProblem : SLE ≠ AV × EF');
  if (Math.abs(p.ale - p.sle * p.aro) > 0.01) E('riskProblem : ALE ≠ SLE × ARO');
  if (Math.abs(p.aro - 1 / p.years) > 1e-9) E('riskProblem : ARO ≠ 1/années');
  if (p.questions.length !== 3) E('riskProblem : 3 questions attendues');
  if (/undefined|NaN/.test(p.text)) E('riskProblem : énoncé mal formé -> ' + p.text);
}

// ---- 10. SRS : progression des intervalles ----
const srs = App.srs;
const id = srs.cardId(1, 0);
if (!srs.isDue(id)) E('Une carte jamais vue doit être due');
srs.grade(id, 3); srs.grade(id, 3); srs.grade(id, 3);
const e1 = srs.entry(id);
if (e1.interval < 4) E(`SRS : après 3 « facile », intervalle trop court (${e1.interval})`);
if (srs.isDue(id)) E('SRS : carte notée facile ne doit plus être due aujourd\'hui');
srs.grade(id, 0);
const e2 = srs.entry(id);
if (e2.reps !== 0) E('SRS : un oubli doit réinitialiser les répétitions');
if (e2.ease >= e1.ease) E('SRS : un oubli doit réduire la facilité');
if (!srs.isDue(id)) E('SRS : carte oubliée doit redevenir due immédiatement');
// L'intervalle ne doit jamais exploser ni devenir négatif
const id2 = srs.cardId(2, 0);
for (let i = 0; i < 40; i++) srs.grade(id2, 3);
const e3 = srs.entry(id2);
if (e3.interval > 365 || e3.interval < 1) E(`SRS : intervalle hors bornes (${e3.interval})`);

// ---- 11. Store : calcul de progression borné ----
const S = App.store;
App.SECTIONS.forEach(s => {
  const p = S.sectionProgress(s.id);
  if (typeof p !== 'number' || isNaN(p) || p < 0 || p > 100) E(`sectionProgress(${s.id}) hors bornes : ${p}`);
});
const g = S.globalProgress();
if (isNaN(g) || g < 0 || g > 100) E(`globalProgress hors bornes : ${g}`);

// Round-trip export/import
const snapshot = S.export();
S.reset();
S.import(snapshot);
if (S.export().length < 50) E('Import/export : perte de données');

// ---- Rapport ----
console.log('═'.repeat(62));
console.log(`  Sections .......... ${App.SECTIONS.length}`);
console.log(`  Flashcards ........ ${nCards}`);
console.log(`  Questions QCM ..... ${nQ}`);
console.log(`  Exercices ......... ${nD}`);
console.log(`  Labs PBQ .......... ${App.LABS.length} (${App.LABS.reduce((a, l) => a + l.steps.length, 0)} étapes)`);
console.log(`  Acronymes ......... ${App.ACRONYMS.length}`);
console.log(`  Ports ............. ${App.PORTS.length}`);
console.log(`  Questions/domaine . ${App.DOMAINS.map(d => d.id + ':' + perDom[d.id]).join('  ')}`);
console.log('═'.repeat(62));
if (warn.length) { console.log('\nAVERTISSEMENTS :'); warn.forEach(w => console.log('  ~ ' + w)); }
if (errors.length) {
  console.log(`\n❌ ${errors.length} ERREUR(S) :`);
  errors.forEach(e => console.log('  • ' + e));
  process.exit(1);
}
console.log('\n✅ Intégrité validée : aucune erreur.');
