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

| Feature                      | Description                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Single Worker Deployment** | One Cloudflare Worker (e.g., `my-mail-worker`) serves API and frontend assets through `[assets]` binding                            |
| **Temporary Mailboxes**      | Create and manage disposable email addresses with multiple domains                                                                  |
| **Fast Email Parsing**       | Client-side `mail-parser-wasm` plus server-side `PostalMime` fallback                                                               |
| **User Accounts**            | Register, login, and manage mailbox access with JWT                                                                                 |
| **Address Passwords**        | Optional password-protected mailboxes                                                                                               |
| **Auto Reply & Forwarding**  | Configure auto-reply, forward rules, and email filters                                                                              |
| **Telegram Integration**     | Push incoming mail to Telegram and manage mailboxes from bot flows                                                                  |
| **Workers AI Extraction**    | Extract verification codes and key links from email content                                                                         |
| **Admin Console**            | Manage domains, users, quotas, settings, and cleanup tasks                                                                          |
| **Cloudflare Native**        | Built for Workers, D1, KV, Turnstile, and Email Routing                                                                             |
| **Dynamic Configuration**    | Uses `wrangler.template.jsonc` + `pnpm cf:config` to inject `${VAR}` from `.env` / GitHub Secrets — no environment values committed |
| **Code Quality**             | Prettier + ESLint + `simple-git-hooks` + `lint-staged` — auto-format on commit, `check` + `build` on push                           |

## 🛠️ Tech Stack

| Layer               | Technology                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Frontend**        | Vue 3, Naive UI, Vite 8, TypeScript — SPA in `frontend/`                                                   |
| **Backend**         | Cloudflare Workers, Hono, D1 (SQLite), KV — in `worker/`                                                   |
| **Build**           | pnpm workspace monorepo, root `vite.config.ts` + `@cloudflare/vite-plugin` unified dev, esbuild minify     |
| **Mail Processing** | `mail-parser-wasm` (client), `PostalMime` (server)                                                         |
| **Integrations**    | Telegram Bot, Workers AI, Turnstile, S3-compatible storage                                                 |
| **Tooling**         | Wrangler 4, pnpm 10, ESLint 10, Prettier 3, `simple-git-hooks` + `lint-staged`, `scripts/gen-wrangler.mjs` |

---

## 📁 Project Structure

```text
BITS-Mail-Cloudflare/
├── .github/
│   └── workflows/
│       └── deploy.yaml       # workflow_dispatch only — cf:config + secret bulk + deploy
├── frontend/                 # Vue 3 SPA (package: bits-mail-cloudflare-frontend)
├── worker/                   # Cloudflare Worker API + asset hosting (bits-mail-cloudflare-worker)
├── scripts/
│   └── gen-wrangler.mjs      # generator: .env / env vars → wrangler.jsonc
├── wrangler.template.jsonc    # template with ${VAR} placeholders (do not deploy directly)
├── .env.example               # example vars for local development
├── .dev.vars.example          # example secrets for local development
├── .prettierrc.json           # Prettier config (root, shared with worker)
├── .prettierignore            # ignore wrangler templates, locks, dist, env
├── .npmrc                     # NODE_NO_WARNINGS for pnpm url.parse deprecation
├── pnpm-workspace.yaml        # pnpm workspace: frontend + worker + overrides
├── package.json               # root orchestrator (cf:config, build, deploy, format, hooks)
├── vite.config.ts             # root Vite: unified dev SPA + Worker via Cloudflare plugin
├── tsconfig.json
├── LICENSE
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js LTS (20+)
- pnpm 10+
- [Cloudflare account](https://dash.cloudflare.com)
- Cloudflare D1 database (e.g., `my-mail-db` — your chosen name)
- Cloudflare KV namespace (e.g., `my-mail-kv` — your chosen name)
- Optional: Turnstile, Telegram bot, Workers AI, Email Routing, Resend API key

### 1. Clone

```bash
git clone https://github.com/Banten-IT-Solutions/BITS-Mail-Cloudflare.git
cd BITS-Mail-Cloudflare
```

### 2. Install

```bash
pnpm install
# → auto-installs git hooks via `prepare` (simple-git-hooks)
```

### 3. Configure (Local)

```bash
cp .env.example .env            # vars: WORKER_NAME, D1_*, KV_*, DOMAINS, etc.
cp .dev.vars.example .dev.vars  # secrets: JWT_SECRET, ADMIN_PASSWORD, etc.

