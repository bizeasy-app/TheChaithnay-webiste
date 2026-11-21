import type { Metadata } from 'next';
import { BinduMark } from '@/components/brand/BinduMark';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'This page is still in the lab. | The Chaithanya',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-page flex-col justify-center gap-8 px-5 py-24 max-[480px]:px-4">
      <BinduMark size={72} blink />
      <h1 className="m-0 max-w-[900px] text-[clamp(44px,6.4vw,88px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
        This page is still in the lab.
      </h1>
      <div className="flex flex-wrap gap-3">
        <Button href="/" variant="ink">
          Go home
        </Button>
        <Button href="/insights" variant="outline">
          Read insights
        </Button>
      </div>
    </section>
  );
}
