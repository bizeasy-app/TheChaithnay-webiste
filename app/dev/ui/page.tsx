import type { Metadata } from 'next';
import { UiGallery } from '@/app/dev/ui/gallery';

export const metadata: Metadata = {
  title: 'UI kit',
  robots: { index: false, follow: false },
};

export default function UiKitPage() {
  return (
    <main>
      <UiGallery />
    </main>
  );
}
