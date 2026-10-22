import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE ?? 'https://m2-keramika.hr',
  base: process.env.BASE ?? '/',
  // Never inline scripts as data/inline: keeps the lightbox an external file (strict CSP, see docs/03).
  vite: { build: { assetsInlineLimit: 0 } },
  // CSS goes inside the HTML, so the browser can paint without waiting for extra files.
  build: { inlineStylesheets: 'always' },
});
