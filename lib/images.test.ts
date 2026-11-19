import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it } from 'node:test';
import sharp from 'sharp';
import { webpSources, writeWebpPair } from './images';

describe('webpSources', () => {
  it('points a large image at the 600 and 1200 files', () => {
    assert.equal(webpSources('/blog-images/demo/cover-1200.webp'), '/blog-images/demo/cover-600.webp 600w, /blog-images/demo/cover-1200.webp 1200w');
    assert.equal(webpSources('/blog-images/demo/cover.jpg'), undefined);
  });
});

describe('writeWebpPair', () => {
  it('writes a webp no wider than 1200', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'chaithanya-img-'));
    const png = await sharp({
      create: { width: 1600, height: 800, channels: 3, background: '#e8792b' },
    })
      .png()
      .toBuffer();

    const saved = await writeWebpPair(png, directory, 'cover');
    assert.ok(saved);
    assert.equal(saved.filename, 'cover-1200.webp');
    assert.equal(saved.width, 1200);
    assert.ok(fs.existsSync(path.join(directory, 'cover-600.webp')));
    fs.rmSync(directory, { recursive: true, force: true });
  });
});
