<div align="center">
  <h1>BITS Mail Cloudflare</h1>
  <p>
    Temporary email platform built on Cloudflare Workers — fully dynamic configuration.
  </p>
  <p>
    <img src="https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
    <img src="https://img.shields.io/badge/Cloudflare%20D1-F38020?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare D1" />
    <img src="https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white" alt="Hono" />
    <img src="https://img.shields.io/badge/Vue%203-4FC08D?style=flat&logo=vue.js&logoColor=white" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat" alt="MIT License" />
  </p>
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Single Worker Deployment** | One Cloudflare Worker (`bits-mail-cloudflare`) serves API and frontend assets through `[assets]` binding |
| **Temporary Mailboxes** | Create and manage disposable email addresses with multiple domains |
| **Fast Email Parsing** | Client-side `mail-parser-wasm` plus server-side `PostalMime` fallback |
| **User Accounts** | Register, login, and manage mailbox access with JWT |
| **Address Passwords** | Optional password-protected mailboxes |
| **Auto Reply & Forwarding** | Configure auto-reply, forward rules, and email filters |
| **Telegram Integration** | Push incoming mail to Telegram and manage mailboxes from bot flows |
| **Workers AI Extraction** | Extract verification codes and key links from email content |
| **Admin Console** | Manage domains, users, quotas, settings, and cleanup tasks |
| **Cloudflare Native** | Built for Workers, D1, KV, Turnstile, and Email Routing |
| **Dynamic Configuration** | Uses `wrangler.template.jsonc` + `pnpm cf:config` to inject `${VAR}` from `.env`/`GitHub Secrets`; no environment values committed |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vue 3, Naive UI, Vite, TypeScript — SPA di `frontend/` |
| **Backend** | Cloudflare Workers, Hono, D1 (SQLite), KV — di `worker/` |
| **Build** | pnpm workspace monorepo, root `vite.config.ts` + `@cloudflare/vite-plugin` unified dev |
| **Mail Processing** | `mail-parser-wasm` (client), `PostalMime` (server) |
| **Integrations** | Telegram Bot, Workers AI, Turnstile, S3-compatible storage |
| **Tooling** | Wrangler 4, pnpm 10, ESLint, `scripts/gen-wrangler.mjs` |

---

## 📁 Project Structure

```text
BITS-Mail-Cloudflare/
├── .github/
│   └── workflows/
│       └── deploy.yaml       # workflow_dispatch only, pnpm cf:config, secret bulk
├── frontend/                 # Vue 3 SPA (package: bits-mail-cloudflare-frontend)
├── worker/                   # Cloudflare Worker API + asset hosting (bits-mail-cloudflare-worker)
├── scripts/
│   └── gen-wrangler.mjs      # generator: .env/secrets → wrangler.jsonc
├── wrangler.template.jsonc    # template dengan ${VAR} (jangan deploy)
├── .env.example               # contoh vars lokal
├── .dev.vars.example          # contoh secrets lokal
├── pnpm-workspace.yaml        # pnpm workspace: frontend + worker
├── package.json               # root orchestrator (cf:config, build, deploy)
├── vite.config.ts             # root Vite: unified dev SPA + Worker via cloudflare plugin
├── tsconfig.json
├── LICENSE
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- [Cloudflare account](https://dash.cloudflare.com)
- Cloudflare D1 database (nama `bits-mail-cloudflare`)
- Cloudflare KV namespace (nama `bits-mail-cloudflare`)
- Optional: Turnstile, Telegram bot, Workers AI, Email Routing, Resend API key

### 1. Clone

```bash
git clone https://github.com/Banten-IT-Solutions/BITS-Mail-Cloudflare.git
cd BITS-Mail-Cloudflare
```

### 2. Install (workspace)

```bash
pnpm install
```

### 3. Configure

Salin contoh lalu edit nilainya:

```bash
cp .env.example .env          # vars: WORKER_NAME, D1_*, KV_*, DOMAINS, dsb.
cp .dev.vars.example .dev.vars  # secrets lokal: JWT_SECRET, ADMIN_PASSWORD, dsb.

# Edit .env — isi minimal:
#   WORKER_NAME, WORKER_DOMAIN, D1_DATABASE_ID, KV_NAMESPACE_ID
#   DEFAULT_DOMAINS=["yourdomain.com"], DOMAINS=["yourdomain.com"]

