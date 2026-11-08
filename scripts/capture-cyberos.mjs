import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const source = process.env.CYBEROS_SOURCE;
if (!source) throw new Error('Set CYBEROS_SOURCE to a local CyberOS checkout. This is only needed to regenerate the supplied screenshot.');
const root = path.join(source, 'packages/web');
const { createServer } = await import(pathToFileURL(path.join(source, 'node_modules/vite/dist/node/index.js')).href);
const cache = await mkdtemp(path.join(tmpdir(), 'arasaka-cyberos-'));
const server = await createServer({ root, configFile: path.join(root, 'vite.config.ts'), cacheDir: cache, server: { host: '127.0.0.1', port: 5189, strictPort: true, proxy: {} } });
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    localStorage.setItem('cyberos:language', 'en');
    localStorage.setItem('cyberos:appearance:v1', JSON.stringify({ scheme: 'neon', mode: 'dark' }));
    class DemoEvents extends EventTarget { close() {} }
    Object.defineProperty(window, 'EventSource', { value: DemoEvents });
  });
  const stamp = '2026-11-08T00:00:00.000Z';
  const unhandled = new Set();
  const files = [
    { name: 'Projects', kind: 'directory' }, { name: 'Design', kind: 'directory' }, { name: 'Documents', kind: 'directory' },
    { name: 'README.md', kind: 'file' }, { name: 'ecosystem.json', kind: 'file' }, { name: 'hello-world.ts', kind: 'file' },
  ].map((entry) => ({ ...entry, path: entry.name, sizeBytes: entry.kind === 'directory' ? 0 : 2048, modifiedAt: stamp, isSafe: true }));
  await page.route('**/health', (route) => route.fulfill({ json: { ok: true } }));
  await page.route('**/api/**', (route) => {
    const pathname = new URL(route.request().url()).pathname;
    let body;
    if (pathname === '/api/system/storage') body = { storage: { pools: [{ id: 'pool-1', mountpoint: '/workspace', filesystem: 'btrfs', status: 'ready', memberDevices: [], totalBytes: 1024 ** 4, usedBytes: 1024 ** 3 * 128, availableBytes: 1024 ** 3 * 896, usedPercent: 12.5, raidLevel: null }], disks: [], arrays: [], mounts: [], issues: [], metrics: {}, capabilities: {} } };
    else if (pathname === '/api/sessions') body = { sessions: [{ id: 'demo-session', currentPath: '.', firstMessage: 'Build something of your own', lastMessage: null, pendingApprovalCount: 0, createdAt: stamp, updatedAt: stamp }] };
    else if (pathname.endsWith('/transcript')) body = { transcript: [], liveEvents: [], activeJob: null, lastEventId: 0 };
    else if (pathname.endsWith('/approvals')) body = { capabilityApprovals: [] };
    else if (pathname === '/api/files') body = { git: null, entries: files };
    else if (pathname === '/api/notifications/summary') body = { operations: 0, bluetoothTransfers: 0, alerts: 0 };
    else if (pathname === '/api/notifications') body = { notifications: [], bluetoothTransfers: [], unreadCount: 0, bluetoothUnreadCount: 0 };
    else if (pathname === '/api/monitoring/alerts/incidents') body = { incidents: [] };
    else if (pathname.includes('operations')) body = { operations: [] };
    else if (pathname === '/api/files/batches') body = { batches: [] };
    else if (pathname === '/api/settings/model-provider') body = { settings: { generation: 0, providerName: 'openai', baseUrl: null, model: '', apiKeyConfigured: false, updatedAt: stamp } };
    else if (pathname === '/api/system/bluetooth/settings') body = { settings: { defaultAdapterId: null, defaultAudioDeviceId: null, receiveEnabled: false, inboxStoragePoolId: null, inboxPath: null, updatedAt: stamp }, audioDevices: [], inboxStatus: { status: 'disabled', reason: null } };
    else if (pathname === '/api/audio/history') body = { items: [], nextCursor: null, sessionId: null, enabled: false, configured: false, speechEnabled: false, maxRecordingSeconds: 60, status: { daemon: { available: false, protocol: 'demo', connected: false, recordingId: null, generation: 0, recordings: [], playing: false, error: null }, sessionId: null, awaitingApproval: false, turns: [], error: null, test: { armed: false, transcript: null, error: null } } };
    else if (pathname === '/api/playback/status') return route.fulfill({ status: 503, json: { error: 'No live playback service in a frontend demonstration' } });
    else {
      unhandled.add(pathname);
      return route.fulfill({ status: 503, json: { error: 'Demonstration fixture: no live service' } });
    }
    return route.fulfill({ json: body });
  });
  await page.goto('http://127.0.0.1:5189/');
  await page.locator('.agent-list .session-item').waitFor();
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  if (await page.getByText('Demonstration fixture: no live service', { exact: false }).count()) throw new Error('A fixture contract is missing; refusing to publish an error banner as product artwork.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir('public/images', { recursive: true });
  const screenshot = await page.screenshot({ animations: 'disabled' });
  await sharp(screenshot).webp({ quality: 88 }).toFile('public/images/cyberos.webp');
  console.log('Captured the actual CyberOS frontend with intercepted, curated demonstration data.');
  console.log('Unhandled demonstration endpoints:', [...unhandled]);
} finally {
  await browser.close();
  await server.close();
}
