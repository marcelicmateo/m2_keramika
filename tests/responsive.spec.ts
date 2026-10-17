import { test, expect } from '@playwright/test';
import { designs, designPath } from '../src/designs';

for (const width of [320, 390, 768, 1366, 1920]) {
  test(`stranica radi na širini ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');

    // Nema vodoravnog pomicanja.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // Telefon je vidljiv.
    await expect(page.locator('a[href^="tel:"]:visible').first()).toBeVisible();

    // Svaka slika ima alt (pozadine namjerno alt=""), fotografije radova neprazan alt.
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    const photos = page.locator('.gallery img, .set img');
    expect(await photos.count()).toBeGreaterThan(0);
    for (const alt of await photos.evaluateAll((els) => els.map((e) => e.getAttribute('alt')))) {
      expect(alt?.trim()).toBeTruthy();
    }
  });
}

// Alternative designs: same basics, at a phone, a small phone and a laptop width.
for (const d of designs.filter((d) => d.slug !== '00')) {
  for (const width of [320, 390, 1366]) {
    test(`dizajn ${d.slug} radi na širini ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(designPath(d.slug));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(page.locator('a[href^="tel:"]:visible').first()).toBeVisible();
      await expect(page.locator('img:not([alt])')).toHaveCount(0);
    });
  }
}

test('cjenik.csv postoji i počinje s UTF-8 BOM', async ({ request }) => {
  const res = await request.get('cjenik.csv');
  expect(res.status()).toBe(200);
  expect((await res.text()).startsWith('﻿')).toBe(true);
});
