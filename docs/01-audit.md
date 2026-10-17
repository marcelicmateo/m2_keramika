# 01 — Audit of the current site

Snapshot taken **2026-10-17** from https://m2-keramika.hr/.

- Full-page screenshots: [desktop (1366 px)](audit/current-desktop.jpg), [mobile (390 px)](audit/current-mobile.jpg)
- Original price list download: [original-cjenik.csv](audit/original-cjenik.csv)

## Technical facts

| Item | Value |
|---|---|
| CMS | WordPress 7.1.3, block editor |
| Theme | Twenty Twenty-Four (default theme), no child theme, no plugins |
| Hosting | Shared hosting at **kuhada.net** (Plesk, Apache, PHP 8.4). Server `144.76.64.184` |
| DNS | Nameservers `ns1/ns2.kuhada.net`, managed in Plesk |
| Email | `info@m2-keramika.hr` on the **same server** (`MX 10 mail.m2-keramika.hr`, SPF `+a +mx +a:srv4.kuhada.net`) |
| www | `www.m2-keramika.hr` CNAMEs to the apex |
| Images | Phone photos, served at 768×1024 JPG. Originals are 0.4–1.9 MB. Logo PNG is **1.8 MB** |
| Fonts | Inter (body) and Cardo (headings), from the theme |
| Tracking/cookies | None found, so no consent banner is needed |

> ⚠️ **The email lives on the web server.** Any hosting change must leave the `MX`, `mail` A record and SPF untouched. See [06](06-deployment-and-migration.md#email-safety).

## Page structure (top to bottom)

1. **Header**: logo (beige textured tile) on the left; phone and email as black buttons on the right. The header sits on a blue-sky photo.
2. **Hero**: pool construction photo as the background, `M²KERAMIKA` in Cardo, and the subtitle "Obrt specijaliziran za keramičarske usluge".
3. **Intro**: ✳ ornament, Cardo heading "Vaša vizija ljepšeg doma…" and a centred paragraph.
4. **Services**: 2×2 grid. Each card has a ✳ ornament, an Inter semibold title, a bold lead sentence and a paragraph. The four services are tile laying, prep work, waterproofing and window sills.
5. **Quality + projects**: a full-width sky/pool photo background. It holds the Cardo heading "Naša posvećenost kvaliteti", a short text, then "Neki od projekata" with a loose collage of photos, a **Prije / U procesu / Poslije** (before / during / after) bathroom trio, and two more photos.
6. **Price list (Cjenik\*)**: black table with 4 columns: service, unit, price, and price from 10.09.2026. Below it are a disclaimer and a "download CSV" button.
7. **Footer**: black. Logo in a rounded beige pill, contact text, phone and email, owner name and address.

## What works — keep it

- **The identity.** The beige stone logo, the black/white/beige palette, Cardo headings over Inter body text, and the ✳ ornaments all feel calm and premium, and suit a craftsman.
- **Real photos of real work.** The pool, bathrooms and terrace photos are the strongest selling point.
- **Before / during / after.** This is the most persuasive part of the page.
- **A transparent price list.** It's unusual in this trade and builds trust.
- **Contact is everywhere.** Phone and email appear in the header and the footer.
- **Content order.** Who we are → what we do → proof → prices → contact is the right story.

## What's broken

### Mobile layout (most important)

| # | Problem | Where |
|---|---|---|
| M1 | Services stay **2 columns at 390 px**. Each column is about 150 px wide, so body text wraps every 2–3 words | Services |
| M2 | The price table keeps **4 columns**. Words break mid-word (`10.09.202 / 6.`) and rows are 5–6 lines tall | Cjenik |
| M3 | The header stacks logo, phone and email vertically. That takes about 250 px before any content appears | Header |
| M4 | Gallery photos sit **directly on top of a busy photo background**, so frames and labels ("Prije", "Poslije") blend into the sky and tiles | Projects |
| M5 | The hero title and subtitle sit on a busy photo with no overlay, so contrast varies | Hero |

### Desktop layout

| # | Problem |
|---|---|
| D1 | The project collage is uneven: odd sizes, overlapping alignment, and a large empty gap above the second row |
| D2 | The price table and "Cjenik\*" heading run full-bleed to the screen edges, unlike every other section |
| D3 | The price table has an empty last row |
| D4 | The two price columns are identical, and the "from 10.09.2026" date has already passed |

### Text and content

| # | Problem |
|---|---|
| C1 | Typo: "sve **priprem** radove" should be "sve **pripremne** radove" |
| C2 | Sentence cut off: "…terasa i balkona **koristeći.**" (using… what?) |
| C3 | Bold lead sentences are missing a full stop ("…prodora vode Vlaga je…") |
| C4 | Decimal points instead of Croatian commas (`0.4m2` should be `0,4 m²`), and `40X80` should be `40 × 80 cm` |
| C5 | Phone shown as `+385955127986`, which is hard to read and dictate. It should be `+385 95 512 7986` |
| C6 | No `alt` text on any project photo |
| C7 | Page title is just "M2Keramika", with no meta description. Nothing tells Google it's a tiler in Zadar |
| C8 | Croatian business-site legal details (OIB, register entry) are missing. See [07 open questions](07-roadmap.md#open-questions) |

### Performance

| # | Problem |
|---|---|
| P1 | Logo PNG is 1.8 MB and is loaded twice (header + footer) |
| P2 | Background photos are 0.9–1.9 MB JPGs, not resized for phones |
| P3 | No modern image formats (WebP/AVIF) and no responsive `srcset` for backgrounds |
| P4 | WordPress loads block-library CSS and emoji scripts the page doesn't need |

### Maintenance

- The block editor gives Marin full layout freedom. That freedom is how the mobile problems appeared, and it will let them reappear.
- WordPress core and the theme need regular security updates on a site that is otherwise static.
