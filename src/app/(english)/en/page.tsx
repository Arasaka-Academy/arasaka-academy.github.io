import { Homepage } from '@/components/homepage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('en');

export default function EnglishHomepage() {
  return <Homepage locale="en" />;
}
