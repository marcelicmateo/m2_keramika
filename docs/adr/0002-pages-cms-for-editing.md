# ADR-0002: Pages CMS for editing

- **Status:** Proposed
- **Date:** 2026-10-17
- **Deciders:** Mateo, Marin

## Context

Marin isn't technical. He must be able to change texts, prices and photos himself, ideally from his phone after finishing a job, and he must not need a GitHub account, a terminal, or an understanding of git. Content lives as YAML files in the repo ([ADR-0001](0001-astro-static-site.md)), so we need a **git-based CMS** that edits those files through friendly forms.

## Options considered

| Option | Login for Marin | Infra we must run | Notes |
|---|---|---|---|
| **Pages CMS** (hosted app) | **Email invite, no GitHub account** | None | Open source and can be self-hosted later. Config is one `.pages.yml`. Edits YAML/JSON directly. Labels and help text are fully customisable, so we can write them in Croatian |
| Sveltia CMS | GitHub account, or a token | OAuth helper (Cloudflare Worker) | Modern Decap replacement with a good UI, but Marin would need a GitHub account |
| Decap CMS (ex-Netlify CMS) | GitHub account, or Netlify Identity (deprecated) | OAuth helper | Ageing and slow to develop |
| TinaCMS | Tina Cloud account | Tina Cloud (free tier) | Heavier, React-based, ties content to their GraphQL layer |
| CloudCannon | Own account | None | Excellent but **paid** |
| Edit YAML on github.com | GitHub account | None | Fallback only. Too technical for Marin |

## Decision

**Pages CMS**, using the hosted app at app.pagescms.org:

- Mateo owns the GitHub repo and installs the Pages CMS GitHub App on that repo only.
- Marin is invited as a **collaborator by email**. He signs in with a magic link and can edit content and media, but cannot change the config or invite others.
- `.pages.yml` defines one sidebar entry per content file (see [05](../05-content-model.md)), with Croatian labels, descriptions and sensible limits.
- Set `settings.commit.identity: user` so commits show Marin's name. The git history then shows who changed what.

## Consequences

- ✅ No accounts for Marin to manage beyond his email, and no servers for us.
- ✅ Content stays plain YAML in our repo, so there's no lock-in. If Pages CMS disappears, we can self-host it (open source) or switch to Sveltia CMS with the same files.
- ⚠️ The Pages CMS interface (buttons, menus) is in English. Only our field labels and help text are Croatian. We cover this in the Croatian editor guide with screenshots.
- ⚠️ We depend on a third-party hosted service for *editing*, but not for *serving*. If it's down, the site stays up and Marin waits or calls Mateo.
- 🔍 **To verify in milestone M0 (spike):** the image field's output path must work with Astro's `image()` schema helper (relative path from the YAML file to `src/assets/uploads/`). Also check the upload size limit for large phone photos, and phone-browser usability of list/reorder fields.