# Generate config (validasi REQUIRED + ganti ${VAR})
pnpm cf:config
```

Ini akan menghasilkan `wrangler.jsonc` (gitignored) yang dipakai oleh `wrangler dev`/`wrangler deploy`.

### 4. Dev

Perintah ini otomatis jalankan `pnpm cf:config` dulu:

```bash
pnpm dev          # Vite SPA + cloudflare dev (unified, HMR)
pnpm dev:worker   # hanya Worker
```

### 5. Deploy

```bash
pnpm deploy
```

> Deploy otomatis via GitHub Actions: `Actions → Deploy → Run workflow` (workflow_dispatch).

---

## 💻 Development

### Commands

| Command | Description |
|---------|-------------|
| `pnpm cf:config` | Generate `wrangler.jsonc` dari `.env`/secrets |
| `pnpm dev` | Start unified Vite dev (SPA + Workers via `@cloudflare/vite-plugin`) |
| `pnpm dev:frontend` | Dev frontend saja |
| `pnpm dev:worker` | Dev worker saja (`wrangler dev --config wrangler.jsonc`) |
| `pnpm build` | `cf:config` → build frontend → bundle worker |
| `pnpm deploy` | Deploy ke Cloudflare |
| `pnpm cf:typegen` | Generate `@cloudflare/workers-types` bindings |
| `pnpm check` | Lint worker + test frontend |
| `pnpm db:init:local` | Init/test D1 local |

### Workspace notes

- `frontend/` & `worker/` adalah package workspace terpisah di `pnpm-workspace.yaml`
- Shared deps (vite, vue plugin, wrangler) diletakkan di **root** `package.json`
- `pnpm.patchedDependencies` untuk `telegraf@4.16.3` ada di `pnpm-workspace.yaml` (pnpm 10)

---

## ⚙️ Configuration (Dinamis)

### Konfigurasi dinamis

Tidak ada ID database, nama bucket, atau domain yang di-commit. Semua nilai dijalankan via `scripts/gen-wrangler.mjs` → `wrangler.jsonc`:

```
wrangler.template.jsonc (di-commit, placeholder ${VAR})
        │  pnpm cf:config
        ▼
wrangler.jsonc            ← generated, ter-gitignore
        ▲
        ├─ lokal : file .env (salin dari .env.example)
        └─ CI    : GitHub Secrets/Variables
```

### Nilai wajib di `.env` (`.env.example`)

| Variabel | Contoh | Catatan |
|----------|--------|---------|
| `WORKER_NAME` | `bits-mail-cloudflare` | Nama Worker di Cloudflare |
| `WORKER_DOMAIN` | `mail.yourdomain.com` | Custom domain Worker |
| `D1_DATABASE_NAME` | `bits-mail-cloudflare` | Nama database D1 |
| `D1_DATABASE_ID` | `your-d1-database-id` | Dari output `wrangler d1 create` |
| `KV_NAMESPACE_ID` | `your-kv-namespace-id` | Dari output `wrangler kv namespace create` |
| `DEFAULT_DOMAINS` | `["yourdomain.com"]` | JSON array string |
| `DOMAINS` | `["yourdomain.com"]` | JSON array string |

Nilai opsional di `.env` (bisa kosong, pakai default worker):

| Variabel | Contoh |
|----------|--------|
| `ADDRESS_PREFIX` | `tmp` |
| `DEFAULT_LANG` | `en` |
| `WORKER_TITLE` | `BITS Mail Cloudflare` |
| `FRONTEND_URL` | `https://mail.yourdomain.com` |
| `ENABLE_USER_CREATE_EMAIL` | `true` |
| `DISABLE_ANONYMOUS_USER_CREATE_EMAIL` | `true` |
| `ENABLE_USER_DELETE_EMAIL` | `true` |
| `ENABLE_AI_EMAIL_EXTRACT` | `false` |
| `AI_EXTRACT_MODEL` | `@cf/meta/llama-3.1-8b-instruct` |
| `CF_TURNSTILE_SITE_KEY` | `0x4AAAA…` |

### Secrets (lokal via `.dev.vars`, produksi via GitHub Secrets)

| Secret | Di mana |
|--------|---------|
| `JWT_SECRET` | `.dev.vars` / GitHub Secrets |
| `ADMIN_PASSWORD` | `.dev.vars` / GitHub Secrets |
| `ADMIN_PASSWORDS` | opsional JSON array |
| `CF_TURNSTILE_SECRET_KEY` | `.dev.vars` / GitHub Secrets |
| `TG_BOT_INFO` | opsional JSON `{"token":"...","username":"..."}` |
| `TELEGRAM_BOT_TOKEN` | opsional — token bot Telegram (alternatif `TG_BOT_INFO`) |
| `RESEND_TOKEN` | opsional — fallback kirim ke arbitrary klien |
| `SMTP_CONFIG` | opsional — JSON S3/SMTP config |
| `S3_*` | opsional — S3-compatible storage (R2) |

---

## 📡 API Overview

### Public and user flows

| Area | Notes |
|------|-------|
| **Mailboxes** | Create, delete, and manage disposable addresses |
| **Email Inbox** | List, view, delete, and forward emails |
| **Auth** | Register, login, logout, and JWT-based access |
| **Send Mail** | Send through binding/SMTP/email routing paths |
| **Telegram** | Push incoming mail and bot commands |

### Admin flows

| Area | Notes |
|------|-------|
| **Admin Console** | Manage domains, users, and mailbox policies |
| **Cleanup** | Run mailbox cleanup and custom SQL cleanup rules |
| **Settings** | Configure Turnstile, send balance, forwarding, webhook, and AI extraction |

---

## 🔒 Security Notes

- JWT required for protected routes
- Admin panel protected by `ADMIN_PASSWORDS`
- Turnstile support available for login forms
- Optional address passwords for mailbox access
- Email content parsing falls back safely when WASM parser fails

---

## 📄 License

MIT License. See `LICENSE`.

---

<div align="center">
  <strong>BITS Mail Cloudflare</strong> · Developed with ❤️ by <a href="https://banten-it-solutions.github.io"><strong>Banten IT Solutions</strong></a>
</div>
