# 02 — Requirements

## Goals

1. **Keep Marin's design.** Visitors who know the current site should recognise it immediately: same logo, palette, fonts, ornaments, section order and photos. We polish it; we don't redesign it.
2. **Responsive on every screen**, from 320 px phones to 2560 px monitors, with no horizontal scrolling and no squeezed columns.
3. **More human-readable.** Fix typos and units, use clear Croatian, readable phone numbers, a price list that reads like a list, and proper headings.
4. **Easy to edit.** Marin can change text, photos and prices from his phone or laptop, in Croatian forms, without help.
5. **Easy to publish.** Saving in the editor *is* publishing. He doesn't need any other step.
6. **Hard to break.** He can't damage the layout, and a bad edit never takes the live site down.
7. **Simple to maintain.** We avoid plugins, a database and servers to patch. It should still work untouched in 5 years.

## Non-goals

- A redesign or new brand identity
- Multiple pages, a blog, or a multilingual (EN/DE) version. The structure shouldn't prevent these later, but they are out of scope now
- A contact form (it needs a mail backend and spam protection). Phone and email links are enough, and are what his customers use
- Online booking, a quote calculator, or e-commerce
- Analytics and cookies (may be added later, cookieless only)

## Users

| User | Needs |
|---|---|
| **Customer on a phone** (most visitors) | See quickly that he does good work, find prices, and call with one tap |
| **Customer on a desktop** | Browse photos in detail and read services and prices |
| **Marin (editor)** | Add new project photos after a job, update prices, and fix a sentence. He isn't technical |
| **Mateo (developer/maintainer)** | Review changes, fix problems, and get told if a publish fails |

## Functional requirements

| ID | Requirement |
|---|---|
| F1 | All sections from the current site, in the same order: header, hero, intro, services, quality and projects, price list, footer/contact |
| F2 | Phone links use `tel:` and email links use `mailto:`, and they work with one tap on mobile |
| F3 | Project photos open full-size on tap or click (lightbox), and work without JavaScript |
| F4 | Before / during / after sets render as one labelled group |
| F5 | The price list is readable on mobile without horizontal scrolling |
| F6 | The price list is downloadable as a file (CSV today) generated from **the same data** as the table, so it can never drift |
| F7 | Optional "new prices from date X" column. It shows only when new prices are entered |
| F8 | Marin can edit: business details, all section texts, services (add, remove, reorder), gallery photos, before/after sets, and price list rows |
| F9 | The editor is in Croatian (labels, help text) and works on a phone browser |
| F10 | Every save publishes automatically within about 3 minutes |
| F11 | Invalid content (such as a missing required field) blocks the publish, and the previous version stays live. Mateo gets an email |
| F12 | Old URLs that may be bookmarked or indexed (the CSV under `/wp-content/uploads/…`) redirect to the new equivalents |

## Non-functional requirements and success criteria

| Area | Target | How we measure |
|---|---|---|
| Responsive | No horizontal scroll and no text column under 260 px at 320, 375, 390, 768, 1024, 1366 and 1920 px | Playwright check in CI |
| Performance | Lighthouse mobile performance ≥ 95. LCP < 2.0 s on simulated slow 4G. First-load transfer < 600 KB | Lighthouse CI |
| JavaScript | Under 3 KB of our own JS; the lightbox is the only interactive part | Build output |
| Accessibility | WCAG 2.2 AA. Lighthouse a11y = 100. All photos have alt text. Text contrast ≥ 4.5:1, including text over photos. Tap targets ≥ 44 px | Lighthouse + manual check |
| SEO | Croatian `lang`, a descriptive title and meta description, `LocalBusiness` structured data, Open Graph image, sitemap | Lighthouse SEO = 100, Rich Results test |
| Privacy | No cookies, no third-party requests (fonts self-hosted) | DevTools network tab |
| Browsers | Last 2 versions of Chrome, Safari (iOS ≥ 16), Firefox and Samsung Internet | Manual check on real devices before launch |
| Editing | Marin completes "replace a photo", "change a price" and "add a service" unaided, after one 30-minute session | Training session |
| Reliability | A failed build never changes the live site. Rollback in under 5 minutes | Tested before cutover |
| Cost | €0 on top of the current hosting and domain | — |