# Edit .env — minimum required:
#   WORKER_NAME, WORKER_DOMAIN, D1_DATABASE_ID, KV_NAMESPACE_ID
#   DEFAULT_DOMAINS=["yourdomain.com"], DOMAINS=["yourdomain.com"]

pnpm cf:config                  # validates REQUIRED vars and generates wrangler.jsonc (gitignored)
```

> `wrangler.jsonc` is generated and gitignored. It is the only config consumed by `wrangler dev` / `wrangler deploy`.

### 4. Develop

```bash
pnpm dev          # unified Vite dev: SPA + Worker with HMR
pnpm dev:worker   # Worker only (wrangler dev --config wrangler.jsonc)
pnpm dev:frontend # frontend only
```

### 5. Required Cloudflare Resources (One-Time Setup)

Create these **once** before the first deploy. Required for **both** Local and Remote deploys — CI only deploys code, it does not provision resources.

| Resource         | Command / Dashboard                                                     |
| ---------------- | ----------------------------------------------------------------------- |
| **D1 Database**  | `wrangler d1 create <your-d1-name>` (e.g., `my-mail-db`)                |
| **KV Namespace** | `wrangler kv namespace create <your-kv-name>` (e.g., `my-mail-kv`)      |
| **R2 Bucket**    | `wrangler r2 bucket create <your-bucket-name>` (e.g., `my-mail-bucket`) |

> **Custom Domain is auto-provisioned on deploy** — `wrangler deploy` creates/updates it from `routes: [{ "pattern": "${WORKER_DOMAIN}", "custom_domain": true }]` in `wrangler.template.jsonc`. No manual Dashboard step needed; just ensure the zone for `WORKER_DOMAIN` (e.g., `mail.yourdomain.com`) is already active in your Cloudflare account.

#### 📧 Email Routing Setup (Optional — Required to Receive Emails)

Email Routing **is not auto-provisioned** by `wrangler deploy`. The Worker only provides the `email(message)` handler (`worker/src/email/index.ts`) — you must connect your domain to the Worker manually **after the first deploy** (the Worker must exist first to appear in the dropdown).

**Steps (once per domain):**

1. Cloudflare Dashboard → Select your zone (e.g., `yourdomain.com`) → **Email → Email Routing** → **Enable** (if not yet enabled) and verify the DNS records Cloudflare adds.
2. Go to **Routing rules → Catch-all address** (or **Create address**).
3. Choose **Action: Send to Worker** → Select Worker: `my-mail-worker` (your `WORKER_NAME`) → **Create**.
4. (Alternative) Create specific addresses: `*@yourdomain.com` or `*@mail.yourdomain.com` → Send to Worker → same Worker.
5. Send a test email to `test@yourdomain.com` and check it appears in the app / D1 `raw_mails` table and triggers Telegram/Webhook/Forward if configured.

> **For both Local and Remote deploys:** do this once after your first successful deploy. No `wrangler` command can automate it. If you use multiple `DOMAINS`/`DEFAULT_DOMAINS`, repeat for each zone.

### 6. Deploy

Choose one method below. Use **Local** for quick testing and **Remote (Cloudflare)** for production / team workflows.

#### 🖥️ Option A — Local Deploy (from your machine)

Best for development, testing, or one-off deploys. Uses your local `.env` + `.dev.vars` and your authenticated `wrangler` session.

```bash
# 1. Authenticate wrangler (first time only)
npx wrangler login

# 2. Ensure config is generated
pnpm cf:config

