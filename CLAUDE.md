# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

- **Worker (single-worker deployment)**: `worker/` — Cloudflare Workers app using Hono framework. Entry: `worker/src/worker.ts`, APIs under `worker/src/*_api/`. Serves the frontend SPA as static assets via the `ASSETS` binding.
- **Frontend**: `frontend/` — Vue 3 + Naive UI app built with Vite. Routes in `frontend/src/router/`. Build output `frontend/dist/` is served by the Worker as static assets.
- **Mail parser**: `mail-parser-wasm/` — Rust WASM email parser.
- **DB schema/migrations**: `db/` — SQLite via Cloudflare D1, dated migration patches.
- **Changelogs**: `CHANGELOG.md` (English).

## Build & Dev Commands

Run inside each subfolder with `pnpm`:

| Folder | Dev | Build | Lint | Deploy |
|--------|-----|-------|------|--------|
| `worker/` | `pnpm dev` | `pnpm build` | `pnpm lint` | `pnpm deploy` |
| `frontend/` | `pnpm dev` | `pnpm build` | — | — |
| `mail-parser-wasm/` | — | `wasm-pack build --release` | — | — |

The frontend is built to `frontend/dist/` and deployed together with the Worker as static assets. The Worker build (`pnpm build`) requires `frontend/dist/` to exist first.

## Architecture

### Worker Auth Flow (`worker/src/worker.ts`)

Three auth layers applied via Hono middleware, each using different headers:

| Path prefix | Header | Purpose |
|-------------|--------|---------|
| `/api/*` | `Authorization: Bearer <jwt>` | Address (mailbox) credential |
| `/user_api/*` | `x-user-token` | User account JWT |
| `/admin/*` | `x-admin-auth` | Admin password |
| (any) | `x-user-access-token` | User role-based access token |
| (any) | `x-custom-auth` | Optional global access password |
| (any) | `x-lang` | Language preference (`en`/`zh`) |

Public endpoints (no auth): `/open_api/*`, `/user_api/login`, `/user_api/register`, `/user_api/passkey/authenticate_*`, `/user_api/oauth2/*`.

### Worker Email Flow (`worker/src/email/`)

Cloudflare Email Worker entry: `email()` in `worker/src/email/index.ts`. Processing pipeline:
1. Parse raw email → check junk → check address exists
2. Auto-reply if configured → forward if configured → webhook if enabled
3. Store in D1 database

### Frontend State (`frontend/src/store/index.js`, `frontend/src/api/index.js`)

Global state via VueUse `useStorage` for persistence. The `api` module wraps axios with auto-attached auth headers and fingerprinting. API base URL comes from `VITE_API_BASE` env var (empty = same origin).

## Coding Style

- `worker/` uses TypeScript + ESLint; `frontend/` uses Vue SFCs.
- Keep existing naming patterns: `*_api/` folders, `utils/`, `models/`.
- ESM imports only (`type: module`).

## Commits & PRs

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`.
- PRs should explain scope; add screenshots for UI changes.
- Use squash merge for PRs.

## Post-Task Checklist (IMPORTANT)

After completing any feature, bug fix, or improvement, **always check**:

1. **CHANGELOG.md** (English) — must be updated under the current `(main)` version section with the change entry. Follow the existing format: `- feat/fix/docs: |模块| 描述`.

## Config

- Worker settings in `worker/wrangler.toml` (see `wrangler.toml.template` for bindings).
- Frontend uses `VITE_*` env vars. Don't commit secrets.
