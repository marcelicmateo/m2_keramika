# 04 — Design system

**Principle: keep Marin's design, fix how it behaves.** Every token below comes from the current site (Twenty Twenty-Four presets plus his choices). Nothing is invented. Changes are limited to spacing consistency, overlays for legibility, and responsive behaviour.

Reference: [current desktop](audit/current-desktop.jpg), [current mobile](audit/current-mobile.jpg).

## Tokens (`src/styles/tokens.css`)

### Colour

| Token | Value | Source | Use |
|---|---|---|---|
| `--c-bg` | `#ffffff` | TT4 `base-2` | Main page background |
| `--c-bg-soft` | `#f9f9f9` | TT4 `base` | Alternate section background |
| `--c-ink` | `#111111` | TT4 `contrast` | Text, buttons, price table, footer |
| `--c-ink-soft` | `#636363` | TT4 `contrast-2` | Secondary text, units, footnotes (5.9:1 on white ✅) |
| `--c-line` | `#a4a4a4` | TT4 `contrast-3` | Hairlines on dark backgrounds |
| `--c-stone` | `#cfcabe` | TT4 `accent` | Logo pill, ornaments on dark |
| `--c-sand` | `#c2a990` | TT4 `accent-2` | Hover and focus accents (8.1:1 on `#111` ✅) |
| `--c-on-dark` | `#ffffff` | — | Text on ink and on photo overlays |
| `--overlay` | `linear-gradient(rgb(17 17 17 / .15), rgb(17 17 17 / .55))` | new | Over hero and background photos so white text is always ≥ 4.5:1 |

There is no dark mode. The site's identity *is* this light/ink contrast, and the footer and price list already provide the dark moments.

### Typography

| Token | Value | Use |
|---|---|---|
| `--f-heading` | `"Cardo", Georgia, serif` | Hero title, section headings (h1, h2) |
| `--f-body` | `"Inter Variable", system-ui, sans-serif` | Everything else, including service titles (h3, 600 weight) as on the current site |
| `--fs-hero` | `clamp(2.5rem, 1.6rem + 4.5vw, 4.75rem)` | `M²KERAMIKA` |
| `--fs-h2` | `clamp(1.875rem, 1.4rem + 2.2vw, 2.75rem)` | Cardo section headings |
| `--fs-h3` | `clamp(1.25rem, 1.1rem + .6vw, 1.625rem)` | Service titles, "Neki od projekata" |
| `--fs-lead` | `clamp(1.0625rem, 1rem + .3vw, 1.25rem)` | Hero subtitle, intro paragraph |
| `--fs-body` | `1.0625rem` (17 px) | Body. Slightly larger than now for phone readability |
| `--fs-small` | `.875rem` | Units, footnotes, captions |
| `--lh-body` | `1.6` | |
| `--lh-heading` | `1.15` | |
| `--measure` | `62ch` | Max line length for paragraphs |

Fonts are self-hosted WOFF2 with `font-display: swap`. Only Latin and Latin-Extended subsets are loaded (covering č ć đ š ž). Cardo 400 only, Inter variable.

### Spacing and layout

| Token | Value |
|---|---|
| `--space-1 … --space-8` | `.25 .5 .75 1 1.5 2 3 4.5 rem` (1→8) |
| `--section-y` | `clamp(3.5rem, 2rem + 6vw, 7.5rem)` vertical padding per section |
| `--gutter` | `clamp(1rem, .5rem + 2.5vw, 2.5rem)` side padding; 16 px minimum on phones |
| `--wrap` | `72rem` (1152 px) max content width; text blocks capped at `--measure` |
| `--radius` | `.5rem` for photos and buttons (current photos have a slight radius); `999px` for the footer logo pill |

### Breakpoints

Mobile-first, with only two global breakpoints. Components use **container queries** where they live in variable-width columns.

| Name | Min width | What changes |
|---|---|---|
| base | 0 | Single column everywhere |
| `md` | 40rem (640 px) | Gallery 2 columns; price list becomes a table; header shows the email button |
| `lg` | 60rem (960 px) | Services 2×2; gallery 3 columns; before/after trio side-by-side |

## Components

### Ornament ✳

The eight-point asterisk icon from TT4, as an inline SVG component, `1.5rem`, `currentColor`, `aria-hidden`. It's placed above every section heading and service title, exactly as now.

### Button

The black pill/rectangle Marin uses: `--c-ink` background, white text, Inter 500, padding `.75rem 1.25rem`, **min height 44 px**, `--radius`.

- Hover and focus: background `#2a2a2a`. Focus ring is 2 px `--c-sand` with a 2 px offset.
- Variant `on-dark`: white background with ink text (footer).
- An optional leading icon (phone, envelope, download) is an inline SVG at 1.1em.

### Header

| | Phone | ≥ md |
|---|---|---|
| Layout | Logo left (max 120 px wide), **one phone button** right ("Nazovite" plus an icon) | Logo left (160 px), phone and email buttons right |
| Height | ≤ 80 px (currently about 250 px) | as now |
| Background | Same sky photo strip as now, cropped to the header height | as now |

