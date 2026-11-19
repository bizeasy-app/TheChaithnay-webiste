import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { FALLBACK, matchQuestion, type FaqEntry, type FaqIndex } from './matcher';

const faqs = JSON.parse(readFileSync(new URL('../../content/faq.json', import.meta.url), 'utf8')) as FaqEntry[];

const index: FaqIndex = { faqs, posts: [] };

describe('matchQuestion', () => {
  for (const faq of faqs) {
    it(`answers “${faq.q}”`, () => {
      const answer = matchQuestion(faq.q, index);
      assert.equal(answer.text, faq.a);
    });
  }

  it('uses a synonym for begin', () => {
    const answer = matchQuestion('Where do I begin on the blog?', index);
    assert.equal(answer.text, faqs.find((faq) => faq.id === 'start')?.a);
  });

  it('returns the fallback for nonsense', () => {
    const answer = matchQuestion('purple elephant orchestra', index);
    assert.equal(answer.text, FALLBACK);
    assert.deepEqual(answer.links, [{ href: '/newsletter#contact', title: 'Contact', topic: 'Send a message' }]);
  });

  it('suggests a post when no answer fits', () => {
    const withPost: FaqIndex = {
      faqs,
      posts: [
        {
          type: 'post',
          title: 'Ledger margins',
          summary: 'A note on ledger margins from one Saturday.',
          topic: 'Startup lessons',
          slug: 'ledger-margins',
          keywords: ['ledger', 'margins'],
        },
      ],
    };
    const answer = matchQuestion('ledger margins', withPost);
    assert.equal(answer.text, 'These posts should help:');
    assert.equal(answer.links[0]?.href, '/blog/ledger-margins');
  });

  it('puts the open post first', () => {
    const withPosts: FaqIndex = {
      faqs,
      posts: [
        {
          type: 'post',
          title: 'Ledger margins',
          summary: 'A note on ledger margins.',
          topic: 'Startup lessons',
          slug: 'ledger-margins',
          keywords: ['ledger'],
        },
        {
          type: 'post',
          title: 'More ledger margins',
          summary: 'Another note on ledger margins.',
          topic: 'Money & investing',
          slug: 'more-ledger',
          keywords: ['ledger'],
        },
      ],
    };
    const answer = matchQuestion('ledger margins', withPosts, 'more-ledger');
    assert.equal(answer.links[0]?.href, '/blog/more-ledger');
  });
});
