import Link from 'next/link';
import { AskMeTextButton } from '@/components/askme/AskMeTextButton';
import { BigWordmark } from '@/components/layout/BigWordmark';
import { mailAddress } from '@/lib/links';
import { sections } from '@/lib/brand';
import { site } from '@/lib/site';

const links = [...sections, { href: '/privacy', label: 'Privacy' }];

export function Footer() {
  const email = mailAddress(site.contactEmail);

  return (
    <footer data-progress="end" data-fx-all className="site-footer mx-auto flex w-full max-w-page flex-col gap-10 overflow-x-hidden px-5 pb-28 pt-16 max-[480px]:px-4">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div className="flex min-w-0 flex-col gap-5">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-bold">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="draw inline-flex min-h-11 items-center text-ink hover:text-muted"
              >
                {link.label}
              </Link>
            ))}
            <AskMeTextButton className="draw inline-flex min-h-11 items-center text-ink hover:text-muted">
              Ask me
            </AskMeTextButton>
          </nav>
          <div className="flex flex-col gap-3">
            <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">Write to me</p>
            {email ? (
              <a href={`mailto:${email}`} className="draw inline-flex min-h-11 w-fit items-center text-[14px] font-bold text-body hover:text-ink">
                {email}
              </a>
            ) : null}
          </div>
        </div>
        <p className="m-0 text-sm text-muted">© 2026 The Chaithanya · Try new. Learn fast. Build big.</p>
      </div>
      <BigWordmark />
    </footer>
  );
}
