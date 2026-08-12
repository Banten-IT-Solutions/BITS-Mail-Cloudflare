<!-- markdownlint-disable-file MD033 MD045 -->
# Cloudflare Temp Email

A fully-featured temporary email service built on Cloudflare Workers and Pages.

## Features

- **Free to Deploy** - Runs on Cloudflare's free tier
- **Fast Email Parsing** - Rust WASM powered mail parser
- **Modern UI** - Responsive Vue 3 interface with multi-language support
- **Telegram Integration** - Receive emails via Telegram bot
- **AI Email Extraction** - Automatically extract verification codes using Workers AI
- **Address Passwords** - Secure email addresses with individual passwords
- **Admin Panel** - Full management dashboard

## Tech Stack

- **Backend**: Cloudflare Workers (Hono + TypeScript)
- **Frontend**: Vue 3 + Naive UI + Vite
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV
- **AI**: Cloudflare Workers AI

## Quick Deploy

### Prerequisites

- [Cloudflare Account](https://dash.cloudflare.com)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install) installed

### 1. Clone & Install

```bash
git clone https://github.com/bits-co-id/cloudflare-temp-email.git
cd cloudflare-temp-email
```

### 2. Create Cloudflare Resources

```bash
# Login to Cloudflare
wrangler login

# Create D1 Database
wrangler d1 create temp-email-db

# Create KV Namespace (optional)
wrangler kv namespace create temp-email-kv
```

### 3. Configure

Copy the template and configure:

```bash
cp worker/wrangler.toml.template worker/wrangler.toml
# Edit wrangler.toml with your database_id and settings
```

### 4. Deploy

```bash
# Worker
cd worker && pnpm install && pnpm deploy

# Frontend
cd frontend && pnpm install && pnpm deploy
```

## Configuration

Key environment variables (set in `wrangler.toml` or Cloudflare Dashboard):

| Variable | Description |
|----------|-------------|
| `DEFAULT_LANG` | Default language (en/zh) |
| `DEFAULT_DOMAINS` | Allowed email domains |
| `JWT_SECRET` | Secret for JWT signing |
| `ADMIN_PASSWORDS` | Admin panel passwords |
| `CF_TURNSTILE_SITE_KEY` | Turnstile site key |
| `TG_BOT_INFO` | Telegram bot info |
| `ENABLE_AI_EMAIL_EXTRACT` | Enable AI extraction |

Full configuration options available in [Documentation](https://vitepress-docs.vercel.app).

## Documentation

See [VitePress Docs](https://vitepress-docs.vercel.app) for detailed guides.

## License

MIT License - See [LICENSE](LICENSE)