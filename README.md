<div align="center">
  <h1>BITS Mail Cloudflare</h1>
  <p>
    Temporary email platform built on Cloudflare Workers.
  </p>
  <p>
    <img src="https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
    <img src="https://img.shields.io/badge/Cloudflare%20D1-F38020?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare D1" />
    <img src="https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white" alt="Hono" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vue%203-4FC08D?style=flat&logo=vue.js&logoColor=white" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat" alt="MIT License" />
  </p>
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Single Worker Deployment** | One Cloudflare Worker serves API and frontend assets through `[assets]` binding |
| **Temporary Mailboxes** | Create and manage disposable email addresses with multiple domains |
| **Fast Email Parsing** | Client-side `mail-parser-wasm` plus server-side `PostalMime` fallback |
| **User Accounts** | Register, login, and manage mailbox access with JWT |
| **Address Passwords** | Optional password-protected mailboxes |
| **Auto Reply & Forwarding** | Configure auto-reply, forward rules, and email filters |
| **Telegram Integration** | Push incoming mail to Telegram and manage mailboxes from bot flows |
| **Workers AI Extraction** | Extract verification codes and key links from email content |
| **Admin Console** | Manage domains, users, quotas, settings, and cleanup tasks |
| **Cloudflare Native** | Built for Workers, D1, KV, Turnstile, and Email Routing |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vue 3, Naive UI, Vite, TypeScript |
| **Backend** | Cloudflare Workers, Hono, D1 (SQLite) |
| **Mail Processing** | `mail-parser-wasm` (client), `PostalMime` (server) |
| **Integrations** | Telegram Bot, Workers AI, Turnstile, S3-compatible storage |
| **Tooling** | Wrangler, pnpm, ESLint |

---

## 📁 Project Structure

```text
BITS-Mail-Cloudflare/
├── .github/
│   ├── dependabot.yml        # npm dependency updates
│   └── workflows/
│       └── deploy.yaml       # single deploy workflow for Cloudflare Worker
├── frontend/                 # Vue 3 SPA
├── worker/                   # Cloudflare Worker API + asset hosting
├── LICENSE
├── README.md
├── .dockerignore
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- Cloudflare account
- Cloudflare D1 database
- Cloudflare KV namespace
- Optional: Turnstile, Telegram bot, Workers AI, Email Routing

### 1. Clone

```bash
git clone https://github.com/Banten-IT-Solutions/BITS-Mail-Cloudflare.git
cd BITS-Mail-Cloudflare
```

### 2. Configure Worker

Copy the template and edit your values:

```bash
cp worker/wrangler.toml.template worker/wrangler.toml
```

Set the required bindings and variables in `worker/wrangler.toml` or Cloudflare Dashboard:

- `DEFAULT_DOMAINS`
- `DOMAINS`
- `JWT_SECRET`
- `ADMIN_PASSWORDS`
- `CF_TURNSTILE_SITE_KEY` / `CF_TURNSTILE_SECRET_KEY`
- `TG_BOT_INFO`
- `ENABLE_AI_EMAIL_EXTRACT`

### 3. Build Frontend

```bash
cd frontend
pnpm install
pnpm build:pages
```

### 4. Deploy Worker

```bash
cd ../worker
pnpm install
pnpm deploy
```

---

## 💻 Development

### Frontend

```bash
cd frontend
pnpm dev
```

### Worker

```bash
cd worker
pnpm dev
```

### Build

```bash
cd frontend && pnpm build:pages
cd ../worker && pnpm build
```

### Lint

```bash
cd worker && pnpm lint
```

---

## ⚙️ Configuration

### `worker/wrangler.toml.template`

Important settings:

- `[assets]` serves `frontend/dist/` from same Worker
- `PREFIX` defaults to `tmp`
- `DEFAULT_DOMAINS` and `DOMAINS` define allowed mailbox domains
- `ENABLE_USER_CREATE_EMAIL` and `ENABLE_USER_DELETE_EMAIL` control user mailbox actions
- `ENABLE_AUTO_REPLY`, `ENABLE_WEBHOOK`, `ENABLE_ADDRESS_PASSWORD` are optional features
- `TG_BOT_INFO` enables Telegram integration
- `ENABLE_GLOBAL_TURNSTILE_CHECK` protects login forms
- `DEFAULT_SEND_BALANCE` and `NO_LIMIT_SEND_ROLE` control mail sending quotas

### Environment and secrets

Set these in Cloudflare Dashboard or via Wrangler secrets:

- `JWT_SECRET`
- `ADMIN_PASSWORDS`
- `CF_TURNSTILE_SECRET_KEY`
- `TG_BOT_INFO`
- `BACKEND_TOML` for GitHub Actions deploys
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

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
  <strong>BITS Mail Cloudflare</strong> · Built by <a href="https://banten-it-solutions.github.io"><strong>Banten IT Solutions</strong></a>
</div>
