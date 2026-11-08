import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/en/']) {
  test.describe(route === '/' ? 'Chinese homepage' : 'English homepage', () => {
    test('ships readable static content and complete project links', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-project]')).toHaveCount(6);
      await expect(page.locator('html')).toHaveAttribute('lang', route === '/' ? 'zh-CN' : 'en');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://arasaka-academy.github.io${route}`);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://arasaka-academy.github.io/en/');
      await page.locator('img').evaluateAll((images) => images.forEach((image) => { if (image instanceof HTMLImageElement) image.loading = 'eager'; }));
      await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
      for (const name of ['CyberOS', 'CyberMachine', 'CyberVisual', 'CyberController', 'CyberAudio', 'CyberUI']) {
        await expect(page.locator(`[data-project] a[href="https://github.com/Arasaka-Academy/${name}"]`)).toHaveCount(1);
      }
      expect(errors).toEqual([]);
      await page.reload();
      await expect(page.locator('h1')).toBeVisible();
    });

    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      test(`fits a ${width}px viewport`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await expect(page.locator('#projects')).toBeAttached();
        if (width < 1024) {
          await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
          expect(await page.locator('canvas').count()).toBe(0);
        }
      });
    }

    test('has no serious or critical accessibility violations', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(result.violations).toEqual([]);
    });

    test('remains useful without JavaScript', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-project]')).toHaveCount(6);
      await expect(page.locator('.hero-poster')).toBeVisible();
      await context.close();
    });
  });
}

test('switches language while retaining the current section', async ({ page }) => {
  await page.goto('/#inside');
  await page.locator('[data-language-switch]').first().click();
  await expect(page).toHaveURL(/\/en\/#inside$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('[data-language-switch]').first().click();
  await expect(page).toHaveURL(/\/#inside$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});

test('retains the current section after manual scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#about').evaluate((element) => element.scrollIntoView());
  await expect(page.locator('[data-language-switch]').first()).toHaveAttribute('href', '/en/#about');
  const scrollPosition = await page.evaluate(() => window.scrollY);
  await page.locator('[data-language-switch]').first().scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollPosition);
  await page.locator('[data-language-switch]').first().click();
  await expect(page).toHaveURL(/\/en\/#about$/);
});

test('mobile navigation opens, closes, and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#mobile-navigation a[href="#projects"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#projects$/);
});

test('keyboard users receive a working skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('reduced motion never downloads or starts the WebGL scene', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
  await expect(page.locator('canvas')).toHaveCount(0);
  const animations = await page.locator('h1').evaluate((element) => getComputedStyle(element).animationName);
  expect(animations).toBe('none');
});

test('WebGL unavailability leaves the poster intact', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...arguments_: unknown[]) {
      if (contextId.includes('webgl')) return null;
      return Reflect.apply(original, this, [contextId, ...arguments_]);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
  await expect(page.locator('.hero-poster')).toBeVisible();
});

test('desktop enhancement responds to lifecycle and preference changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'ready', { timeout: 20_000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.locator('#join').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-running', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('a lost GPU context restores the static composition', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'ready', { timeout: 20_000 });
  await page.locator('canvas').evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
  await expect(page.locator('.hero-poster')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('a failed 3D download leaves navigation and poster usable', async ({ page }) => {
  let blocked = false;
  await page.route('**/_next/static/chunks/*.js', async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    if (source.includes('THREE.WebGLRenderer')) {
      blocked = true;
      await route.abort();
    } else await route.fulfill({ response });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect.poll(() => blocked, { timeout: 20_000 }).toBe(true);
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
  await expect(page.locator('.hero-poster')).toBeVisible();
  await expect(page.locator('a[href="#projects"]').first()).toBeVisible();
});

test('data-saving mode never creates a WebGL canvas', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {}, removeEventListener() {} } }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'poster');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('the static site includes a useful 404 page', async ({ page }) => {
  const response = await page.goto('/nothing-has-been-built-here/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'OFF THE GRID.' })).toBeVisible();
  await page.getByRole('link', { name: /BACK HOME/ }).click();
  await expect(page.locator('#hero-title')).toBeVisible();
});
