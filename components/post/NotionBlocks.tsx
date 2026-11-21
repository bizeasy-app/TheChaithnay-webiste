import { CopyButton } from '@/components/post/CopyButton';
import { LiteYouTube } from '@/components/post/LiteYouTube';
import { RichTextView } from '@/components/post/RichText';
import { StealThis } from '@/components/post/StealThis';
import type { PostBlock } from '@/lib/posts';
import { youtubeId } from '@/lib/youtube';

const headingClass = 'm-0 scroll-mt-32 font-extrabold leading-[1.1] tracking-[-0.035em] text-ink';

function captionText(block: PostBlock) {
  return (block.caption ?? []).map((part) => part.text).join('').trim();
}

function MediaLink({ block }: { block: PostBlock }) {
  const id = block.url ? youtubeId(block.url) : '';
  if (id) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-[18px] bg-indigo [background-image:radial-gradient(rgba(240,238,233,0.12)_1.5px,transparent_1.5px)] [background-size:22px_22px]">
        <LiteYouTube videoId={id} label="Play video" />
      </div>
    );
  }
  if (!block.url) return null;
  const label = captionText(block) || block.url;
  return (
    <a href={block.url} className="font-bold text-ink underline" rel="noopener noreferrer" target="_blank">
      {label}
    </a>
  );
}