The header is **not** sticky: the page is short and contact appears again at the end.

### Hero

- Full-width pool photo (`<img>` with `object-fit: cover`, focal point kept at `32% 44%` as Marin set it), plus `--overlay`.
- Height `min(70svh, 40rem)` on desktop and `60svh` on phones (not taller, so the intro peeks in and invites scrolling).
- `M²KERAMIKA` in Cardo (`--fs-hero`) uses a real `<sup>2</sup>`. The subtitle is in Inter (`--fs-lead`). Both are white and left-aligned in the bottom third, as now.

### Intro

The centred ornament, Cardo h2 and paragraph, exactly as now. The paragraph is capped at `--measure`.

### Services

- Grid: 1 column (base), 2 columns (`lg`). Gap `--space-7`. Cards have no boxes or borders, as now.
- Card: ornament → h3 (Inter 600) → paragraph with the **bold lead sentence** (`<strong>`, ending with a full stop) followed by normal text.

### Quality and projects (photo background section)

Keeps Marin's signature look: a full-bleed sky/pool photo behind the section.

- Background: `<img>` positioned absolutely with `object-fit: cover`, plus `--overlay` at a stronger setting (`.35 → .7`) so white text and photo frames stand out.
- **Change:** the gallery sits inside a clean container. Photos get a 4 px white frame and a soft shadow, so they read as *photos on a wall* instead of blending into the background (fixes audit M4).
- No `background-attachment: fixed`: it breaks on iOS and costs scroll performance.

**Gallery grid** (fixes audit D1):

| Width | Columns | Photo aspect |
|---|---|---|
| base | 1 (or 2 when the container is ≥ 28rem) | 3:4 portrait (all current photos are 3:4) |
| md | 2 | 3:4 |
| lg | 3 | 3:4 |

All tiles are the same size, which makes it calm and predictable. Each tile is a link (lightbox), with an `alt` from the CMS description and an optional visible caption.

**Before / during / after set:**

- `lg`: three photos side by side, each with a label above: **Prije · U procesu · Poslije**. An optional set title sits above them.
- base: a horizontal **scroll-snap strip** (one photo at about 85% width, swipe to the next) with the label on each photo. This keeps the story together without three screen-heights of scrolling. A visible "← povucite →" (swipe) hint shows on touch devices.
- "U procesu" (during) is optional per set.

**Lightbox:** native `<dialog>`, ink background at 95%, image `max-height: 90svh`, caption below, prev/next buttons and swipe, close button top-right (44 px). It traps focus, closes on `Esc`, and on close restores focus to the thumbnail.

### Price list (Cjenik)

Keeps the **black table** identity. Inside the normal content width with side gutters (fixes D2), not full-bleed.

**≥ md: table**

| Usluga | Jedinica | Cijena | *(Nova cijena od DD.MM.YYYY. — only if any new price is set)* |
|---|---|---|---|

- `--c-ink` background, white text, 1 px `--c-line` row separators (no vertical lines; it's calmer). Service names are left-aligned and prices right-aligned with tabular numbers.
- Row hover tint is `#1d1d1d`.

**base (phone): stacked list, same black panel**

```
┌───────────────────────────────────┐
│ Ugradnja pločica do 0,4 m²   30 € │
│ po m²                             │
├───────────────────────────────────┤
│ Postava sokle    ⅓ cijene po m²   │
│ po m¹ (dužni metar)               │
└───────────────────────────────────┘
```

The same `<table>` markup is restyled with CSS (rows become flex blocks, and the header row is visually hidden but kept for screen readers). This avoids two copies of the content.

Below the panel:

- The footnote (`*Cjenik je informativnog karaktera…`) in `--fs-small`
- Button: **Preuzmite cjenik (CSV)** with a download icon
- *(Optional, decide in 07)* button: **Ispiši cjenik** (print the price list). It uses a print stylesheet that prints only the price list on white

Units render as `m²` and `m¹` (real superscripts, not `<sup>` hacks). Prices are formatted Croatian style: `30 €`, `1.250 €`, `2,50 €`.

### Footer / contact

As now: an ink background with the logo in a `--c-stone` rounded pill, the contact text, phone and email buttons (`on-dark` variant), and the owner and address lines. Added:

- The address links to Google Maps (no embedded map, so no third-party request).
- Legal line (OIB, register) in `--fs-small` *if Marin provides it*.
- `© 2026 M² Keramika`, with the year generated at build.

## Accessibility checklist (design-level)

- One `h1` (hero), `h2` per section, `h3` for services. There are no skipped levels.
- Text over photos always sits on `--overlay`. It's verified ≥ 4.5:1 against the *brightest* area of each photo.
- Every interactive element is ≥ 44×44 px and has a visible `:focus-visible` ring.
- `prefers-reduced-motion`: there's no smooth scroll or lightbox animation.
- Phone numbers are wrapped in `tel:` links with a readable label and `+385 95 512 7986` as the visible text.
- `lang="hr"` is set on `<html>`.

## What we deliberately don't change

The logo, colours, fonts, ornaments, section order, the hero photo and its focal point, the photo-background projects section, the black price table, the black footer, and all of Marin's photos.