# 3. Deploy to Cloudflare
pnpm deploy
# equivalent: pnpm build && wrangler deploy --config wrangler.jsonc
```

**How it works:**

- `pnpm cf:config` validates required vars and generates `wrangler.jsonc`
- `pnpm build` builds the frontend (Vite 8 esbuild minify, drop console) and bundles the worker (`--minify`)
- `wrangler deploy` uploads the worker; secrets from `.dev.vars` are applied via `wrangler secret bulk` if present

> **Use when:** you want fast iteration without setting up GitHub. **Not ideal for:** shared production where secrets should live in CI.

---

#### ☁️ Option B — Remote Deploy via GitHub Actions to Cloudflare (Recommended for Production)

Best for production and team collaboration. Code is built and deployed by GitHub Actions using **GitHub Variables + Secrets** — triggered manually via `workflow_dispatch`.

**Steps:**

1. Fill in **GitHub Variables** and **GitHub Secrets** (tables below) at `Settings → Secrets and variables → Actions`.
2. Go to GitHub → `Actions → Deploy → Run workflow`.
3. The workflow automatically runs: `cf:config` → `build` → `wrangler secret bulk` → `wrangler deploy`.

> Pushes to `main` do **not** auto-deploy — deployment is `workflow_dispatch` only.

##### GitHub Variables

Configure at `Settings → Secrets and variables → Actions → Variables` (non-sensitive). These fill `${VAR}` placeholders in `wrangler.template.jsonc` via `pnpm cf:config`.

| Variable                              | Example                                         | Required    | Description                                            |
| ------------------------------------- | ----------------------------------------------- | ----------- | ------------------------------------------------------ |
| `WORKER_NAME`                         | `my-mail-worker`                                | ✅ Required | Worker name on Cloudflare (placeholder — use your own) |
| `WORKER_DOMAIN`                       | `mail.yourdomain.com`                           | ✅ Required | Custom domain for the Worker                           |
| `D1_DATABASE_NAME`                    | `my-mail-db`                                    | ✅ Required | D1 database name (placeholder — use your own)          |
| `D1_DATABASE_ID`                      | `xxxx-xxxx-xxxx`                                | ✅ Required | D1 database ID from `wrangler d1 create`               |
| `KV_NAMESPACE_ID`                     | `xxxx-xxxx-xxxx`                                | ✅ Required | KV namespace ID from `wrangler kv namespace create`    |
| `DEFAULT_DOMAINS`                     | `["mail.yourdomain.com"]`                       | ✅ Required | JSON array string — default mail domains               |
| `DOMAINS`                             | `["mail.yourdomain.com"]`                       | ✅ Required | JSON array string — active mail domains                |
| `ADDRESS_PREFIX`                      | `tmp`                                           | Optional    | Prefix for temporary email addresses                   |
| `DEFAULT_LANG`                        | `en`                                            | Optional    | Default UI language                                    |
| `WORKER_TITLE`                        | `BITS Mail Cloudflare`                          | Optional    | Page title                                             |
| `FRONTEND_URL`                        | `https://mail.yourdomain.com`                   | Optional    | Frontend URL                                           |
| `ENABLE_USER_CREATE_EMAIL`            | `true`                                          | Optional    | Allow users to create email addresses                  |
| `DISABLE_ANONYMOUS_USER_CREATE_EMAIL` | `false`                                         | Optional    | Disable guest email creation                           |
| `ENABLE_USER_DELETE_EMAIL`            | `true`                                          | Optional    | Allow users to delete emails                           |
| `ENABLE_AI_EMAIL_EXTRACT`             | `false`                                         | Optional    | Enable Workers AI extraction                           |
| `AI_EXTRACT_MODEL`                    | `@cf/meta/llama-3-8b-instruct`                  | Optional    | Workers AI model ID                                    |
| `CF_TURNSTILE_SITE_KEY`               | `0x4AAAAAAA...`                                 | Optional    | Turnstile public site key                              |
| `S3_ENDPOINT`                         | `https://<account_id>.r2.cloudflarestorage.com` | Optional    | S3-compatible endpoint (R2)                            |
| `S3_BUCKET`                           | `my-mail-bucket`                                | Optional    | R2 / S3 bucket name (placeholder — use your own)       |
| `S3_URL_EXPIRES`                      | `360`                                           | Optional    | Presigned URL expiry in seconds                        |
| `VITE_API_BASE`                       | `https://mail.yourdomain.com`                   | Optional    | API base URL for frontend build                        |

