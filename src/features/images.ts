import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Claude AI suggested a different format than what I had (ImageStore class).

export const IMAGES_DIR = path.resolve('./images');
export const THUMBS_DIR = path.resolve('./images/thumbs');

export async function resizeImage(
  inputPath: string,
  width: number,
  height: number
): Promise<Buffer> {
  const buffer = await fs.readFile(inputPath);
  const processed = await sharp(buffer)
    .resize(width, height)
    .jpeg({ quality: 80 })
    .toBuffer();
  return processed;
}

export async function getAvailableImages(): Promise<string[]> {
  const files = await fs.readdir(IMAGES_DIR);
  return files.filter(
    (file) =>
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  );
}

export async function imageExists(filename: string): Promise<boolean> {
  const filePath = path.join(IMAGES_DIR, filename);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getCachedImage(
  filename: string,
  width: number,
  height: number
): Promise<Buffer | null> {
  const cachedPath = path.join(
    THUMBS_DIR,
    `${filename}_${width}x${height}.jpg`
  );
  try {
    const buffer = await fs.readFile(cachedPath);
    return buffer;
  } catch {
    return null;
  }
}

export async function processAndCacheImage(
  filename: string,
  width: number,
  height: number
): Promise<Buffer> {
  await fs.mkdir(THUMBS_DIR, { recursive: true });

  const inputPath = path.join(IMAGES_DIR, filename);
  const cachedPath = path.join(
    THUMBS_DIR,
    `${filename}_${width}x${height}.jpg`
  );

  const processed = await resizeImage(inputPath, width, height);
  await fs.writeFile(cachedPath, processed);

  return processed;
}

export async function getImage(
  filename: string,
  width: number,
  height: number
): Promise<Buffer> {
  const cached = await getCachedImage(filename, width, height);
  if (cached) {
    return cached;
  }

  return await processAndCacheImage(filename, width, height);
}