function BlockView({
  block,
  stealIds,
  lead,
  imageAlt = '',
}: {
  block: PostBlock;
  stealIds: Map<string, string>;
  lead?: boolean;
  imageAlt?: string;
}) {
  const children = block.children ?? [];
  const stealId = stealIds.get(block.id);

  if (block.type === 'callout' && stealId) {
    const rest = children.filter((child) => child.type !== 'code');
    return (
      <>
        <StealThis block={block} id={stealId} />
        {rest.length > 0 ? renderBlocks(rest, stealIds, false, imageAlt) : null}
      </>
    );
  }

  switch (block.type) {
    case 'paragraph':
      return (
        <>
          <p className={lead ? 'm-0 text-[24px] font-semibold leading-[1.55] text-ink' : 'm-0'}>
            <RichTextView parts={block.richText} />
          </p>
          {children.length > 0 ? renderBlocks(children, stealIds, false, imageAlt) : null}
        </>
      );
    case 'heading_1':
      return (
        <>
          <h2 id={block.id} className={`${headingClass} mt-6 text-[40px]`}>
            <RichTextView parts={block.richText} />
          </h2>
          {children.length > 0 ? renderBlocks(children, stealIds, false, imageAlt) : null}
        </>
      );
    case 'heading_2':
      return (
        <>
          <h3 id={block.id} className={`${headingClass} mt-6 text-[28px]`}>
            <RichTextView parts={block.richText} />
          </h3>
          {children.length > 0 ? renderBlocks(children, stealIds, false, imageAlt) : null}
        </>
      );
    case 'heading_3':
      return (
        <>
          <h4 id={block.id} className={`${headingClass} mt-4 text-[22px]`}>
            <RichTextView parts={block.richText} />
          </h4>
          {children.length > 0 ? renderBlocks(children, stealIds, false, imageAlt) : null}
        </>
      );
    case 'quote':
      return (
        <blockquote className="my-3 border-l-4 border-saffron py-1 pl-7 text-[30px] font-extrabold leading-[1.3] tracking-[-0.025em] text-ink">
          <RichTextView parts={block.richText} />
        </blockquote>
      );
    case 'callout':
      return (
        <aside className="flex flex-col gap-3 rounded-[22px] border border-line bg-white p-7 text-[18px] leading-relaxed text-ink">
          <p className="m-0">
            <RichTextView parts={block.richText} />
          </p>
          {children.length > 0 ? renderBlocks(children, stealIds, false, imageAlt) : null}
        </aside>
      );
    case 'code':
      return (
        <div className="flex flex-col items-start gap-3">
          <pre className="w-full overflow-x-auto whitespace-pre-wrap rounded-2xl border border-body bg-ink-input p-[22px] font-mono text-[15px] leading-[1.7] text-cloud">
            <code>{block.plainText}</code>
          </pre>
          <CopyButton
            text={block.plainText ?? ''}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron px-5 text-[15px] font-extrabold text-coal"
          />
        </div>
      );
    case 'image':
      return (
        <figure className="m-0 flex flex-col gap-2.5">
          {block.url ? (
            <img
              src={block.url}
              srcSet={block.srcSet}
              sizes={block.srcSet ? '(max-width: 860px) 100vw, 760px' : undefined}
              alt={captionText(block) || imageAlt}
              width={block.width}
              height={block.height}
              loading="lazy"
              className="h-auto w-full rounded-[18px]"
            />
          ) : null}
          {block.caption && block.caption.length > 0 ? (
            <figcaption className="text-[15px] leading-normal text-muted">
              <RichTextView parts={block.caption} />
            </figcaption>
          ) : null}
        </figure>
      );
    case 'divider':
      return <hr className="my-2 border-0 border-t-[1.5px] border-ink" />;
    case 'toggle':
      return (
        <details className="rounded-[18px] border border-line bg-white px-5 py-3">
          <summary className="cursor-pointer text-[18px] font-extrabold">
            <RichTextView parts={block.richText} />
          </summary>
          {children.length > 0 ? <div className="pt-3">{renderBlocks(children, stealIds, false, imageAlt)}</div> : null}
        </details>
      );
    case 'to_do':
      return (
        <div className="flex items-start gap-3">
          <span
            role="checkbox"
            aria-checked={Boolean(block.checked)}
            aria-readonly="true"
            aria-label={block.plainText || 'To do'}
            className={`mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-[1.5px] border-ink ${
              block.checked ? 'bg-ink text-cloud' : 'bg-transparent'
            }`}
          >
            {block.checked ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path d="M5 12l5 5L20 7" />
              </svg>
            ) : null}
          </span>
          <span className={block.checked ? 'text-muted line-through' : undefined}>
            <RichTextView parts={block.richText} />
          </span>
        </div>
      );
    case 'bookmark':
    case 'embed':
    case 'video':
      return <MediaLink block={block} />;
    case 'table':
      return (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-[16px] leading-snug">
            <tbody>
              {(block.rows ?? []).map((row, rowIndex) => (
                <tr key={`${block.id}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => {
                    const Cell = block.headerRow && rowIndex === 0 ? 'th' : 'td';
                    return (
                      <Cell
                        key={`${block.id}-${rowIndex}-${cellIndex}`}
                        className="border border-line px-3 py-2 align-top font-medium"
                      >
                        <RichTextView parts={cell} />
                      </Cell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return children.length > 0 ? renderBlocks(children, stealIds, false, imageAlt) : null;
  }
}

function renderBlocks(blocks: PostBlock[], stealIds: Map<string, string>, lead = false, imageAlt = '') {
  const nodes: React.ReactNode[] = [];
  let index = 0;
  let leadUsed = false;

  while (index < blocks.length) {
    const block = blocks[index];
    if (
      block.type === 'bulleted_list_item' ||
      block.type === 'numbered_list_item' ||
      block.type === 'to_do'
    ) {
      const type = block.type;
      const group: PostBlock[] = [];
      while (index < blocks.length && blocks[index].type === type) {
        group.push(blocks[index]);
        index += 1;
      }
      const ListTag = type === 'numbered_list_item' ? 'ol' : 'ul';
      const listClass =
        type === 'to_do'
          ? 'm-0 flex list-none flex-col gap-2 p-0'
          : type === 'numbered_list_item'
            ? 'm-0 flex list-decimal flex-col gap-2 pl-6'
            : 'm-0 flex list-disc flex-col gap-2 pl-6';
      nodes.push(
        <ListTag key={group[0].id} className={listClass}>
          {group.map((item) => (
            <li key={item.id}>
              {item.type === 'to_do' ? (
                <BlockView block={item} stealIds={stealIds} imageAlt={imageAlt} />
              ) : (
                <>
                  <RichTextView parts={item.richText} />
                  {item.children && item.children.length > 0 ? (
                    <div className="mt-2">{renderBlocks(item.children, stealIds, false, imageAlt)}</div>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const isLead = lead && !leadUsed && block.type === 'paragraph';
    if (isLead) leadUsed = true;
    nodes.push(<BlockView key={block.id} block={block} stealIds={stealIds} lead={isLead} imageAlt={imageAlt} />);
    index += 1;
  }

  return nodes;
}

export function NotionBlocks({
  blocks,
  stealIds,
  imageAlt = '',
}: {
  blocks: PostBlock[];
  stealIds: Map<string, string>;
  imageAlt?: string;
}) {
  const last = blocks[blocks.length - 1];
  const closing = last?.type === 'paragraph' && (last.plainText ?? '').trim().endsWith('?') ? last : null;
  const body = closing ? blocks.slice(0, -1) : blocks;

  return (
    <div className="flex flex-col gap-7 text-[20px] font-medium leading-[1.75] text-body">
      {renderBlocks(body, stealIds, true, imageAlt)}
    </div>
  );
}

export function closingQuestion(blocks: PostBlock[]) {
  const last = blocks[blocks.length - 1];
  if (last?.type === 'paragraph' && (last.plainText ?? '').trim().endsWith('?')) return last;
  return null;
}
