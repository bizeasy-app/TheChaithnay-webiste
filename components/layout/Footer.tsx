import Link from 'next/link';
import { AskMeTextButton } from '@/components/askme/AskMeTextButton';
import { BigWordmark } from '@/components/layout/BigWordmark';
import { externalUrl, mailAddress } from '@/lib/links';
import { site } from '@/lib/site';

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/products', label: 'Products' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/newsletter#contact', label: 'Connect' },
  { href: '/privacy', label: 'Privacy' },
];

const socials = [
  { label: 'YouTube', href: externalUrl(site.socials.youtube) },
  { label: 'Instagram', href: externalUrl(site.socials.instagram) },
  { label: 'X', href: externalUrl(site.socials.x) },
  { label: 'LinkedIn', href: externalUrl(site.socials.linkedin) },
].filter((item): item is { label: string; href: string } => Boolean(item.href));

export function Footer() {
  const email = mailAddress(site.contactEmail);

  return (
    <footer className="mx-auto flex w-full max-w-page flex-col gap-10 overflow-x-hidden px-5 pb-28 pt-16 max-[480px]:px-4">
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
          {socials.length || email ? (
            <div className="flex flex-col gap-2">
              <p className="m-0 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">Connect</p>
              <nav aria-label="Connect" className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-bold">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="draw inline-flex min-h-11 items-center text-body hover:text-ink"
                  >
                    {item.label}
                  </a>
                ))}
                {email ? (
                  <a href={`mailto:${email}`} className="draw inline-flex min-h-11 items-center text-body hover:text-ink">
                    {email}
                  </a>
                ) : null}
              </nav>
            </div>
          ) : null}
        </div>
        <p className="m-0 text-sm text-muted">© 2026 The Chaithanya · thechaithanya.com</p>
      </div>
      <BigWordmark />
    </footer>
  );
}
