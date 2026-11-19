import type { RichText } from '@/lib/notion';
import type { PostBlock } from '@/lib/posts';

function inline(parts?: RichText[]) {
  return (parts ?? [])
    .map((part) => {
      let text = part.text.replace(/\|/g, '\\|');
      if (part.code) text = `\`${text}\``;
      if (part.bold) text = `**${text}**`;
      if (part.italic) text = `*${text}*`;
      if (part.strikethrough) text = `~~${text}~~`;
      if (part.href) text = `[${text}](${part.href})`;
      return text;
    })
    .join('');
}

function caption(block: PostBlock) {
  return (block.caption ?? []).map((part) => part.text).join('').trim();
}

export function blocksToMarkdown(blocks: PostBlock[], imageAlt = ''): string {
  const lines: string[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item' || block.type === 'to_do') {
      const type = block.type;
      const group: PostBlock[] = [];
      while (index < blocks.length && blocks[index].type === type) {
        group.push(blocks[index]);
        index += 1;
      }
      group.forEach((item, itemIndex) => {
        const marker = type === 'numbered_list_item' ? `${itemIndex + 1}. ` : type === 'to_do' ? `- [${item.checked ? 'x' : ' '}] ` : '- ';
        lines.push(`${marker}${inline(item.richText)}`);
        if (item.children?.length) lines.push(blocksToMarkdown(item.children, imageAlt));
      });
      lines.push('');
      continue;
    }

    lines.push(blockToMarkdown(block, imageAlt));
    index += 1;
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function blockToMarkdown(block: PostBlock, imageAlt: string): string {
  const text = inline(block.richText);
  const children = block.children?.length ? `\n\n${blocksToMarkdown(block.children, imageAlt)}` : '';

  switch (block.type) {
    case 'heading_1':
      return `## ${text}${children}\n`;
    case 'heading_2':
      return `### ${text}${children}\n`;
    case 'heading_3':
      return `#### ${text}${children}\n`;
    case 'quote':
      return `${text
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')}\n`;
    case 'code':
      return `\`\`\`${block.language && block.language !== 'plain text' ? block.language : ''}\n${block.plainText ?? ''}\n\`\`\`\n`;
    case 'image': {
      const alt = caption(block) || imageAlt;
      const url = block.url?.startsWith('/') ? block.url : (block.url ?? '');
      return `![${alt}](${url})\n`;
    }
    case 'divider':
      return '---\n';
    case 'callout':
      if (/^steal\b/i.test((block.plainText ?? '').trim())) {
        const code = (block.children ?? []).filter((child) => child.type === 'code');
        const intro = (block.plainText ?? '').replace(/^steal(?:\s+this)?[.:\s-]*/i, '').trim();
        const fence = code.map((child) => blockToMarkdown(child, imageAlt)).join('\n');
        return `## Steal this.\n\n${intro}${fence ? `\n\n${fence}` : ''}\n`;
      }
      return `${text}${children}\n`;
    case 'toggle':
      return `**${text}**${children}\n`;
    case 'bookmark':
    case 'embed':
    case 'video':
      return block.url ? `[${caption(block) || block.url}](${block.url})\n` : '';
    case 'table': {
      const rows = (block.rows ?? []).map((row) => row.map((cell) => inline(cell).replace(/\n/g, ' ')));
      if (rows.length === 0) return '';
      const width = Math.max(...rows.map((row) => row.length));
      const padded = rows.map((row) => [...row, ...Array(width - row.length).fill('')]);
      const header = padded[0];
      const body = block.headerRow ? padded.slice(1) : padded;
      const rule = header.map(() => '---');
      const render = (row: string[]) => `| ${row.join(' | ')} |`;
      return [render(header), render(rule), ...body.map(render)].join('\n') + '\n';
    }
    default:
      return text ? `${text}${children}\n` : children;
  }
}
