import { readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';

// The 20 alternative designs (src/designs/NN/Page.astro → /dizajn/NN/) exist only on the dev site and in
// `astro dev`. A plain production build contains the original design alone.
const withDesigns = Boolean(process.env.DEV_SITE) || process.argv.includes('dev');
const designs = {
  name: 'designs',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      for (const nn of readdirSync('src/designs')) {
        injectRoute({ pattern: `/dizajn/${nn}`, entrypoint: `./src/designs/${nn}/Page.astro` });
      }
    },
  },
};

export default defineConfig({
  site: process.env.SITE ?? 'https://m2-keramika.hr',
  base: process.env.BASE ?? '/',
  integrations: withDesigns ? [designs] : [],
  // Never inline scripts as data/inline: keeps the lightbox an external file (strict CSP, see docs/03).
  vite: { build: { assetsInlineLimit: 0 } },
});
