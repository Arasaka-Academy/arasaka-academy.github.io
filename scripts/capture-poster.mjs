import { chromium } from '@playwright/test';
import sharp from 'sharp';

const browser = await chromium.launch({ args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  await page.goto(process.env.SITE_URL || 'http://127.0.0.1:4173');
  await page.locator('[data-scene="ready"]').waitFor({ timeout: 20_000 });
  await page.addStyleTag({ content: 'html,body,.site,.hero{background:transparent!important}.hero-grid,.hero:after{display:none!important}.hero-copy,.scene-node,.scene-device-label,.object-heading,.object-caption,.hero-footer,.hero-side-label{visibility:hidden!important}.hero-inner{width:1400px!important;margin:0!important;padding:0!important;grid-template-columns:500px 900px!important;min-height:1000px!important}.hero-object{margin:0!important}.scene-frame{width:900px!important;height:820px!important;aspect-ratio:auto!important}.scene-canvas canvas{filter:none!important}' });
  await page.locator('canvas').evaluate((canvas) => new Promise((resolve) => {
    const observer = new ResizeObserver(() => {
      if (canvas.width >= 900 && canvas.height >= 820) {
        observer.disconnect();
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }
    });
    observer.observe(canvas);
  }));
  const image = await page.locator('canvas').screenshot({ omitBackground: true });
  await sharp(image).webp({ quality: 91, alphaQuality: 100 }).toFile('public/images/ecosystem-poster.webp');
  console.log('Captured the exact Three.js installation as the shared static fallback.');
} finally { await browser.close(); }