> Validation is enforced by `scripts/gen-wrangler.mjs`. Missing required variables will fail `pnpm cf:config` with a clear error.

##### GitHub Secrets

Configure at `Settings → Secrets and variables → Actions → Secrets` (sensitive). Injected via `wrangler secret bulk` during deploy. For local dev, put them in `.dev.vars`.

| Secret                    | Required     | Description                                                                                                           |
| ------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`    | ✅ Required  | Cloudflare API token with Workers Edit permission                                                                     |
| `CLOUDFLARE_ACCOUNT_ID`   | ✅ Required  | Cloudflare Account ID (Dashboard → right sidebar)                                                                     |
| `JWT_SECRET`              | ✅ Required  | Min. 32 characters — used to sign auth tokens                                                                         |
| `ADMIN_PASSWORD`          | ✅ Required* | Admin panel password (`*` either this or `ADMIN_PASSWORDS` is required)                                               |
| `ADMIN_PASSWORDS`         | Optional     | JSON array `["pass1","pass2"]` — multiple admin passwords                                                             |
| `CF_TURNSTILE_SECRET_KEY` | Optional     | Turnstile server-side secret key                                                                                      |
| `TG_BOT_INFO`             | Optional     | JSON `{"token":"123:abc","username":"your_bot"}` — Telegram bot info                                                  |
| `TELEGRAM_BOT_TOKEN`      | Optional     | Telegram bot token (alternative to `TG_BOT_INFO`)                                                                     |
| `RESEND_TOKEN`            | Optional     | Resend API key — fallback for sending to arbitrary recipients                                                         |
| `SMTP_CONFIG`             | Optional     | JSON SMTP config: `{"mail.yourdomain.com":{"host":"smtp.example.com","port":587,"auth":{"user":"...","pass":"..."}}}` |
| `S3_ACCESS_KEY_ID`        | Optional     | S3 / R2 access key ID (secret)                                                                                        |
| `S3_SECRET_ACCESS_KEY`    | Optional     | S3 / R2 secret access key (secret)                                                                                    |

### 7. Configuration Flow

No database IDs, bucket names, or domains are committed. All values are injected at build time:

```
wrangler.template.jsonc  (committed, contains ${VAR} placeholders)
        │  pnpm cf:config  (scripts/gen-wrangler.mjs)
        ▼
wrangler.jsonc           (generated, gitignored — used by wrangler)
        ▲
        ├─ local : .env + .dev.vars        →  Option A (Local Deploy)
        └─ CI    : GitHub Variables + Secrets  →  Option B (Remote Deploy)
