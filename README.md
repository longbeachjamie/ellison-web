# Multi-Site Astro Monorepo (Cloudflare Pages)

One GitHub repo serves multiple domains. Each Cloudflare Pages project points to this repo and sets a different `SITE` env var so only that domain's site is built.

## Structure

```text
shared/
  components/
  layouts/
  styles/
  templates/
sites/
  <domain>/
    site.config.ts
    src/pages/index.astro
    src/pages/about.astro
scripts/
  build-site.mjs
```

## Install

```bash
npm install
```

## Build One Site

`SITE` is required.

```bash
SITE=barriser.com node scripts/build-site.mjs
```

PowerShell:

```powershell
$env:SITE='barriser.com'; node scripts/build-site.mjs
```

Build output is always `dist/`.

## Add a New Site

1. Create a folder: `sites/<new-domain>/`.
2. Add `sites/<new-domain>/site.config.ts` with:
   - `siteName`
   - `domain`
   - `tagline`
   - `primaryColor`
   - `accentColor`
   - `metaTitle`
   - `metaDescription`
   - `ctaText`
   - `ctaHref`
3. Add pages:
   - `sites/<new-domain>/src/pages/index.astro`
   - optional `sites/<new-domain>/src/pages/about.astro`
4. Reuse shared building blocks from:
   - `@shared/components/*`
   - `@shared/layouts/*`
   - `@shared/styles/*`
5. Build locally with `SITE=<new-domain> node scripts/build-site.mjs`.
6. In Cloudflare Pages, create a project for that domain and set `SITE=<new-domain>`.

## Cloudflare Pages Settings (Per Domain Project)

Use one Pages project per domain, all connected to this same repo.

- Framework preset: `Astro` (or `None`)
- Build command: `node scripts/build-site.mjs`
- Build output directory: `dist`
- Environment variable: `SITE=<domain>`
- Root directory: `/` (repo root)

### Projects / SITE values

- `barriser.com` -> `SITE=barriser.com`
- `e5networking.com` -> `SITE=e5networking.com`
- `ellisongang.com` -> `SITE=ellisongang.com`
- `jkrvault.com` -> `SITE=jkrvault.com`
- `kellynbrawley.com` -> `SITE=kellynbrawley.com`
- `redefinedpro.net` -> `SITE=redefinedpro.net`
- `truecountryoutdoors.com` -> `SITE=truecountryoutdoors.com`
- `vuevi.com` -> `SITE=vuevi.com`

## Notes

- `scripts/build-site.mjs` fails fast if `SITE` is missing or invalid.
- `_headers` and `_redirects` are sourced from `shared/templates/` and copied into the selected site's `public/` before build.
