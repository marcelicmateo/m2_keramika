# ADR-0003: Deploy to the existing kuhada.net hosting

- **Status:** Proposed
- **Date:** 2026-10-17
- **Deciders:** Mateo, Marin

## Context

The domain, DNS, website and **email** (`info@m2-keramika.hr`) are all on one paid shared-hosting account at kuhada.net (Plesk). Marin pays for it anyway because of the email. The new site is static files, so any host can serve it.

## Options considered

| Option | Cost | DNS changes | Email risk | Extras |
|---|---|---|---|---|
| **A. Existing Plesk hosting, deployed by GitHub Actions over SFTP/FTPS** | €0 extra | **None** | **None** | One provider, one bill. Apache `.htaccess` gives us redirects and headers |
| B. Cloudflare Pages | Free | Apex needs nameservers moved to Cloudflare, so every DNS record (including mail) must be re-created there | Medium: a mistake breaks email | Global CDN, preview URLs per change |
| C. Netlify | Free (limited build minutes) | A/CNAME changes at kuhada | Low | Preview URLs, CDN |
| D. GitHub Pages | Free | A/CNAME changes | Low | No `.htaccess`, so redirects and headers are limited |

The CDN benefit of B/C/D is small for a local business whose visitors are mostly in Croatia, and the static pages are already tiny. The risk to email and the extra provider are real costs for a non-technical owner.

## Decision

**Option A.** GitHub Actions builds the site and uploads `dist/` to the existing hosting:

- **Preferred transport:** `rsync` over SSH, if the kuhada plan allows SSH. It's fast, atomic enough, and deletes stale files.
- **Fallback:** FTPS with `SamKirkland/FTP-Deploy-Action` (pinned version), which syncs only changed files using a state file.
- A **dedicated Plesk FTP/SSH user** limited to the web root. Its credentials are stored only as GitHub secrets.
- A **staging subdomain** `novi.m2-keramika.hr` (its own docroot in Plesk) for review before cutover. Plesk creates its DNS record automatically.

## Consequences

- ✅ Email, DNS and billing stay as they are. Nothing changes for Marin's mailbox.
- ✅ No new accounts or providers apart from GitHub and Pages CMS.
- ⚠️ No automatic preview URL per change. Mitigation: the staging subdomain for developer work, and content edits go straight to production (by design; see [06](../06-deployment-and-migration.md)).
- ⚠️ Shared hosting has no CDN. It's acceptable here because the page is small and the audience is local. We can revisit B/C if traffic or audience changes.
- ⚠️ FTP uploads aren't atomic, so for a few seconds a visitor could get new HTML with old assets. Astro's hashed asset filenames mean old and new assets coexist, and the upload order is assets first, then HTML.
- 🔍 **To confirm with kuhada / in Plesk:** SSH availability on this plan, FTPS support, and whether we can create extra FTP users and subdomains.
