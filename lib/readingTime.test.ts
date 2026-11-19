import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countWords, readingMinutes } from './readingTime';

describe('readingMinutes', () => {
  it('counts words and rounds up to the next minute', () => {
    assert.equal(countWords('  one   two three '), 3);
    assert.equal(countWords(''), 0);
    assert.equal(readingMinutes('word '.repeat(201)), 2);
    assert.equal(readingMinutes(''), 0);
  });
});
