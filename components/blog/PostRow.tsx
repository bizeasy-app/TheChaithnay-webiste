import Link from 'next/link';
import { ArrowIcon } from '@/components/home/icons';

export function PostRow({
  number,
  topic,
  title,
  href,
}: {
  number: string;
  topic: string;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="row flex flex-wrap items-center gap-x-8 gap-y-4 border-t-[1.5px] border-ink py-[30px] text-ink no-underline"
    >
      <span className="w-14 text-[18px] font-extrabold text-muted">{number}</span>
      <span className="w-[210px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted">{topic}</span>
      <span className="shift min-w-0 flex-[1_1_360px] text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">{title}</span>
      <ArrowIcon size={32} />
    </Link>
  );
}
