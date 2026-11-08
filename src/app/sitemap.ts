import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/en/'].map((route) => ({ url: `https://arasaka-academy.github.io${route}`, alternates: { languages: { 'zh-CN': 'https://arasaka-academy.github.io/', en: 'https://arasaka-academy.github.io/en/' } } }));
}
