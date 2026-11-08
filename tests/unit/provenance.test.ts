import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

describe('self-contained upstream assets', () => {
  it('retains every pinned CyberUI source byte', () => {
    const root = 'src/components/cyberui';
    const provenance = JSON.parse(readFileSync(`${root}/PROVENANCE.json`, 'utf8')) as { commit: string; checksums: Record<string, string> };
    expect(provenance.commit).toBe('e31c0355b2b5189c9af1e6e26150f28a44287659');
    for (const [file, checksum] of Object.entries(provenance.checksums)) {
      expect(createHash('sha256').update(readFileSync(`${root}/${file}`)).digest('hex')).toBe(checksum);
    }
  });

  it('ships font licenses without depending on neighboring checkouts', () => {
    for (const family of ['Oxanium', 'ShareTechMono', 'NotoSansSC']) {
      expect(existsSync(`public/fonts/licenses/OFL-${family}.txt`)).toBe(true);
    }
    for (const font of ['oxanium-regular', 'oxanium-semibold', 'share-tech-mono', 'noto-sans-sc']) {
      expect(existsSync(`public/fonts/${font}.woff2`)).toBe(true);
    }
  });
});
