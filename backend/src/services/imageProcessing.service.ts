import sharp from 'sharp';
import env from '../config/env.js';

export interface ProcessedBlogImage {
  buffer: Buffer;
  contentType: 'image/webp';
}

export const processBlogCoverImage = async (sourceBuffer: Buffer): Promise<ProcessedBlogImage> => {
  const buffer = await sharp(sourceBuffer)
    .rotate()
    .resize({ width: env.BLOG_IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: env.BLOG_IMAGE_WEBP_QUALITY })
    .toBuffer();

  return {
    buffer,
    contentType: 'image/webp',
  };
};
