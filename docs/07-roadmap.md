# 07 — Roadmap and open questions

## Milestones

| # | Milestone | Outcome | Est. effort |
|---|---|---|---|
| **M0** | Setup and spike | GitHub repo, Astro skeleton, CI building, Pages CMS connected to a test file, image upload proven end-to-end, deploy to `novi.` working | 0.5–1 day |
| **M1** | Layout and design tokens | All sections built with hard-coded content; tokens, fonts, ornaments; responsive at all breakpoints | 1–1.5 days |
| **M2** | Content model | YAML files plus schemas; components read from content; `.pages.yml` with Croatian labels and help text | 0.5–1 day |
| **M3** | Photos, gallery, price list | Image pipeline, gallery grid, before/after strip, lightbox, price table/list, CSV endpoint, optional print view | 1–1.5 days |
| **M4** | Quality pass | SEO meta and JSON-LD, `.htaccess`, 404, Playwright suite, Lighthouse targets met, real-device checks | 1 day |
| **M5** | Review and training | Marin reviews staging and approves copy edits; Croatian editor guide with screenshots (`docs/uputa-za-uredivanje.md`); 30-minute training session | 0.5 day + his time |
| **M6** | Launch | Cutover per [06](06-deployment-and-migration.md#cutover-from-wordpress), test email, Search Console, then decommission WordPress after 30 days | 0.5 day |

The total is about **5–7 developer days**.

## Task breakdown

### M0 — Setup and spike
- [ ] Create a GitHub repo (owner: see Q1) and push the docs
- [ ] `npm create astro@latest` (minimal, TypeScript strict), pin Node 22 in `.nvmrc` and `engines`
- [ ] Install fonts (`@fontsource-variable/inter`, `@fontsource/cardo`)
- [ ] Get Plesk access: create a dedicated FTP/SSH user and the `novi.` subdomain (Q2)
- [ ] `deploy.yml` (build → upload to staging)
- [ ] **Spike:** install the Pages CMS GitHub App, add a minimal `.pages.yml`, upload a phone photo from a phone browser, and confirm Astro `image()` resolves the path and the build passes. Test HEIC/large-file behaviour
- [ ] Download originals from `wp-content/uploads/` into `src/assets/`

### M1 — Layout
- [ ] `tokens.css`, `global.css` (reset, base type)
- [ ] `Base.astro` layout, `Ornament`, `Button`
- [ ] Header, Hero, Intro, Services, Quality and projects shell, Price list shell, Footer
- [ ] Optimise the logo (WebP/AVIF; ask for a vector original, Q6)

### M2 — Content
- [ ] `content.config.ts` schemas for all 6 files
- [ ] Migrate current text into YAML, applying **group A** copy fixes only (B waits for Marin)
- [ ] `.pages.yml` complete, with Croatian labels, descriptions and limits

### M3 — Photos and prices
- [ ] Gallery grid with `<Picture>` and srcset
- [ ] Before/after: desktop trio and mobile scroll-snap strip
- [ ] Lightbox (`<dialog>`, keyboard, swipe, no-JS fallback)
- [ ] Price list: one `<table>`, responsive CSS, optional new-price column
- [ ] `cjenik.csv.ts` endpoint (BOM, `;`)
- [ ] Draft `alt` texts for all photos

### M4 — Quality
- [ ] `<title>`, meta description, OG image, `@astrojs/sitemap`, `robots.txt`, JSON-LD
- [ ] `.htaccess` (redirects, caching, headers, 404)
- [ ] Playwright responsive spec, wired into CI
- [ ] Lighthouse CI config and budgets
- [ ] Real-device pass

### M5 / M6
- [ ] See milestones above and [06 launch checklist](06-deployment-and-migration.md#launch-checklist)

## Open questions

**Blocking** means it must be answered before that milestone starts.

| # | Question | For | Blocks | Default if no answer |
|---|---|---|---|---|
| Q1 | Who owns the GitHub repo: Mateo's account, or a new `m2-keramika` org with both as owners? | Mateo, Marin | M0 | Mateo's account; transfer later if needed |
| Q2 | Kuhada/Plesk access: can we get a login (or have Marin create one), and does the plan allow **SSH**, extra FTP users and subdomains? | Marin / kuhada | M0 | FTPS fallback |
| Q3 | Which waterproofing materials does he use (to finish the cut-off sentence)? | Marin | M5 | Generic: "…koristeći provjerene hidroizolacijske sustave." |
| Q4 | Publish the full street address and house number? | Marin | M5 | Street and city only, as now |
| Q5 | Add OIB to the footer? Recommended for a Croatian business site (Zakon o elektroničkoj trgovini requires provider identification details) | Marin | M5 | Add it if provided |
| Q6 | Does he have the logo as a vector file (AI/SVG/PDF) from whoever designed it? | Marin | M1 (nice to have) | Optimised raster from the current PNG |
| Q7 | Approve copy-edit groups A, B and C in [05](05-content-model.md#proposed-copy-edits)? | Marin | M5 | A applied, B and C proposed on staging |
| Q8 | Service area: only Zadar, or the whole Zadar county / Dalmatia? (affects SEO text) | Marin | M4 | Zadarska županija |
| Q9 | Keep the CSV download, replace it with a printable price list, or offer both? | Marin | M3 | Both |
| Q10 | Are there more and newer project photos he'd like on the site at launch? | Marin | M3 | Current 8 photos |

## Possible later additions (not in scope)

- English or German version for tourist-season clients (holiday apartments in Dalmatia are a big tiling market)
- Cookieless visitor stats (e.g. self-hosted Umami or Plausible)
- Google Business Profile reviews snippet (static, updated manually)
- WhatsApp / Viber link next to the phone number, if that's how his customers reach him