```

- `"${VAR}"` in template → replaced as JSON string (quoted).
- `${VAR}` in template (unquoted) → replaced as raw JSON (arrays / booleans / numbers).

---

## 💻 Development

### Commands

| Command              | Description                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `pnpm cf:config`     | Generate `wrangler.jsonc` from `.env` / environment                                              |
| `pnpm dev`           | Start unified Vite dev (SPA + Worker via `@cloudflare/vite-plugin`)                              |
| `pnpm dev:frontend`  | Frontend dev only                                                                                |
| `pnpm dev:worker`    | Worker dev only (`wrangler dev --config wrangler.jsonc`)                                         |
| `pnpm build`         | `cf:config` → build frontend (esbuild minify) → bundle worker (`--minify`)                       |
| `pnpm deploy`        | Deploy to Cloudflare (`wrangler deploy --config wrangler.jsonc`)                                 |
| `pnpm cf:typegen`    | Generate Cloudflare Workers type bindings                                                        |
| `pnpm check`         | Lint worker (`eslint`) + test frontend (`vitest` 21 tests)                                       |
| `pnpm db:init:local` | Initialize / test local D1 database                                                              |
| `pnpm format`        | Format all files with Prettier                                                                   |
| `pnpm format:check`  | Check formatting without writing                                                                 |
| `pnpm audit`         | Check for known vulnerabilities (`NODE_NO_WARNINGS=1 pnpm audit` to hide pnpm url.parse warning) |

### Code Style & Git Hooks

- **Formatter:** Prettier 3 (`prettier --write .`) with `.prettierrc.json` (`printWidth:100, singleQuote, semi, 2 spaces`) and `.prettierignore` (ignores `wrangler.*.jsonc`, `pnpm-lock.yaml`, `dist`, `.env`)
- **Linter:** ESLint 10 + `eslint-config-prettier` (no conflicts) for `worker/src`
- **Git Hooks:** `simple-git-hooks` + `lint-staged` (auto-installed via `prepare`):
  - `pre-commit`: `lint-staged` → `prettier --write` for `*.{js,ts,vue,json,css,md}` + `eslint --fix` for `worker/**/*.{js,ts}`
  - `pre-push`: `pnpm check && pnpm build` (21 tests + Vite build must pass)
- **Usage:**
  ```bash
  pnpm format              # manual format
  pnpm format:check        # CI check
  # hooks run automatically on `git commit` / `git push`
  # skip if needed: SKIP_SIMPLE_GIT_HOOKS=1 git commit -m "..."
  ```

### Build Optimization

- **Vite 8 (frontend + root):** `build.minify: 'esbuild'`, `cssMinify: true`, `sourcemap: false`, `chunkSizeWarningLimit: 1000`, `esbuild.drop: ['console','debugger']` in production, `legalComments: 'none'`, `reportCompressedSize: true` — see `vite.config.ts` / `frontend/vite.config.js`
- **Worker:** `wrangler deploy --minify` (esbuild minify for Worker bundle)
- **Result:** `pnpm build` → `Total Upload ~1278 KiB / gzip ~357 KiB` (frontend) + minified Worker

### Workspace Notes

- `frontend/` and `worker/` are separate workspace packages defined in `pnpm-workspace.yaml`.
- Shared dependencies (Vite, Vue plugin, Wrangler) are hoisted to the root `package.json`.
- `pnpm.overrides` for `fast-xml-parser@5.11.1` and `uuid@11.1.1` (security fixes) lives in `pnpm-workspace.yaml`.
- `pnpm.patchedDependencies` for `telegraf@4.16.3` and `onlyBuiltDependencies: [simple-git-hooks]` live in `pnpm-workspace.yaml` (pnpm 10).

### Troubleshooting — `url.parse() DeprecationWarning`

```
(node:...) DeprecationWarning: `url.parse()` behavior is not standardized ...
```

- **Source:** `pnpm 10.10.0` internal `toNerfDart` uses `url.parse()` — **not your code**, harmless.
- **CI:** suppressed via `NODE_NO_WARNINGS=1` in `deploy.yaml` `env:` and `.npmrc` (`node-options=--no-deprecation`)
- **Local:** run `NODE_NO_WARNINGS=1 pnpm audit` / `pnpm install` to hide, or export `export NODE_NO_WARNINGS=1` in your shell. Will disappear when pnpm fixes upstream.

---

## 📡 API Overview

### Public and User Flows

| Area            | Notes                                           |
| --------------- | ----------------------------------------------- |
| **Mailboxes**   | Create, delete, and manage disposable addresses |
| **Email Inbox** | List, view, delete, and forward emails          |
| **Auth**        | Register, login, logout, and JWT-based access   |
| **Send Mail**   | Send via binding / SMTP / Email Routing         |
| **Telegram**    | Push incoming mail and bot commands             |

### Admin Flows

| Area              | Notes                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| **Admin Console** | Manage domains, users, and mailbox policies                                |
| **Cleanup**       | Run mailbox cleanup and custom SQL cleanup rules                           |
| **Settings**      | Configure Turnstile, send balance, forwarding, webhooks, and AI extraction |

---

## 🔒 Security Notes

- JWT is required for protected routes.
- Admin panel is protected by `ADMIN_PASSWORD` / `ADMIN_PASSWORDS`.
- Turnstile can be enabled for login and registration forms.
- Optional per-address passwords for mailbox access.
- Email content parsing falls back safely when the WASM parser fails.

---

## 📄 License

MIT License. See `LICENSE`.

---

<div align="center">
  <strong>BITS Mail Cloudflare</strong> · Developed with ❤️ by <a href="https://banten-it-solutions.github.io"><strong>Banten IT Solutions</strong></a>
</div>
