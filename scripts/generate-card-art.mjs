// Generator ilustrasi kartu: menulis public/cards/<id>.svg dan back.svg
// Pemakaian: node scripts/generate-card-art.mjs [--only a,b] [--png] [--sheet nama]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CATALOG } from '../src/data/catalog.js';
import { wrapCard, cardBack } from './art/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const only = opt('--only') ? new Set(opt('--only').split(',')) : null;
const outDir = path.join(root, 'public/cards');
fs.mkdirSync(outDir, { recursive: true });

const sceneDir = path.join(root, 'scripts/art/scenes');
const files = fs.readdirSync(sceneDir).filter((f) => f.endsWith('.mjs')).sort();
const scenes = {};
for (const f of files) Object.assign(scenes, (await import(pathToFileURL(path.join(sceneDir, f)).href)).scenes || {});

fs.writeFileSync(path.join(outDir, 'back.svg'), cardBack());
const made = [];
let total = 0;
for (const card of CATALOG) {
  if (only && !only.has(card.id)) continue;
  if (!scenes[card.id]) { console.log('lewati (belum ada scene):', card.id); continue; }
  const svg = wrapCard(scenes[card.id](), { name: card.name });
  fs.writeFileSync(path.join(outDir, `${card.id}.svg`), svg);
  total += svg.length;
  made.push(card.id);
  if (svg.length > 40000) console.log(`PERINGATAN ${card.id}: ${(svg.length / 1024).toFixed(1)} KB`);
}
console.log(`${made.length} kartu ditulis, total ${(total / 1024).toFixed(0)} KB`);

if (argv.includes('--png') || opt('--sheet')) {
  fs.mkdirSync('/tmp/card-png', { recursive: true });
  for (const id of made) execFileSync('rsvg-convert', ['-w', '300', path.join(outDir, `${id}.svg`), '-o', `/tmp/card-png/${id}.png`]);
  const sheet = opt('--sheet');
  if (sheet) {
    fs.mkdirSync('/tmp/card-sheets', { recursive: true });
    execFileSync('montage', [...made.map((id) => `/tmp/card-png/${id}.png`), '-tile', '6x', '-geometry', '200x347+4+4', '-background', '#222', `/tmp/card-sheets/${sheet}.png`]);
    console.log(`sheet: /tmp/card-sheets/${sheet}.png`);
  }
}
