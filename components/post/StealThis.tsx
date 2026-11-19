import { CopyButton } from '@/components/post/CopyButton';
import type { PostBlock } from '@/lib/posts';
import { RichTextView } from '@/components/post/RichText';

function copyText(block: PostBlock) {
  const code = (block.children ?? []).filter((child) => child.type === 'code');
  if (code.length > 0) return code.map((child) => child.plainText ?? '').join('\n\n');
  const inline = (block.richText ?? []).filter((part) => part.code).map((part) => part.text).join('');
  if (inline.trim()) return inline;
  return (block.plainText ?? '').trim();
}

export function StealThis({ block, id }: { block: PostBlock; id: string }) {
  const intro = (block.plainText ?? '').replace(/^steal(?:\s+this)?[.:\s-]*/i, '').trim();
  const payload = copyText(block);
  const showIntro = Boolean(intro) && intro !== payload;

  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-6 flex scroll-mt-32 flex-col gap-4 rounded-3xl bg-ink p-9 text-cloud">
      <h2 id={`${id}-h`} className="m-0 text-[36px] font-extrabold leading-[1.1] tracking-[-0.035em]">
        Steal this<span className="text-saffron">.</span>
      </h2>
      {showIntro ? <p className="m-0 text-[18px] leading-[1.6] text-[#D9D2C9]">{intro}</p> : null}
      <div className="whitespace-pre-wrap rounded-2xl border border-body bg-ink-input p-[22px] font-mono text-[15px] leading-[1.7] text-cloud">
        {payload}
      </div>
      <CopyButton
        text={payload}
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-saffron px-5 text-[15px] font-extrabold text-ink"
      />
    </section>
  );
}
