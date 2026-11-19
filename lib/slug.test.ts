import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { slugify } from './slug';

describe('slugify', () => {
  it('makes a url slug from a title', () => {
    assert.equal(slugify('Founder log, week 1'), 'founder-log-week-1');
  });

  it('drops accents and extra dashes', () => {
    assert.equal(slugify('  Chaithanya — déjà vu! '), 'chaithanya-deja-vu');
  });
});
