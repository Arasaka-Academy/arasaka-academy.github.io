import Image from 'next/image';
import { CyberUIProvider } from '@/components/cyberui/provider';
import { copy, type Locale } from '@/content/copy';
import { projects, getProject } from '@/content/projects';
import { Arrow, BrandMark } from './brand';
import { Navigation } from './navigation';
import { HeroScene } from './hero-scene';

function SectionEyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-eyebrow"><span className="section-index">{index}</span><span>{children}</span><span className="eyebrow-rule" /></div>;
}

export function Homepage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const system = getProject('cyberos');
  const machine = getProject('cybermachine');

  return (
    <CyberUIProvider scheme="neon" mode="dark" locale={locale} className={`site locale-${locale}`}>
      <a className="skip-link" href="#main">{text.skip}</a>
      <Navigation locale={locale} />
      <main id="main" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-inner shell">
            <div className="hero-copy">
              <div className="hero-eyebrow"><span className="signal-square" />{text.heroEyebrow}</div>
              <div className="hero-wordmark" aria-hidden="true"><span>ARASAKA</span><span className="outline-type">ACADEMY<span className="wordmark-period">.</span></span></div>
              <h1 id="hero-title"><span>{text.heroLine1}</span><span>{text.heroLine2}</span></h1>
              <p className="hero-description">{text.heroDescription}</p>
              <a className="command-link primary-command" href="#projects"><span>{text.explore}</span><Arrow /></a>
              <span className="hero-coordinate" aria-hidden="true">HUMAN-DRIVEN. MACHINE-ENABLED.</span>
            </div>
            <div className="hero-object">
              <div className="object-heading"><span className="crosshair" /><span>{text.sceneLabel}</span><span>AA—001</span></div>
              <HeroScene />
              <div className="object-caption"><span className="small-diamond" />{text.sceneCaption}</div>
            </div>
          </div>
          <div className="hero-footer shell"><span><span className="red-text">01 — {String(projects.length).padStart(2, '0')}</span> / A CONNECTED ECOSYSTEM</span><a href="#projects"><span className="scroll-line" />{text.scroll}<span aria-hidden="true">↓</span></a></div>
          <div className="hero-side-label" aria-hidden="true">ARASAKA ACADEMY / OPEN EXPLORATION</div>
        </section>

        <section id="projects" className="projects-section section-space shell" aria-labelledby="projects-title">
          <SectionEyebrow index="01">{text.ecosystemEyebrow}</SectionEyebrow>
          <div className="section-heading"><h2 id="projects-title">{text.ecosystemTitle}</h2><p>{text.ecosystemDescription}</p></div>
          <div className="project-grid">
            {projects.map((project) => {
              const content = project.content[locale];
              return (
                <article key={project.id} id={`project-${project.id}`} data-project={project.id} className={`project-card ${project.featured ? 'project-featured' : 'project-compact'} project-${project.id}`}>
                  <div className="project-card-top"><span>{project.number} / {content.category}</span><span className="project-target" aria-hidden="true">⌖</span></div>
                  <div className="project-art"><Image src={project.image} alt={content.imageAlt} width={1000} height={680} loading="lazy" sizes={project.featured ? '(max-width: 760px) 100vw, 55vw' : '(max-width: 760px) 100vw, 25vw'} /><span className="project-scan" aria-hidden="true" /></div>
                  <div className="project-copy"><div className="project-name-row"><h3>{project.name}</h3><Arrow diagonal /></div><p className="project-tagline">{content.title}</p><p className="project-description">{content.description}</p><ul className="capabilities">{content.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul><div className="project-links"><a href={project.repository}>{text.repository}<Arrow diagonal /></a>{project.website && <a className="project-doc-link" href={project.website}>{text.documentation}<Arrow diagonal /></a>}</div></div>
                </article>
              );
            })}
          </div>
          <div className="ecosystem-footnote"><span>SOFTWARE / HARDWARE / INTELLIGENCE / DESIGN</span><span aria-hidden="true">[ CONTINUED EXPLORATION → ]</span></div>
        </section>

        <section id="inside" className="inside-section section-space" aria-labelledby="inside-title">
          <div className="shell"><SectionEyebrow index="02">{text.insideEyebrow}</SectionEyebrow><div className="section-heading"><h2 id="inside-title">{text.insideTitle}</h2><p>{text.insideDescription}</p></div>
            <div className="spotlight spotlight-software"><div className="spotlight-copy"><span className="micro-label">{text.softwareLabel}</span><h3>{text.softwareTitle}</h3><p>{text.softwareDescription}</p><a className="text-link" href={system.repository}>CyberOS <Arrow diagonal /></a><div className="spotlight-bracket" aria-hidden="true">[ HUMAN AT THE CENTER ]</div></div><figure className="software-figure"><div className="window-top"><span /><span /><span /><span>CYBEROS / PERSONAL WORKSPACE</span></div><Image src="/images/cyberos.webp" alt={system.content[locale].imageAlt} width={1440} height={920} loading="lazy" sizes="(max-width: 760px) 100vw, 65vw" /><figcaption>{text.softwareCaption}</figcaption></figure></div>
            <div className="spotlight spotlight-hardware"><figure className="hardware-figure"><Image src="/images/cybermachine.webp" alt={machine.content[locale].imageAlt} width={1200} height={850} loading="lazy" sizes="(max-width: 760px) 100vw, 55vw" /><figcaption>{text.hardwareCaption}</figcaption></figure><div className="spotlight-copy"><span className="micro-label">{text.hardwareLabel}</span><h3>{text.hardwareTitle}</h3><p>{text.hardwareDescription}</p><a className="text-link" href={machine.website}>CyberMachine <Arrow diagonal /></a><div className="spotlight-bracket" aria-hidden="true">[ DESIGNED TO BE EXPLORED ]</div></div></div>
          </div>
        </section>

        <section id="about" className="about-section section-space shell" aria-labelledby="about-title"><SectionEyebrow index="03">{text.aboutEyebrow}</SectionEyebrow><div className="about-heading"><BrandMark /><h2 id="about-title">{text.aboutTitle}</h2></div><div className="principles">{text.principles.map((principle) => <article key={principle.number}><span className="principle-number">/ {principle.number}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></section>

        <section id="join" className="join-section" aria-labelledby="join-title"><div className="join-grid" aria-hidden="true" /><div className="shell join-inner"><div><span className="micro-label">{text.joinEyebrow}</span><h2 id="join-title">{text.joinTitle}</h2><p>{text.joinDescription}</p><a className="command-link primary-command" href="https://github.com/Arasaka-Academy"><span>{text.joinAction}</span><Arrow diagonal /></a></div><div className="join-symbol" aria-hidden="true"><BrandMark /><span>THE FUTURE IS NOT GIVEN.<br />IT IS BUILT.</span></div></div></section>
      </main>
      <footer className="site-footer shell"><div><a className="footer-brand" href="#top">ARASAKA ACADEMY<BrandMark /></a><p>{text.footer}</p></div><div className="footer-meta"><span>SOFTWARE. HARDWARE. POSSIBILITY.</span><a href="#top">{text.top}<span aria-hidden="true">↑</span></a></div></footer>
    </CyberUIProvider>
  );
}
