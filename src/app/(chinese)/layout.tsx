import '../globals.css';
import '../cyberui.css';

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><head><link rel="preload" href="/fonts/oxanium-semibold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><link rel="preload" href="/fonts/noto-sans-sc.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
