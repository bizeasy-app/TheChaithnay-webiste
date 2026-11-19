import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { blocksToMarkdown } from './markdown';
import type { PostBlock } from './posts';

describe('blocksToMarkdown', () => {
  it('converts headings, lists, quotes, code and images', () => {
    const blocks: PostBlock[] = [
      { id: 'h', type: 'heading_1', richText: [{ text: 'The problem' }], plainText: 'The problem' },
      { id: 'p', type: 'paragraph', richText: [{ text: 'A short note.', bold: true }], plainText: 'A short note.' },
      { id: 'b', type: 'bulleted_list_item', richText: [{ text: 'One' }], plainText: 'One' },
      { id: 'q', type: 'quote', richText: [{ text: 'Copy this line.' }], plainText: 'Copy this line.' },
      { id: 'c', type: 'code', language: 'text', plainText: 'Result first.', richText: [{ text: 'Result first.' }] },
      { id: 'i', type: 'image', url: '/blog-images/demo/image-1.jpg', caption: [{ text: 'The step' }] },
    ];

    const markdown = blocksToMarkdown(blocks, 'Post title');
    assert.match(markdown, /^## The problem/);
    assert.match(markdown, /\*\*A short note\.\*\*/);
    assert.match(markdown, /^- One/m);
    assert.match(markdown, /^> Copy this line\./m);
    assert.match(markdown, /```text\nResult first\.\n```/);
    assert.match(markdown, /!\[The step\]\(\/blog-images\/demo\/image-1\.jpg\)/);
  });

  it('uses the post title when an image has no caption', () => {
    const markdown = blocksToMarkdown([{ id: 'i', type: 'image', url: '/cover.jpg' }], 'Ledger margins');
    assert.match(markdown, /!\[Ledger margins\]\(\/cover\.jpg\)/);
  });
});
