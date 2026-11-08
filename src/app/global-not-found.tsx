import { BrandMark, Arrow } from '@/components/brand';
import Link from 'next/link';
import './globals.css';

export const metadata = { title: '404 — Arasaka Academy' };

export default function NotFound() {
  return <html lang="en"><body><main className="not-found"><BrandMark /><span className="micro-label">ARASAKA ACADEMY / 404</span><h1>OFF THE GRID.</h1><p>这里还没有被构建。<br />This part of the world has not been built yet.</p><Link className="command-link primary-command" href="/">返回首页 / BACK HOME<Arrow /></Link></main></body></html>;
}
