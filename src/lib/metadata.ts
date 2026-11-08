import type { Metadata } from 'next';
import { copy, type Locale } from '@/content/copy';

export function pageMetadata(locale: Locale): Metadata {
  const text = copy[locale];
  const route = locale === 'en' ? '/en/' : '/';
  return {
    metadataBase: new URL('https://arasaka-academy.github.io'),
    applicationName: 'Arasaka Academy',
    icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
    twitter: { card: 'summary_large_image', title: text.title, description: text.description, images: ['/og-image.png'] },
    title: text.title,
    description: text.description,
    alternates: { canonical: route, languages: { 'zh-CN': '/', en: '/en/', 'x-default': '/' } },
    openGraph: { type: 'website', title: text.title, description: text.description, url: route, siteName: 'Arasaka Academy', locale: locale === 'en' ? 'en_US' : 'zh_CN', alternateLocale: [locale === 'en' ? 'zh_CN' : 'en_US'], images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Arasaka Academy — Build Your Own Cyber World' }] },
  };
}
