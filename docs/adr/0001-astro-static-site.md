# ADR-0001: Astro static site instead of WordPress

- **Status:** Proposed
- **Date:** 2026-10-17
- **Deciders:** Mateo (developer), Marin (owner)

## Context

The current site is WordPress with the default Twenty Twenty-Four theme. Marin laid it out himself in the block editor. The mobile layout problems in [01-audit](../01-audit.md) come directly from that freedom: columns and tables built for desktop that the editor doesn't adapt.

The site is one page and changes a few times a year (new photos, price updates). It needs to be fast, responsive, hard to break, and cheap to maintain.

## Options considered

| Option | For | Against |
|---|---|---|
| **A. Keep WordPress, fix it** (child theme, custom CSS, block patterns) | Marin already knows the editor. No migration | The block editor still lets him break layouts again. Core and theme updates and PHP security patching continue forever. The heavy CSS and JS stay. Hard to version-control |
| **B. Hand-written HTML/CSS** | Simplest possible output | No image pipeline and no content/code separation. Every edit is in HTML, which is a non-starter for Marin |
| **C. Eleventy** | Very simple, mature, zero-JS | Image optimisation and content validation have to be assembled from plugins. Templates are less structured |
| **D. Astro (static output)** | Zero-JS HTML by default. **Built-in responsive image pipeline** (AVIF/WebP/srcset). **Typed content collections with schema validation**. Components keep markup tidy. Large, active community | One more framework to keep updated, but it's only a build tool and nothing runs in production |

## Decision

**Option D: Astro**, with `output: 'static'` and no UI framework integrations.

The two built-in features decide it:

1. **Image pipeline.** Marin uploads raw phone photos. Astro makes them fast automatically, which matters more than anything else here, because the page is mostly photos.
2. **Content schemas.** Marin edits structured fields. If he makes a bad edit, the build fails and production stays as it was. That's how we deliver "hard to break" (requirement goal 6).

## Consequences

- ✅ The live site is static files: fast, secure, nothing to patch on the server.
- ✅ Layout lives in code, so Marin can't accidentally make it unresponsive.
- ✅ All content and photos are versioned in git, so every change can be undone.
- ⚠️ Marin loses free-form layout editing. If he wants a *new kind* of section, Mateo builds it. This is intentional, but we must explain it to him up front.
- ⚠️ A Node/Astro major upgrade is needed every 1–2 years. That's a developer chore, and the site keeps working if we skip it (build pinned via lockfile and Node version).
- ⚠️ WordPress gets decommissioned. Plan in [06](../06-deployment-and-migration.md#cutover-from-wordpress).
