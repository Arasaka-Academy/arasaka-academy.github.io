import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
await mkdir('artifacts/lighthouse', { recursive: true });
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
try {
  let passing = true;
  for (const [name, route] of [['zh-CN', '/'], ['en', '/en/']]) {
    const result = await lighthouse(`${base}${route}`, { port: chrome.port, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    if (!result) throw new Error('Lighthouse did not return a report.');
    await writeFile(`artifacts/lighthouse/${name}.json`, result.report[0]);
    await writeFile(`artifacts/lighthouse/${name}.html`, result.report[1]);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round((category.score ?? 0) * 100)]));
    console.log(name, scores);
    if (scores.performance < 90 || scores.accessibility < 95) passing = false;
  }
  if (!passing) process.exitCode = 1;
} finally { await chrome.kill(); }
