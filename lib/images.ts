import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export function webpSources(url?: string) {
  if (!url?.endsWith('-1200.webp')) return undefined;
  const small = url.replace(/-1200\.webp$/, '-600.webp');
  return `${small} 600w, ${url} 1200w`;
}

export async function writeWebpPair(input: Buffer, directory: string, name: string) {
  const rotated = sharp(input, { animated: false }).rotate();
  const meta = await rotated.metadata();
  if (!meta.width || meta.format === 'gif' || meta.format === 'svg') return null;

  const large = await sharp(input)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const largeName = `${name}-1200.webp`;
  await fs.promises.writeFile(path.join(directory, largeName), large.data);

  const small = large.info.width > 600;
  if (small) {
    const file = await sharp(large.data).resize({ width: 600 }).webp({ quality: 78 }).toBuffer();
    await fs.promises.writeFile(path.join(directory, `${name}-600.webp`), file);
  }

  return {
    filename: largeName,
    width: large.info.width,
    height: large.info.height,
    small,
  };
}
