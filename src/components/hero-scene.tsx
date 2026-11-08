'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { canRenderScene } from '@/lib/scene-policy';
import type { DeviceScene } from './device-scene';

export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const scene = useRef<DeviceScene | null>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => scene.current?.setProgress(progress));

  useEffect(() => {
    const element = root.current;
    const target = mount.current;
    if (!element || !target) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let disposed = false;
    let loading = false;
    let failed = false;
    let intersecting = false;
    let webgl: boolean | undefined;
    let generation = 0;

    const supported = () => {
      if (!desktop.matches || !finePointer.matches || reducedMotion.matches || connection?.saveData || failed) return false;
      if (webgl === undefined) {
        try {
          const probe = document.createElement('canvas');
          const context = probe.getContext('webgl2');
          webgl = !!context;
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch { webgl = false; }
      }
      return canRenderScene({ width: window.innerWidth, finePointer: finePointer.matches, reducedMotion: reducedMotion.matches, saveData: !!connection?.saveData, webgl });
    };

    const updateVisibility = () => {
      const active = intersecting && !document.hidden && !!scene.current;
      scene.current?.setActive(active);
      element.dataset.running = String(active);
    };

    const fallback = () => {
      generation += 1;
      scene.current?.dispose();
      scene.current = null;
      loading = false;
      element.dataset.scene = 'poster';
      element.dataset.running = 'false';
    };

    const reconcile = async () => {
      if (!supported()) { fallback(); return; }
      if (scene.current || loading) return;
      loading = true;
      const requestedGeneration = ++generation;
      try {
        const { mountDeviceScene } = await import('./device-scene');
        if (disposed || requestedGeneration !== generation || !supported()) return;
        scene.current = mountDeviceScene(target, () => {
          failed = true;
          fallback();
        });
        loading = false;
        element.dataset.scene = 'ready';
        updateVisibility();
      } catch {
        if (disposed || requestedGeneration !== generation) return;
        failed = true;
        fallback();
      }
    };

    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; updateVisibility(); }, { threshold: 0.05 });
    observer.observe(element);
    const onChange = () => { void reconcile(); };
    desktop.addEventListener('change', onChange);
    finePointer.addEventListener('change', onChange);
    reducedMotion.addEventListener('change', onChange);
    connection?.addEventListener('change', onChange);
    document.addEventListener('visibilitychange', updateVisibility);
    void reconcile();

    return () => {
      disposed = true;
      observer.disconnect();
      desktop.removeEventListener('change', onChange);
      finePointer.removeEventListener('change', onChange);
      reducedMotion.removeEventListener('change', onChange);
      connection?.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', updateVisibility);
      fallback();
    };
  }, []);

  return (
    <div className="scene-frame" data-scene="poster" data-running="false" ref={root} aria-hidden="true">
      <Image className="hero-poster" src="/images/ecosystem-poster.webp" alt="" width={900} height={820} priority sizes="(max-width: 1023px) 100vw, 60vw" />
      <div className="scene-canvas" ref={mount} />
      <span className="scene-node node-system"><i />CYBEROS<span>PERSONAL SYSTEM</span></span>
      <span className="scene-node node-vision"><i />CYBERVISUAL<span>PERCEPTION</span></span>
      <span className="scene-node node-audio"><i />CYBERAUDIO<span>VOICE</span></span>
      <span className="scene-node node-control"><i />CYBERCONTROLLER<span>INTERACTION</span></span>
      <div className="scene-device-label"><span>CYBERMACHINE</span><span>THE PHYSICAL CORE</span></div>
    </div>
  );
}
