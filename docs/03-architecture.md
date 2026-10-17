# 03 — Architecture

## Overview

```
 Marin (phone/laptop)                    Mateo (developer)
        │  edits forms                          │  code changes
        ▼                                       ▼
 ┌──────────────┐   commits YAML + photos  ┌──────────────┐
 │  Pages CMS   │ ───────────────────────▶ │ GitHub repo  │
 │ (web editor) │                          │   (main)     │
 └──────────────┘                          └──────┬───────┘
                                                  │ push triggers
                                                  ▼
                                         ┌──────────────────┐
                                         │  GitHub Actions  │
                                         │ validate → build │──✗ fail → email to Mateo,
                                         │   → test → upload│        live site unchanged
                                         └──────┬───────────┘
                                                │ SFTP/FTPS (changed files only)
                                                ▼
                                 ┌──────────────────────────────┐
                                 │ kuhada.net (Plesk, Apache)   │
                                 │ httpdocs/ ← static HTML/CSS  │
                                 │ mail.m2-keramika.hr (as-is)  │
                                 └──────────────────────────────┘
```

There is **no database and no server-side code** in production. The live site is a folder of static files.

## Tooling

| Concern | Choice | Version | Why (details in ADRs) |
|---|---|---|---|
| Site generator | **Astro** | 7.4.x | Static HTML output, built-in image optimisation, content schemas with validation. [ADR-0001](adr/0001-astro-static-site.md) |
| Language | TypeScript (strict) for code, YAML for content | — | Typed content means bad edits fail at build, not in production |
| Styling | Plain modern CSS (custom properties, `clamp()`, grid, container queries) in Astro scoped styles | — | A one-page site doesn't need Tailwind or Sass. Fewer tools to maintain |
| Fonts | `@fontsource-variable/inter`, `@fontsource/cardo` | 5.3.x | Self-hosted, so there are no Google requests (GDPR) |
| Images | `astro:assets` + sharp | sharp 0.35.x | Turns phone photos into AVIF/WebP at several widths automatically |
| Editor | **Pages CMS** (hosted, app.pagescms.org) | — | Free, email login for Marin, edits YAML in the repo. [ADR-0002](adr/0002-pages-cms-for-editing.md) |
| Source control | GitHub | — | Required by Pages CMS; also free CI |
| CI/CD | GitHub Actions | — | Build, test and deploy on every push to `main` |
| Hosting | **Existing kuhada.net Plesk hosting** | — | Already paid for, and keeps email untouched. [ADR-0003](adr/0003-deploy-to-existing-hosting.md) |
| Node | 22 LTS (≥ 22.22) | — | Required by Astro 7 |
| Package manager | npm | — | Default, one less tool |

