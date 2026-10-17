import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE ?? 'https://m2-keramika.hr',
  base: process.env.BASE ?? '/',
});
