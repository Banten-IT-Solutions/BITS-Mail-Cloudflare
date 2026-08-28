/**
 * Generator wrangler.jsonc dari wrangler.template.jsonc.
 *
 * Sumber nilai ${VAR}:
 *  - lokal : file .env di root project (salin dari .env.example)
 *  - CI    : process.env (diisi GitHub Secrets oleh workflow)
 *
 * Dipakai oleh `pnpm cf:config` — dipanggil otomatis sebelum dev/build/deploy.
 * Mendukung dua bentuk placeholder:
 *  - "${VAR}" → string (JSON-escaped, tetap dengan tanda kutip)
 *  - ${VAR}   → raw JSON (array/boolean/number) — nilai disisipkan apa adanya jika valid JSON, fallback ke string
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REQUIRED = [
  'WORKER_NAME',
  'WORKER_DOMAIN',
  'D1_DATABASE_NAME',
  'D1_DATABASE_ID',
  'KV_NAMESPACE_ID',
  'DEFAULT_DOMAINS',
  'DOMAINS',
];

// 1. Kumpulkan env: process.env + .env (lokal)
const env = { ...process.env };
const envPath = resolve('.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let v = m[2].trim();
      // strip surrounding quotes if any
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      // only set if not already in process.env (process.env wins in CI)
      if (!(m[1] in env) || !env[m[1]]) {
        env[m[1]] = v;
      }
    }
  }
}

// Also load .dev.vars if exists (fallback for secrets lokal)
const devVarsPath = resolve('.dev.vars');
if (existsSync(devVarsPath)) {
  for (const line of readFileSync(devVarsPath, 'utf8').split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in env)) {
      let v = m[2].trim().replace(/^["']|["']$/g, '');
      env[m[1]] = v;
    }
  }
}

// 2. Validasi kelengkapan — gagal cepat dengan pesan jelas
const missing = REQUIRED.filter(k => !env[k]);
if (missing.length > 0) {
  console.error(
    `✗ Variabel konfigurasi belum diset: ${missing.join(', ')}\n` +
      '  Lokal : salin .env.example ke .env lalu isi nilainya.\n' +
      '  CI    : isi GitHub Secrets di Settings → Secrets and variables → Actions.\n' +
      '  Lihat .env.example untuk daftar lengkap.'
  );
  process.exit(1);
}

// 3. Baca template dan substitusi
const templatePath = resolve('wrangler.template.jsonc');
if (!existsSync(templatePath)) {
  console.error(`✗ Template tidak ditemukan: ${templatePath}`);
  process.exit(1);
}
let template = readFileSync(templatePath, 'utf8');

// Helper: is JSON-like raw value?
function isJsonRaw(v) {
  if (v === 'true' || v === 'false' || v === 'null') return true;
  if (/^-?\d+(\.\d+)?$/.test(v)) return true;
  if ((v.startsWith('[') && v.endsWith(']')) || (v.startsWith('{') && v.endsWith('}'))) {
    try {
      JSON.parse(v);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

// Step A: replace quoted placeholders "${VAR}" → JSON.stringify(value) (with quotes)
let output = template.replace(/"\$\{([A-Za-z0-9_]+)\}"/g, (_, key) => {
  const value = env[key];
  if (value === undefined) {
    console.error(`✗ Variabel \${${key}} kosong di environment (quoted)`);
    process.exit(1);
  }
  return JSON.stringify(value);
});

// Step B: replace raw placeholders ${VAR} (without quotes) → raw JSON if valid, else string
output = output.replace(/\$\{([A-Za-z0-9_]+)\}/g, (_, key) => {
  const value = env[key];
  if (value === undefined) {
    console.error(`✗ Variabel \${${key}} kosong di environment (raw)`);
    process.exit(1);
  }
  if (isJsonRaw(value)) return value;
  // fallback: treat as string but without extra quotes (template raw tapi value bukan JSON)
  return JSON.stringify(value);
});

writeFileSync('wrangler.jsonc', output);

// 4. Safety net: placeholder tersisa = typo nama variabel
const leftover = output.match(/\$\{[A-Za-z0-9_]+\}/g);
if (leftover) {
  console.error(`✗ Placeholder belum tersubstitusi: ${leftover.join(', ')}`);
  process.exit(1);
}

console.log('✓ wrangler.jsonc digenerate dari wrangler.template.jsonc');
console.log(`  Worker: ${env.WORKER_NAME} @ ${env.WORKER_DOMAIN}`);
