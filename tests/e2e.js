/* Tests navigateur end-to-end : chaque vue, chaque interaction */
const { chromium } = require('playwright');
const path = require('path');
const BASE = 'file://' + path.join(__dirname, '..', 'index.html');

const results = [];
const errors = [];
let page;

function ok(name) { results.push('✓ ' + name); }
function fail(name, detail) { results.push('✗ ' + name); errors.push(name + (detail ? ' → ' + detail : '')); }

async function check(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (e) {
    fail(name, e.message.split('\n')[0]);
  }
}

async function goto(hash) {
  await page.goto(BASE + '#' + hash, { waitUntil: 'load' });
  await page.waitForFunction(() => document.getElementById('view') && document.getElementById('view').children.length > 0, { timeout: 6000 });
  await page.waitForTimeout(120);
}

/** Navigue vers une route en forçant le rendu même si le hash est déjà celui-ci. */
async function nav(hash) {
  await page.evaluate(h => {
    if (location.hash === '#' + h) { location.hash = '#/__reset__'; }
    location.hash = h;
  }, hash);
  await page.waitForTimeout(320);
}

/** Après un reload, le splash reste quelques centaines de ms et intercepte les clics. */
async function settle() {
  await page.waitForSelector('#boot', { state: 'detached', timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(150);
}

/** Ouvre directement l'exercice d'un type donné dans une section. */
async function openDrill(section, type) {
  const found = await page.evaluate(([s, t]) => {
    const list = window.App.DRILLS[s] || [];
    const idx = list.findIndex(d => d.type === t);
    if (idx < 0) return false;
    // Place l'exercice voulu en tête pour que la vue l'affiche en premier.
    const copy = list.slice();
    const [d] = copy.splice(idx, 1);
    const original = window.App.DRILLS[s];
    window.App.DRILLS[s] = [d].concat(copy);
    const v = document.getElementById('view');
    v.innerHTML = '';
    v.appendChild(window.App.views.drills(String(s)));
    window.App.DRILLS[s] = original;
    return true;
  }, [section, type]);
  if (!found) throw new Error(`aucun exercice de type ${type} en section ${section}`);
  await page.waitForTimeout(200);
}

/** La vue ne doit jamais être vide ni afficher l'écran d'erreur de secours. */
async function assertRendered(label) {
  const txt = await page.textContent('#view');
  if (!txt || txt.trim().length < 40) throw new Error(`vue quasi vide (${(txt || '').length} car.)`);
  if (txt.includes('Une erreur est survenue')) throw new Error('écran d\'erreur affiché');
  if (txt.includes('Page introuvable')) throw new Error('route non reconnue');
  if (/undefined|NaN|\[object Object\]/.test(txt)) {
    const m = txt.match(/.{0,50}(undefined|NaN|\[object Object\]).{0,50}/);
    throw new Error('valeur mal formée : ' + (m ? m[0].trim() : ''));
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));

  /* ---------------- 1. Démarrage ---------------- */
  await check('Chargement initial et disparition du splash', async () => {
    await goto('/');
    await page.waitForSelector('#boot', { state: 'detached', timeout: 5000 });
    if (await page.locator('#topbar').isHidden()) throw new Error('barre supérieure masquée');
    if (await page.locator('#sidebar').isHidden()) throw new Error('sidebar masquée');
    await assertRendered();
  });

  await check('Le tableau de bord affiche les compteurs', async () => {
    const t = await page.textContent('#view');
    ['Progression globale', 'Révision du jour', 'Série en cours'].forEach(s => {
      if (!t.includes(s)) throw new Error('bloc manquant : ' + s);
    });
  });

  /* ---------------- 2. Toutes les routes statiques ---------------- */
  for (const [hash, label] of [
    ['/parcours', 'Parcours'], ['/acronymes', 'Acronymes'], ['/ports', 'Ports'],
    ['/formules', 'Formules'], ['/objectifs', 'Objectifs'], ['/stats', 'Statistiques'],
    ['/labs', 'Labs'], ['/exam', 'Examen (accueil)'], ['/revision', 'Révision du jour'],
  ]) {
    await check('Route ' + label, async () => { await nav(hash); await assertRendered(label); });
  }

  /* ---------------- 3. Les 28 sections ---------------- */
  await check('Les 28 pages de section se rendent', async () => {
    for (let i = 1; i <= 28; i++) {
      await nav('/section/' + i);
      await assertRendered('section ' + i);
      const t = await page.textContent('#view');
      if (!t.includes('Points clés à mémoriser')) throw new Error(`section ${i} : points clés absents`);
      if (!t.includes('Leçons de cette section')) throw new Error(`section ${i} : leçons absentes`);
    }
  });

  /* ---------------- 4. Flashcards + SRS ---------------- */
  await check('Flashcards : retournement et notation', async () => {
    await nav('/flash/2');
    await assertRendered();
    const before = await page.textContent('#fcCount');
    await page.click('#showBtn');
    await page.waitForTimeout(200);
    if (!(await page.locator('.fc.is-flipped').count())) throw new Error('la carte ne se retourne pas');
    if (!(await page.locator('.fcgrade').count())) throw new Error('boutons de notation absents');
    await page.click('.fcgrade .g2');
    await page.waitForTimeout(250);
    const after = await page.textContent('#fcCount');
    if (before === after) throw new Error('pas de passage à la carte suivante');
  });

  await check('Flashcards : la note est bien persistée', async () => {
    const n = await page.evaluate(() => Object.keys(window.App.store.data.srs).length);
    if (n < 1) throw new Error('aucune entrée SRS enregistrée');
  });

  await check('Flashcards : « Oublié » remet la carte dans le paquet', async () => {
    await nav('/flash/3');
    const total = await page.evaluate(() => document.getElementById('fcCount').textContent.split('/')[1].trim());
    await page.click('#showBtn');
    await page.click('.fcgrade .g0');
    await page.waitForTimeout(250);
    const total2 = await page.evaluate(() => document.getElementById('fcCount').textContent.split('/')[1].trim());
    if (Number(total2) !== Number(total) + 1) throw new Error(`paquet non rallongé (${total} → ${total2})`);
  });

  await check('Flashcards : raccourcis clavier (Espace puis 3)', async () => {
    await nav('/flash/4');
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    if (!(await page.locator('.fc.is-flipped').count())) throw new Error('Espace ne retourne pas la carte');
    await page.keyboard.press('3');
    await page.waitForTimeout(250);
    if (await page.locator('.fc.is-flipped').count()) throw new Error('la touche 3 n\'a pas noté la carte');
  });

  await check('Flashcards : session complète jusqu\'au bilan', async () => {
    await nav('/flash/13');
    for (let i = 0; i < 60; i++) {
      if (await page.locator('#againBtn').count()) break;
      const show = page.locator('#showBtn');
      if (await show.count()) { await show.click(); await page.waitForTimeout(60); }
      const g = page.locator('.fcgrade .g3');
      if (await g.count()) { await g.click(); await page.waitForTimeout(90); }
    }
    if (!(await page.locator('#againBtn').count())) throw new Error('bilan de fin non atteint');
    const t = await page.textContent('#view');
    if (!t.includes('Session terminée')) throw new Error('écran de fin incorrect');
  });

  /* ---------------- 5. Quiz ---------------- */
  await check('Quiz : réponse, correction et explication', async () => {
    await nav('/quiz/2');
    await assertRendered();
    await page.click('.qopt >> nth=0');
    await page.waitForTimeout(220);
    if (!(await page.locator('.qfeed').count())) throw new Error('pas de retour après réponse');
    if (!(await page.locator('.qopt.is-correct').count())) throw new Error('bonne réponse non signalée');
    const disabled = await page.locator('.qopt >> nth=1').isDisabled();
    if (!disabled) throw new Error('options encore cliquables après réponse');
  });

  await check('Quiz : un second clic ne change pas la réponse', async () => {
    const before = await page.locator('.qopt.is-wrong').count();
    await page.locator('.qopt >> nth=2').click({ force: true }).catch(() => {});
    await page.waitForTimeout(150);
    const after = await page.locator('.qopt.is-wrong').count();
    if (after > before + 0) throw new Error('l\'état a changé après verrouillage');
  });

  await check('Quiz : parcours complet jusqu\'au score', async () => {
    await nav('/quiz/13');
    for (let i = 0; i < 40; i++) {
      if (await page.locator('#retryBtn').count()) break;
      const opt = page.locator('.qopt:not([disabled])').first();
      if (await opt.count()) { await opt.click(); await page.waitForTimeout(120); }
      const next = page.locator('#nextBtn');
      if (await next.count()) { await next.click(); await page.waitForTimeout(120); }
    }
    if (!(await page.locator('#retryBtn').count())) throw new Error('écran de résultat non atteint');
    const t = await page.textContent('#view');
    if (!/bonnes réponses sur/.test(t)) throw new Error('score non affiché');
  });

  await check('Quiz : le meilleur score est enregistré sur la section', async () => {
    const best = await page.evaluate(() => window.App.store.section(13).quizBest);
    if (typeof best !== 'number' || best < 0 || best > 100) throw new Error('quizBest invalide : ' + best);
  });

  await check('Quiz « mes erreurs » se rend sans planter', async () => {
    await nav('/quiz/weak');
    await assertRendered();
  });

  /* ---------------- 6. Exercices : les 4 types ---------------- */
  await check('Exercice ASSOCIATION : appariement correct', async () => {
    await nav('/drills/8');
    await openDrill(8, 'match');
    await page.waitForSelector('.mitem', { timeout: 4000 });
    const pairs = await page.evaluate(() => window.App.DRILLS[8].find(x => x.type === 'match').pairs.length);
    for (let k = 0; k < pairs; k++) {
      const left = page.locator('.mitem[data-side="l"]:not([disabled])').first();
      const key = await left.getAttribute('data-key');
      await left.click();
      await page.locator(`.mitem[data-side="r"][data-key="${key}"]`).click();
      await page.waitForTimeout(80);
    }
    const okCount = await page.locator('.mitem.is-ok').count();
    if (okCount !== pairs * 2) throw new Error(`${okCount}/${pairs * 2} éléments validés`);
    const hint = await page.textContent('#mHint');
    if (!hint.includes('Sans faute')) throw new Error('message de succès absent : ' + hint);
  });

  await check('Exercice ASSOCIATION : une erreur est signalée', async () => {
    await nav('/drills/3');
    await openDrill(3, 'match');
    await page.waitForSelector('.mitem', { timeout: 4000 });
    const l0 = page.locator('.mitem[data-side="l"]').first();
    const k0 = await l0.getAttribute('data-key');
    const wrong = page.locator(`.mitem[data-side="r"]:not([data-key="${k0}"])`).first();
    await l0.click();
    await wrong.click();
    await page.waitForTimeout(150);
    const hint = await page.textContent('#mHint');
    if (!/pas la bonne/.test(hint)) throw new Error('erreur non signalée : ' + hint);
  });

  await check('Exercice TRI : classement au clic et vérification', async () => {
    await nav('/drills/2');
    await openDrill(2, 'sort');
    await page.waitForSelector('.stoken', { timeout: 4000 });
    // Place chaque étiquette dans sa vraie catégorie via le modèle de données
    const plan = await page.evaluate(() => {
      const d = window.App.DRILLS[2].find(x => x.type === 'sort');
      const bins = Object.keys(d.bins);
      return [...document.querySelectorAll('.stoken')].map(el => {
        const txt = el.textContent;
        const bin = bins.findIndex(b => d.bins[b].includes(txt));
        return { i: el.getAttribute('data-i'), bin };
      });
    });
    for (const p of plan) {
      if (p.bin < 0) throw new Error('étiquette sans catégorie connue');
      await page.locator(`.stoken[data-i="${p.i}"]`).click();
      await page.locator(`.sortbin[data-bin="${p.bin}"]`).click();
      await page.waitForTimeout(40);
    }
    if (await page.locator('#checkBtn').isDisabled()) throw new Error('bouton Vérifier resté désactivé');
    await page.click('#checkBtn');
    await page.waitForTimeout(200);
    const hint = await page.textContent('#sHint');
    if (!/Classement parfait/.test(hint)) throw new Error('classement non validé : ' + hint);
    const ko = await page.locator('.stoken.is-ko').count();
    if (ko !== 0) throw new Error(ko + ' étiquettes marquées fausses à tort');
  });

  await check('Exercice TRI : réinitialisation renvoie tout au pool', async () => {
    await nav('/drills/4');
    await openDrill(4, 'sort');
    await page.waitForSelector('.stoken', { timeout: 4000 }).catch(() => {});
    if (await page.locator('.stoken').count()) {
      const total = await page.locator('#pool .stoken').count();
      await page.locator('.stoken').first().click();
      await page.locator('.sortbin').first().click();
      await page.waitForTimeout(80);
      await page.click('#resetBtn');
      await page.waitForTimeout(80);
      const back = await page.locator('#pool .stoken').count();
      if (back !== total) throw new Error(`${back}/${total} étiquettes revenues au pool`);
    }
  });

  await check('Exercice ORDRE : réordonnancement et vérification', async () => {
    await nav('/drills/24');
    await openDrill(24, 'order');
    await page.waitForSelector('.oitem', { timeout: 4000 });
    // Remet dans l'ordre correct via les boutons monter
    const target = await page.evaluate(() => window.App.DRILLS[24].find(x => x.type === 'order').steps);
    for (let pos = 0; pos < target.length; pos++) {
      for (let guard = 0; guard < 15; guard++) {
        const cur = await page.evaluate(() => [...document.querySelectorAll('.oitem__t')].map(e => e.textContent));
        const at = cur.indexOf(target[pos]);
        if (at === pos) break;
        if (at < 0) throw new Error('étape introuvable : ' + target[pos]);
        await page.locator(`.oitem[data-i="${at}"] [data-mv="up"]`).click();
        await page.waitForTimeout(40);
      }
    }
    await page.click('#checkBtn');
    await page.waitForTimeout(200);
    const hint = await page.textContent('#oHint');
    if (!/Ordre exact/.test(hint)) throw new Error('ordre non validé : ' + hint);
  });

  await check('Exercice TEXTE À TROUS : saisie et correction', async () => {
    await nav('/drills/9');
    await openDrill(9, 'fill');
    await page.waitForSelector('.fillgap', { timeout: 4000 });
    const answers = await page.evaluate(() => {
      const d = window.App.DRILLS[9].find(x => x.type === 'fill');
      return (d.text.match(/\{\{(.+?)\}\}/g) || []).map(g => g.slice(2, -2));
    });
    const inputs = page.locator('.fillgap');
    const n = await inputs.count();
    if (n !== answers.length) throw new Error(`${n} champs pour ${answers.length} réponses`);
    for (let i = 0; i < n; i++) await inputs.nth(i).fill(answers[i]);
    await page.click('#checkBtn');
    await page.waitForTimeout(200);
    const hint = await page.textContent('#fHint');
    if (!/exactes/.test(hint)) throw new Error('réponses non validées : ' + hint);
  });

  await check('Texte à trous : tolérance aux accents et à la casse', async () => {
    const okNorm = await page.evaluate(() => {
      const U = window.App.util;
      return U.norm('Confidentialité') === U.norm('confidentialite')
          && U.norm('  BEC ') === U.norm('bec');
    });
    if (!okNorm) throw new Error('normalisation trop stricte');
  });

  await check('Exercices : série complète enchaînée', async () => {
    await nav('/drills/28');
    await page.waitForTimeout(200);
    for (let i = 0; i < 25; i++) {
      if (await page.locator('#againBtn').count()) break;
      const check = page.locator('#checkBtn:not([disabled])');
      if (await check.count()) { await check.click(); await page.waitForTimeout(150); }
      const next = page.locator('.drill .btn--primary', { hasText: /suivant|bilan/i });
      if (await next.count()) { await next.first().click(); await page.waitForTimeout(150); continue; }
      // Exercice d'association : utiliser l'échappatoire prévue pour l'utilisateur
      const giveUp = page.locator('#giveUpBtn:not([disabled])');
      if (await giveUp.count()) { await giveUp.click(); await page.waitForTimeout(120); continue; }
      // Tri : tout déposer dans le premier bac pour permettre la vérification
      const tok = page.locator('#pool .stoken').first();
      if (await tok.count()) {
        await tok.click();
        await page.locator('.sortbin').first().click();
        await page.waitForTimeout(50);
        continue;
      }
      break;
    }
    await assertRendered();
  });

  /* ---------------- 7. Labs PBQ ---------------- */
  await check('Lab PBQ : déroulé complet jusqu\'au bilan', async () => {
    await nav('/labs/lab-ir-ransomware');
    await assertRendered();
    for (let i = 0; i < 20; i++) {
      if (await page.locator('#againBtn').count()) break;
      const opt = page.locator('.qopt:not([disabled])').first();
      if (await opt.count()) { await opt.click(); await page.waitForTimeout(120); }
      const next = page.locator('#nextBtn');
      if (await next.count()) { await next.click(); await page.waitForTimeout(120); }
    }
    if (!(await page.locator('#againBtn').count())) throw new Error('bilan non atteint');
    const done = await page.evaluate(() => window.App.store.labDone('lab-ir-ransomware'));
    if (!done) throw new Error('lab non marqué comme terminé');
  });

  await check('Tous les labs s\'ouvrent sans erreur', async () => {
    const ids = await page.evaluate(() => window.App.LABS.map(l => l.id));
    for (const id of ids) {
      await nav('/labs/' + id);
      await assertRendered('lab ' + id);
      if (!(await page.locator('.qopt').count())) throw new Error(id + ' : aucune option affichée');
    }
  });

  /* ---------------- 8. Examen blanc ---------------- */
  await check('Examen blanc : démarrage, chrono et grille', async () => {
    await nav('/exam');
    await page.click('#startShort');
    await page.waitForSelector('.examtimer', { timeout: 4000 });
    const n = await page.locator('#grid button').count();
    if (n !== 30) throw new Error(`grille de ${n} questions au lieu de 30`);
    const c1 = await page.textContent('#clock');
    await page.waitForTimeout(1400);
    const c2 = await page.textContent('#clock');
    if (c1 === c2) throw new Error('le chronomètre ne décompte pas');
  });

  await check('Examen : répondre met à jour la grille', async () => {
    await page.locator('.qopt').first().click();
    await page.waitForTimeout(350);
    if (!(await page.locator('#grid button.is-done').count())) throw new Error('grille non mise à jour');
  });

  await check('Examen : marquage d\'une question', async () => {
    await page.click('#flagBtn');
    await page.waitForTimeout(200);
    if (!(await page.locator('#grid button.is-flag').count())) throw new Error('marquage non reflété');
    await page.click('#flagBtn');
    await page.waitForTimeout(150);
  });

  await check('Examen : navigation via la grille', async () => {
    await page.locator('#grid button').nth(9).click();
    await page.waitForTimeout(250);
    const t = await page.textContent('#progTxt');
    if (!t.includes('Question 10')) throw new Error('navigation incorrecte : ' + t);
  });

  await check('Examen : soumission, score et correction détaillée', async () => {
    for (let i = 0; i < 30; i++) {
      const opt = page.locator('.qopt:not([disabled])').first();
      if (await opt.count()) { await opt.click(); await page.waitForTimeout(220); }
    }
    await page.click('#submitBtn');
    await page.waitForTimeout(300);
    const yes = page.locator('[data-yes]');
    if (await yes.count()) await yes.click();
    await page.waitForSelector('.scorehero', { timeout: 5000 });
    const score = Number(await page.textContent('.scorehero__v'));
    if (isNaN(score) || score < 100 || score > 900) throw new Error('score hors échelle : ' + score);
    const t = await page.textContent('#view');
    if (!t.includes('Résultat par domaine')) throw new Error('ventilation par domaine absente');
    if (await page.locator('.examtimer').count()) throw new Error('chronomètre encore affiché après soumission');
    const saved = await page.evaluate(() => window.App.store.data.exams.length);
    if (saved < 1) throw new Error('examen non enregistré dans l\'historique');
  });

  await check('Examen : le chrono est bien arrêté après changement de vue', async () => {
    await nav('/');
    const before = await page.evaluate(() => window.App.store.data.exams.length);
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => window.App.store.data.exams.length);
    if (before !== after) throw new Error('un timer résiduel a soumis un examen fantôme');
  });

  await check('Examen : pondération conforme aux poids officiels', async () => {
    const dist = await page.evaluate(() => {
      const all = window.App.allQuestions();
      const byDom = {};
      all.forEach(i => {
        const s = window.App.SECTION_BY_ID[i.section];
        byDom[s.domain] = (byDom[s.domain] || 0) + 1;
      });
      return byDom;
    });
    for (const d of [['1.0', 11], ['2.0', 20], ['3.0', 16], ['4.0', 25], ['5.0', 18]]) {
      if ((dist[d[0]] || 0) < d[1]) throw new Error(`domaine ${d[0]} : réserve insuffisante`);
    }
  });

  /* ---------------- 9. Entraîneurs acronymes / ports / formules ---------------- */
  await check('Entraîneur d\'acronymes fonctionne', async () => {
    await nav('/acronymes');
    await page.click('#trainBtn');
    await page.waitForSelector('.qopt', { timeout: 4000 });
    await page.locator('.qopt').first().click();
    await page.waitForTimeout(200);
    if (!(await page.locator('.qfeed').count())) throw new Error('pas de correction affichée');
  });

  await check('Entraîneur de ports fonctionne', async () => {
    await nav('/ports');
    await page.click('#trainBtn');
    await page.waitForSelector('.qopt', { timeout: 4000 });
    await page.locator('.qopt').first().click();
    await page.waitForTimeout(200);
    if (!(await page.locator('.qfeed').count())) throw new Error('pas de correction affichée');
  });

  await check('Calcul de risque : réponses exactes acceptées', async () => {
    await nav('/formules');
    await page.waitForSelector('[data-q]', { timeout: 4000 });
    const vals = await page.evaluate(() => {
      // toLocaleString('fr-FR') insère des espaces insécables : on les neutralise tous.
      const t = document.querySelector('#fHost .lead').textContent.replace(/[   ]/g, ' ');
      const av = Number(t.match(/estimée à ([\d ]+) €/)[1].replace(/\s/g, ''));
      const ef = Number(t.match(/que ([\d]+) %/)[1]) / 100;
      const years = Number(t.match(/tous les (\d+) ans/)[1]);
      const sle = av * ef, aro = 1 / years;
      return [sle, aro, sle * aro];
    });
    const inputs = page.locator('[data-q]');
    await inputs.nth(0).fill(String(vals[0]));
    await inputs.nth(1).fill(vals[1].toFixed(4));
    await inputs.nth(2).fill(vals[2].toFixed(2));
    await page.click('#checkBtn');
    await page.waitForTimeout(220);
    const t = await page.textContent('#fFeed');
    if (!/trois calculs sont exacts/.test(t)) throw new Error('calculs corrects refusés : ' + t.slice(0, 120));
  });

  await check('Calcul de risque : format « 1 234,56 € » accepté', async () => {
    await page.click('#newBtn');
    await page.waitForTimeout(200);
    const vals = await page.evaluate(() => {
      const t = document.querySelector('#fHost .lead').textContent;
      const mAv = t.match(/([\d\s]+)\s*€/); const mEf = t.match(/(\d+)\s*%/);
      if (!mAv || !mEf) throw new Error('énoncé illisible : ' + t.slice(0, 160));
      const av = Number(mAv[1].replace(/\s/g, ''));
      const ef = Number(mEf[1]) / 100;
      const years = Number(t.match(/tous les (\d+) ans/)[1]);
      return [av * ef, 1 / years, av * ef / years];
    });
    const inputs = page.locator('[data-q]');
    await inputs.nth(0).fill(vals[0].toLocaleString('fr-FR') + ' €');
    await inputs.nth(1).fill(vals[1].toFixed(4).replace('.', ','));
    await inputs.nth(2).fill(vals[2].toFixed(2).replace('.', ','));
    await page.click('#checkBtn');
    await page.waitForTimeout(220);
    const t = await page.textContent('#fFeed');
    if (!/trois calculs sont exacts/.test(t)) throw new Error('format français refusé');
  });

  /* ---------------- 10. Recherche, thème, navigation ---------------- */
  await check('Recherche globale trouve un terme', async () => {
    await nav('/');
    await page.keyboard.press('/');
    await page.waitForSelector('#searchModal:not([hidden])', { timeout: 3000 });
    await page.fill('#searchInput', 'zero trust');
    await page.waitForTimeout(320);
    const n = await page.locator('.sres').count();
    if (n === 0) throw new Error('aucun résultat pour « zero trust »');
    await page.locator('.sres').first().click();
    await page.waitForTimeout(300);
    await assertRendered();
  });

  await check('Recherche : navigation clavier et fermeture', async () => {
    await page.keyboard.press('/');
    await page.waitForSelector('#searchModal:not([hidden])', { timeout: 3000 });
    await page.fill('#searchInput', 'RADIUS');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    if (!(await page.locator('.sres.is-cur').count())) throw new Error('surlignage clavier absent');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (await page.locator('#searchModal:not([hidden])').count()) throw new Error('modale non fermée');
  });

  await check('Bascule de thème clair/sombre persistée', async () => {
    const initial = await page.getAttribute('html', 'data-theme');
    await page.click('#themeBtn');
    await page.waitForTimeout(250);
    const toggled = await page.getAttribute('html', 'data-theme');
    if (toggled === initial) throw new Error('le thème n\'a pas basculé (' + initial + ')');
    if (!['light', 'dark'].includes(toggled)) throw new Error('thème invalide : ' + toggled);
    await page.reload({ waitUntil: 'load' });
    await settle();
    const after = await page.getAttribute('html', 'data-theme');
    if (after !== toggled) throw new Error(`choix non conservé après rechargement (${toggled} → ${after})`);
    await page.click('#themeBtn');
    await page.waitForTimeout(250);
  });

  await check('Le thème suit le système tant qu\'aucun choix n\'est fait', async () => {
    const ctx2 = await page.context().browser().newContext({ colorScheme: 'light' });
    const p2 = await ctx2.newPage();
    await p2.goto(BASE + '#/', { waitUntil: 'load' });
    await p2.waitForSelector('#boot', { state: 'detached', timeout: 6000 }).catch(() => {});
    await p2.waitForTimeout(200);
    const t = await p2.getAttribute('html', 'data-theme');
    await ctx2.close();
    if (t !== 'light') throw new Error('préférence système ignorée : ' + t);
  });

  await check('Route inconnue affiche la page « introuvable »', async () => {
    await nav('/nimportequoi/123');
    const t = await page.textContent('#view');
    if (!t.includes('Page introuvable')) throw new Error('pas de gestion 404');
  });

  await check('Section hors bornes gérée proprement', async () => {
    await nav('/section/99');
    const t = await page.textContent('#view');
    if (!t.includes('Section introuvable')) throw new Error('section 99 non gérée');
  });

  await check('Les liens de la sidebar mènent tous à une vue valide', async () => {
    await nav('/');
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('.sidebar a[href^="#/"]')].map(a => a.getAttribute('href')));
    if (hrefs.length < 10) throw new Error('sidebar incomplète');
    for (const h of hrefs) {
      await nav(h.slice(1));
      await assertRendered(h);
    }
  });

  /* ---------------- 11. Persistance ---------------- */
  await check('La progression survit à un rechargement', async () => {
    await nav('/');
    const before = await page.evaluate(() => ({
      srs: Object.keys(window.App.store.data.srs).length,
      exams: window.App.store.data.exams.length,
    }));
    await page.reload({ waitUntil: 'load' });
    await settle();
    const after = await page.evaluate(() => ({
      srs: Object.keys(window.App.store.data.srs).length,
      exams: window.App.store.data.exams.length,
    }));
    if (after.srs !== before.srs || after.exams !== before.exams) {
      throw new Error(`perte de données : ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
    }
  });

  await check('Le store résiste à des données corrompues', async () => {
    await page.evaluate(() => localStorage.setItem('secplus-lab:v1', '{"srs":null,"totals":"cassé"'));
    await page.reload({ waitUntil: 'load' });
    await settle();
    const t = await page.textContent('#view');
    if (!t || t.length < 40) throw new Error('l\'app ne démarre pas après corruption');
    const okStore = await page.evaluate(() => typeof window.App.store.globalProgress() === 'number');
    if (!okStore) throw new Error('store non réinitialisé proprement');
  });

  /* ---------------- 12. Responsive ---------------- */
  await check('Affichage mobile : menu burger fonctionnel', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await nav('/');
    await settle();
    await page.waitForSelector('#burger', { state: 'visible', timeout: 5000 });
    await page.click('#burger');
    await page.waitForTimeout(350);
    if (!(await page.locator('.sidebar.is-open').count())) throw new Error('sidebar ne s\'ouvre pas');
    await page.click('#scrim', { position: { x: 340, y: 500 } });
    await page.waitForTimeout(350);
    if (await page.locator('.sidebar.is-open').count()) throw new Error('sidebar ne se ferme pas');
  });

  await check('Aucun débordement horizontal sur mobile', async () => {
    const routes = ['/', '/parcours', '/section/8', '/quiz/2', '/flash/2', '/drills/2', '/acronymes', '/ports', '/stats', '/labs', '/exam'];
    for (const r of routes) {
      await nav(r);
      await page.waitForTimeout(200);
      const over = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 2) throw new Error(`${r} déborde de ${over}px`);
    }
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  /* ---------------- 13. Sécurité du rendu ---------------- */
  await check('Aucune injection HTML via le contenu', async () => {
    const clean = await page.evaluate(() => {
      const U = window.App.util;
      const s = U.esc('<img src=x onerror=alert(1)>');
      const r = U.rich('<b>x</b> **ok**');
      return !s.includes('<img') && !r.includes('<b>') && r.includes('<strong>');
    });
    if (!clean) throw new Error('échappement HTML défaillant');
  });

  /* ---------------- Bilan ---------------- */
  await browser.close();

  console.log(results.join('\n'));
  console.log('\n' + '═'.repeat(62));
  console.log(`  ${results.filter(r => r[0] === '✓').length} tests réussis, ${errors.length} échec(s)`);
  console.log('═'.repeat(62));

  const realConsoleErrors = consoleErrors.filter(e =>
    !/favicon|net::ERR_FILE_NOT_FOUND.*favicon/i.test(e));
  if (realConsoleErrors.length) {
    console.log('\n⚠ ERREURS CONSOLE :');
    [...new Set(realConsoleErrors)].slice(0, 15).forEach(e => console.log('  • ' + e.slice(0, 200)));
  }
  if (errors.length) {
    console.log('\n❌ ÉCHECS :');
    errors.forEach(e => console.log('  • ' + e));
    process.exit(1);
  }
  if (realConsoleErrors.length) process.exit(1);
  console.log('\n✅ Tous les tests navigateur passent, sans erreur console.');
})().catch(e => { console.error('CRASH DU HARNAIS :', e); process.exit(1); });
