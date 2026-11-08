import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { projects, getProject } from '@/content/projects';
import { copy, getLanguageHref } from '@/content/copy';
import { canRenderScene } from '@/lib/scene-policy';

describe('the project catalogue', () => {
  it('presents all six projects with unique and stable identifiers', () => {
    expect(projects.map((project) => project.id)).toEqual([
      'cyberos', 'cybermachine', 'cybervisual', 'cybercontroller', 'cyberaudio', 'cyberui',
    ]);
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
  });

  it('provides complete localized content and self-hosted media', () => {
    for (const project of projects) {
      expect(project.name).toBeTruthy();
      expect(project.repository).toBe(`https://github.com/Arasaka-Academy/${project.name}`);
      expect(existsSync(`public${project.image}`)).toBe(true);
      for (const locale of ['zh-CN', 'en'] as const) {
        expect(project.content[locale].title.length).toBeGreaterThan(3);
        expect(project.content[locale].description.length).toBeGreaterThan(15);
        expect(project.content[locale].capabilities.length).toBeGreaterThanOrEqual(2);
        expect(project.content[locale].imageAlt.length).toBeGreaterThan(10);
      }
    }
  });

  it('supports looking up a project without relying on its array position', () => {
    expect(getProject('cybermachine').name).toBe('CyberMachine');
    expect(() => getProject('unknown')).toThrow('Unknown project');
  });
});

describe('localization', () => {
  it('keeps both dictionaries structurally complete', () => {
    expect(Object.keys(copy['zh-CN'])).toEqual(Object.keys(copy.en));
    expect(copy['zh-CN'].heroTitle).toContain('赛博世界');
    expect(copy.en.heroTitle).toContain('CYBER WORLD');
  });

  it('preserves a section while switching language', () => {
    expect(getLanguageHref('en', '#projects')).toBe('/en/#projects');
    expect(getLanguageHref('zh-CN', '#inside')).toBe('/#inside');
    expect(getLanguageHref('en', '')).toBe('/en/');
    expect(getLanguageHref('en', '#not-a-section')).toBe('/en/');
  });
});

describe('progressive 3D enhancement', () => {
  const supported = { width: 1440, finePointer: true, reducedMotion: false, saveData: false, webgl: true };

  it('only loads the scene for a capable desktop', () => {
    expect(canRenderScene(supported)).toBe(true);
    expect(canRenderScene({ ...supported, width: 1023 })).toBe(false);
    expect(canRenderScene({ ...supported, finePointer: false })).toBe(false);
    expect(canRenderScene({ ...supported, reducedMotion: true })).toBe(false);
    expect(canRenderScene({ ...supported, saveData: true })).toBe(false);
    expect(canRenderScene({ ...supported, webgl: false })).toBe(false);
  });
});
