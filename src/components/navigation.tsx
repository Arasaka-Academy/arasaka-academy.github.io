'use client';

import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@/components/cyberui/icon-button';
import { copy, getLanguageHref, type Locale } from '@/content/copy';
import { Arrow, BrandMark } from './brand';

export function Navigation({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const otherLocale = locale === 'en' ? 'zh-CN' : 'en';
  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState('');
  const toggle = useRef<HTMLButtonElement>(null);
  const links = [{ href: '#projects', label: text.projects, number: '01' }, { href: '#inside', label: text.inside, number: '02' }, { href: '#about', label: text.about, number: '03' }];

  useEffect(() => {
    let frame = 0;
    const update = () => setHash(window.location.hash);
    const updateFromScroll = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));
      const current = sections.filter((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35).at(-1);
      if (current) setHash(current.id === 'top' ? '' : `#${current.id}`);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateFromScroll); };
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    const onResize = () => { if (window.innerWidth >= 900) setMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <a className="brand" href={locale === 'en' ? '/en/' : '/'} aria-label="Arasaka Academy">
          <BrandMark />
          <span>ARASAKA<span className="brand-subtitle">A C A D E M Y</span></span>
        </a>
        <nav className="desktop-nav" aria-label={text.menu}>
          {links.map((link) => <a href={link.href} key={link.href}><span>{link.number}</span>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="language-switch" href={getLanguageHref(otherLocale, hash)} hrefLang={otherLocale} aria-label={text.language} data-language-switch>{locale === 'en' ? '中' : 'EN'}<span aria-hidden="true">↗</span></a>
          <a className="header-github" href="https://github.com/Arasaka-Academy">GITHUB <Arrow diagonal /></a>
          <IconButton ref={toggle} className="menu-toggle" data-menu-toggle aria-label={text.menu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onPress={() => setMenuOpen(!menuOpen)} icon={menuOpen ? 'close' : 'menu'} />
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-navigation" aria-label={text.menu} hidden={!menuOpen}>
        {links.map((link) => <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}><span>{link.number}</span>{link.label}<Arrow diagonal /></a>)}
        <a href="https://github.com/Arasaka-Academy">GITHUB<Arrow diagonal /></a>
      </nav>
    </header>
  );
}
