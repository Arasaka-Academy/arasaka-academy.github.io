import { Homepage } from '@/components/homepage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('zh-CN');

export default function ChineseHomepage() {
  return <Homepage locale="zh-CN" />;
}
