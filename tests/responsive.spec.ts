import { test, expect } from '@playwright/test';

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

test('cjenik.csv postoji i počinje s UTF-8 BOM', async ({ request }) => {
  const res = await request.get('cjenik.csv');
  expect(res.status()).toBe(200);
  expect((await res.text()).startsWith('﻿')).toBe(true);
});
