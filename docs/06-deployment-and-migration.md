# 06 — Deployment and migration

## Environments

| Env | URL | Docroot (Plesk) | Deployed from | Purpose |
|---|---|---|---|---|
| Local | `localhost:4321` | — | `npm run dev` | Development |
| Staging | `https://novi.m2-keramika.hr` | `novi.m2-keramika.hr/` | push to `main` (until cutover) | Review with Marin on real phones before launch |
| Production | `https://m2-keramika.hr` | `httpdocs/` | push to `main` (after cutover) | Live site |

After launch, staging stays available for developer branches through a manual workflow dispatch. Content edits from Marin go **straight to production**: the schemas and tests are the safety net, and an approval step is a step he would forget.

## Pipeline (`.github/workflows/deploy.yml`)

```
on: push to main  |  workflow_dispatch (target: staging|production)

jobs:
  build:
    - checkout
    - setup-node 22 (cache npm)
    - npm ci
    - npx astro check              # types + templates
    - npx astro build              # validates content schemas, optimises images
    - npx playwright test          # responsive smoke on dist/ (Chromium + WebKit)
    - upload dist/ as artifact (kept 30 days → instant rollback source)
  deploy:
    needs: build
    concurrency: deploy-${target}   # never two uploads at once; newer edit wins
    - rsync over SSH (preferred) or FTP-Deploy-Action over FTPS
      order: /_astro/** (hashed assets) first, then everything else, then delete stale
```

- **Typical duration:** about 2–3 minutes, mostly image processing. Use `actions/cache` for `node_modules/.astro` so unchanged images aren't reprocessed.
- **Notifications:** GitHub emails the repo owner on failure. Marin sees nothing go wrong; his change simply isn't live yet, and Mateo fixes it.
- **Secrets:** `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KEY` (or `DEPLOY_PASSWORD` for FTPS), `DEPLOY_PATH_STAGING`, `DEPLOY_PATH_PROD`.

## `public/.htaccess`

- Redirect HTTP to HTTPS and `www.` to the apex (301)
- `Cache-Control`: `/_astro/*` gets `public, max-age=31536000, immutable`; HTML gets `no-cache`; images in `public/` get 7 days
- Compression: `mod_deflate` (and `mod_brotli` if enabled) for HTML, CSS, JS, SVG and CSV
- `ErrorDocument 404 /404.html`
- Redirects for old WordPress URLs:
  - `/wp-content/uploads/2026/09/Obrt_JerolimaMise8_1_20092026_0730-List-1.csv` → `/cjenik.csv` (301)
  - `/wp-content/uploads/*` (images Google may have indexed) → `/` (301)
  - `/feed`, `/wp-admin`, `/wp-login.php`, `/?p=*` → `/` (301; it also stops bot noise from reaching anything)
- Security headers as listed in [03](03-architecture.md#security)
- `AddType text/csv .csv` with `charset=utf-8`

## Email safety

The email server is on the same Plesk subscription. **None** of the following may change:

| Record | Value | Note |
|---|---|---|
| `MX` | `10 mail.m2-keramika.hr` | |
| `A mail` | server IP | |
| `TXT` (SPF) | `v=spf1 +a +mx +a:srv4.kuhada.net -all` | |
| DKIM/DMARC | whatever Plesk has set | Check and record the current values before cutover |

Our plan **changes no DNS records at all**, apart from Plesk auto-creating `novi.` for staging. We only replace files in `httpdocs/`. We don't touch mail settings in Plesk.

Before and after cutover, send a test email *to* and *from* `info@m2-keramika.hr`.

## Cutover from WordPress

### Before (T-7 days)

1. Create a **Plesk full backup** of the subscription (files, database, mail) and download it locally.
2. Download `httpdocs/wp-content/uploads/` separately. It holds the original-resolution photos, which go into the new repo.
3. Record the DNS zone (screenshot or export) and the DKIM/DMARC values.
4. Staging is approved by Marin on his own phone, and the [launch checklist](#launch-checklist) passes on staging.

### Cutover (about 15 minutes, low-traffic time)

1. In Plesk, rename `httpdocs/` to `httpdocs-wordpress-backup/`, then create an empty `httpdocs/`.
   - Keep `.well-known/` if present (Let's Encrypt renewal).
2. Run the deploy workflow with target `production`.
3. Verify the site, HTTPS, the redirect checks, the CSV download, and that the phone link opens the dialler.
4. Send a test email both ways.

### Rollback (≤ 5 minutes)

- **New site problem:** re-run the deploy workflow on the previous commit, or `git revert` on GitHub, which redeploys.
- **Emergency back to WordPress:** rename the folders back (`httpdocs/` ↔ `httpdocs-wordpress-backup/`). The database is untouched, so WP works immediately.

### After (T+30 days)

1. Ensure Google Search Console is set up (DNS TXT verification, a mail-safe change) and submit `sitemap-index.xml`.
2. Once stable for 30 days: delete `httpdocs-wordpress-backup/` and the WordPress database in Plesk. Keep the downloaded backup archive offline.
3. If the hosting plan was sized for WordPress, ask kuhada whether a cheaper plan still covers email plus static hosting.

## Launch checklist

- [ ] All copy edits approved by Marin ([05](05-content-model.md#proposed-copy-edits))
- [ ] Every photo has a meaningful `alt` text
- [ ] Playwright passes at all widths (Chromium + WebKit)
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100
- [ ] Real devices: iPhone (Safari), Android (Chrome), Samsung Internet, desktop Chrome/Firefox/Safari
- [ ] `tel:` and `mailto:` links work on phone
- [ ] Lightbox works by keyboard, touch and mouse, and without JS
- [ ] CSV opens correctly in Croatian Excel and LibreOffice (č ć đ š ž and columns intact)
- [ ] Print view of price list (if built)
- [ ] 404 page
- [ ] Redirects for old URLs return 301
- [ ] Security headers present ([securityheaders.com](https://securityheaders.com))
- [ ] Rich Results Test validates the `LocalBusiness` data
- [ ] Marin has done the three training tasks himself in Pages CMS
- [ ] Test email in and out after cutover

## Maintenance

| When | What | Who |
|---|---|---|
| On every failed build email | Read the error, fix the content or code | Mateo |
| Every 6 months | `npm outdated`; update patch and minor versions; rebuild; check | Mateo |
| Yearly | Astro and Node major upgrades if needed; renew the domain (.hr, via kuhada); check that Pages CMS is still maintained | Mateo / Marin (domain) |
| Ad hoc | New section types, design changes | Mateo, through a PR to staging, then main |
