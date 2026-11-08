import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
await mkdir('artifacts/screenshots', { recursive: true });
await mkdir('docs/images', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const [locale, route] of [['zh-CN', '/'], ['en', '/en/']]) {
    for (const [device, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await page.goto(`${base}${route}`);
      await page.evaluate(() => document.fonts.ready);
      if (device === 'desktop') await page.locator('[data-scene="ready"]').waitFor({ timeout: 20_000 });
      for (const image of await page.locator('img').all()) await image.evaluate((element) => { element.loading = 'eager'; });
      await page.evaluate(async () => { await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => {}))); });
      await page.screenshot({ path: `artifacts/screenshots/${locale}-${device}-hero.png`, animations: 'disabled' });
      await page.screenshot({ path: `artifacts/screenshots/${locale}-${device}-full.png`, animations: 'disabled', fullPage: true });
      await sharp(`artifacts/screenshots/${locale}-${device}-hero.png`).webp({ quality: 84 }).toFile(`docs/images/${locale}-${device}.webp`);
      await page.close();
    }
  }
} finally { await browser.close(); }