Versions are pinned in `package.json` and `package-lock.json`. Renovate/Dependabot is **not** enabled: the site is static and has no runtime dependencies in production, so updates are a deliberate, occasional chore (see [06 maintenance](06-deployment-and-migration.md#maintenance)).

## Repository layout

```
m2-keramika/
├─ .github/workflows/
│  └─ deploy.yml            # build → test → upload on push to main
├─ .pages.yml               # Pages CMS: forms Marin sees
├─ docs/                    # these documents
├─ public/
│  ├─ .htaccess             # HTTPS/www redirects, caching, old-URL redirects
│  ├─ favicon.svg
│  └─ robots.txt
├─ src/
│  ├─ content/              # ← EVERYTHING MARIN EDITS lives here
│  │  ├─ osnovno.yml        #   business details, hero, SEO
│  │  ├─ tekstovi.yml       #   section headings and paragraphs
│  │  ├─ usluge.yml         #   services list
│  │  ├─ galerija.yml       #   project photos
│  │  ├─ prije-poslije.yml  #   before/during/after sets
│  │  └─ cjenik.yml         #   price list
│  ├─ assets/
│  │  ├─ brand/             #   logo, hero and background photos (developer-managed)
│  │  └─ uploads/           #   photos Marin uploads via CMS
│  ├─ content.config.ts     # schemas (zod) that validate the YAML above
│  ├─ components/           # Header, Hero, Section, ServiceCard, Gallery, Lightbox, PriceList, Footer, Ornament
│  ├─ layouts/Base.astro    # <head>, meta, fonts, JSON-LD
│  ├─ pages/
│  │  ├─ index.astro        # the one page
│  │  ├─ 404.astro
│  │  └─ cjenik.csv.ts      # generates the downloadable price list from cjenik.yml
│  └─ styles/
│     ├─ tokens.css         # design tokens (see 04)
│     └─ global.css         # reset, base typography
├─ tests/
│  └─ responsive.spec.ts    # Playwright: no overflow at all widths, key elements visible
├─ astro.config.mjs
├─ package.json
└─ README.md
```

The split between `src/content/` (Marin's) and everything else (Mateo's) is the core rule of this project. The CMS can only reach `src/content/` and `src/assets/uploads/`.

## Content flow and validation

1. Marin saves a form in Pages CMS. It commits the change (YAML and any uploaded photo) to `main`.
2. The commit triggers `deploy.yml`.
3. `astro check` and `astro build` load every YAML file through the schemas in `content.config.ts`. A missing required field, a wrong type, or a photo path that doesn't exist **fails the build with a readable error**.
4. Playwright runs the responsive smoke tests against the built site.
5. Only if all of that passes are the changed files uploaded to the server.
6. If anything fails, nothing is uploaded and GitHub emails the repo owner (Mateo).

Schemas also apply **soft limits** that protect the layout. For example, a service title is at most 40 characters and a gallery is at most 24 photos. These limits appear in the CMS help text so Marin knows them in advance.

## Images pipeline

- Marin uploads full-size phone photos (up to around 10 MB) through the CMS into `src/assets/uploads/`.
- At build time Astro produces AVIF and WebP at widths 400, 800, 1200 and 1600 with correct `srcset`/`sizes`, plus a JPEG fallback. It also reads the dimensions so the page doesn't jump while photos load.
- The lightbox's full-size image is a 1600 px WebP, not the original upload.
- The hero and section backgrounds use `<img>` with `object-fit: cover` (not CSS `background-image`), so they get responsive formats and `fetchpriority="high"` for the hero.
- The logo is re-exported from the 1.8 MB PNG to a WebP/AVIF of about 30 KB (or a traced SVG if Marin has a vector original).

**Repo growth:** about 30 photos × 5 MB is around 150 MB over years, which is fine for GitHub. If it becomes a problem, we can add a pre-commit resize in CI later.

## JavaScript budget

The only script is the **lightbox** (about 1.5 KB, inline). It enhances a native `<dialog>`.

- Without JS, each thumbnail is a plain link to the large image.
- With JS, the image opens in a `<dialog>` with prev/next, swipe, `Esc` to close, and focus returned to the thumbnail.

There are no frameworks, no hydration, and no third-party scripts.

## Testing strategy

Kept proportional to a one-page site:

| Layer | Tool | Runs | Catches |
|---|---|---|---|
| Content validation | Astro content schemas (zod) | Every build | Bad or missing CMS data |
| Type and template check | `astro check` | Every build | Broken components |
| Responsive smoke | Playwright (Chromium + WebKit) at 320/375/390/768/1024/1366/1920 | Every build | Horizontal overflow, hidden phone button, table overflow, missing images |
| Quality budget | Lighthouse CI (mobile preset) | PRs from Mateo | Performance, a11y, SEO regressions |
| Real devices | Manual checklist (iPhone Safari, Android Chrome, Samsung Internet, desktop) | Before launch and after design changes | Things emulators miss |

Lighthouse runs only on developer PRs, not on Marin's content commits. That keeps his publishes fast and avoids flaky failures from performance noise.

## Security

- Nothing runs on the server, so there's nothing to hack in the usual WordPress sense.
- Deploy credentials (SFTP/FTPS) live only in GitHub Actions secrets. Use a **dedicated** Plesk FTP user restricted to the web root, not the main account.
- Pages CMS gets repo access through its GitHub App, scoped to this one repo. Marin's login is an email magic link.
- `.htaccess` sets the security headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, and a strict `Content-Security-Policy` that allows only self plus the inline lightbox script hash.
