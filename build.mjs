// SAWN — production build (no dependencies).
// Validates the scripts and translation coverage, then copies only the
// deployable site into ./dist (source PDFs and the raw logo photo stay out).
import { execFileSync } from 'node:child_process';
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const out = join(root, 'dist');
const fail = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };

// 1. syntax-check every script
for (const f of ['assets/js/i18n.js', 'assets/js/sawn.js']) {
  try { execFileSync(process.execPath, ['--check', join(root, f)], { stdio: 'pipe' }); }
  catch (e) { fail(`${f}: ${e.stderr}`); }
  console.log(`✓ syntax  ${f}`);
}

// 2. translation coverage: every key used in the HTML exists in EN and AR
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'assets/js/i18n.js'), 'utf8'), ctx);
const { STR } = ctx.window.SAWN_I18N;
const html = readFileSync(join(root, 'index.html'), 'utf8');
const keys = [...html.matchAll(/data-i18n(?:-attr)?="([^"]+)"/g)].flatMap((m) => m[1].split(';').map((p) => (p.includes(':') ? p.split(':')[1] : p)));
for (const lang of ['en', 'ar']) {
  const missing = keys.filter((k) => !(k in STR[lang]));
  if (missing.length) fail(`missing ${lang} keys: ${missing.join(', ')}`);
}
const enKeys = Object.keys(STR.en), arKeys = Object.keys(STR.ar);
const diff = enKeys.filter((k) => !arKeys.includes(k)).concat(arKeys.filter((k) => !enKeys.includes(k)));
if (diff.length) fail(`EN/AR key mismatch: ${diff.join(', ')}`);
console.log(`✓ i18n    ${keys.length} keys used, EN/AR complete`);

// 3. every local asset referenced by the HTML exists
const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"?#]+)/g)].map((m) => m[1]);
for (const r of new Set(refs)) { try { statSync(join(root, r)); } catch { fail(`missing asset ${r}`); } }
console.log(`✓ assets  ${new Set(refs).size} referenced files present`);

// 4. emit dist/ with a fresh cache-busting version
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });
const ver = Date.now().toString(36);
writeFileSync(join(out, 'index.html'), html.replace(/\?v=[\w]+/g, `?v=${ver}`));
const size = (dir) => readdirSync(dir, { withFileTypes: true }).reduce((n, d) => n + (d.isDirectory() ? size(join(dir, d.name)) : statSync(join(dir, d.name)).size), 0);
console.log(`✓ dist    ${(size(out) / 1024).toFixed(0)} KB written (v=${ver})`);
