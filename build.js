#!/usr/bin/env node
/* ============================================================================
   BUILD — assemble le site en un fichier HTML autonome.

   Le site de développement charge une vingtaine de fichiers séparés, ce qui est
   pratique à maintenir mais inadapté à un hébergement mono-fichier. Ce script
   inline le CSS et le JavaScript dans l'ordre déclaré par index.html, sans rien
   transformer d'autre : le code est du JavaScript classique, donc une simple
   concaténation suffit et le résultat est strictement équivalent.

   Usage : node build.js [chemin/de/sortie.html]
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = process.argv[2] || path.join(ROOT, 'dist', 'secplus-lab.html');

function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    console.error(`✗ Fichier introuvable : ${rel}`);
    process.exit(1);
  }
  return fs.readFileSync(p, 'utf8');
}

let html = read('index.html');

// --- CSS ---------------------------------------------------------------
const cssLinks = [...html.matchAll(/[ \t]*<link[^>]*href="([^"]+\.css)"[^>]*>\n?/g)];
cssLinks.forEach(m => {
  const css = read(m[1]);
  html = html.replace(m[0], `<style>\n${css}\n</style>\n`);
});

// --- JavaScript --------------------------------------------------------
// L'ordre de index.html est significatif : les données doivent être définies
// avant le noyau, et le noyau avant les vues.
const scripts = [...html.matchAll(/[ \t]*<script src="([^"]+)"><\/script>\n?/g)];
if (!scripts.length) {
  console.error('✗ Aucun script à inliner : index.html a-t-il changé de format ?');
  process.exit(1);
}

const bundle = scripts
  .map(m => `/* ===== ${m[1]} ===== */\n${read(m[1])}`)
  .join('\n');

// Le premier <script> est remplacé par le bundle complet, les autres retirés.
html = html.replace(scripts[0][0], `<script>\n${bundle}\n</script>\n`);
scripts.slice(1).forEach(m => { html = html.replace(m[0], ''); });

// --- Vérifications -----------------------------------------------------
const leftover = html.match(/<script src=|<link[^>]*\.css/);
if (leftover) {
  console.error(`✗ Référence externe résiduelle : ${leftover[0]}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);

const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`✓ ${path.relative(ROOT, OUT)} — ${kb} Ko`);
console.log(`  ${cssLinks.length} feuille(s) de style et ${scripts.length} scripts inlinés.`);
