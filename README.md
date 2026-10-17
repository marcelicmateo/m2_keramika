# M² Keramika — website

Rebuild of [m2-keramika.hr](https://m2-keramika.hr/), the one-page site of **M² Keramika**, a tiling business (obrt) in Zadar run by Marin Mašina.

**Goal:** keep the look and content Marin built himself, but make the site work well on every screen, read better, load fast, and stay easy for him to edit and publish without technical help.

## The short version

| Question | Answer |
|---|---|
| What is the site built with? | [Astro](https://astro.build) static site: plain HTML/CSS, almost no JavaScript |
| How does Marin edit it? | [Pages CMS](https://pagescms.org): a web editor with simple Croatian forms. He logs in by email, with no GitHub account |
| How does it go live? | Every save in the editor triggers GitHub Actions, which builds the site and uploads it to the existing hosting (kuhada.net) |
| What does it cost? | Nothing beyond the hosting and domain he already pays for |
| Can he break the layout? | No. He edits text, photos and prices, not layout. A broken entry fails the build and the live site stays as it was |

## Documentation

| # | Document | What's in it |
|---|---|---|
| 01 | [Audit of the current site](docs/01-audit.md) | What exists today, what works, what's broken (with screenshots) |
| 02 | [Requirements](docs/02-requirements.md) | Goals, non-goals, who uses it, measurable success criteria |
| 03 | [Architecture](docs/03-architecture.md) | Tooling, repo layout, build and edit flow, testing |
| 04 | [Design system](docs/04-design-system.md) | Colours, type, spacing, components, section-by-section responsive spec |
| 05 | [Content model & copy edits](docs/05-content-model.md) | Content files, CMS forms, proposed text fixes |
| 06 | [Deployment & migration](docs/06-deployment-and-migration.md) | Pipeline, staging, cutover from WordPress, rollback, email safety |
| 07 | [Roadmap & open questions](docs/07-roadmap.md) | Milestones, task breakdown, decisions waiting on Marin |

Architecture decision records:

- [ADR-0001: Astro static site instead of WordPress](docs/adr/0001-astro-static-site.md)
- [ADR-0002: Pages CMS for editing](docs/adr/0002-pages-cms-for-editing.md)
- [ADR-0003: Deploy to the existing kuhada.net hosting](docs/adr/0003-deploy-to-existing-hosting.md)

## Status

**Design phase.** Design documents are written and no code exists yet. Next step: resolve the blocking questions in [07-roadmap](docs/07-roadmap.md#open-questions), then start milestone M0.
