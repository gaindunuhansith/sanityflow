import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../config/env.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

const sanitizeKeyPart = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '');
};

const ensureS3Config = () => {
  if (!env.AWS_REGION || !env.AWS_S3_BUCKET || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    throw new AppError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'S3 upload is not configured. Add AWS S3 environment variables.');
  }
};

const hasS3Config = (): boolean => {
  return Boolean(env.AWS_REGION && env.AWS_S3_BUCKET && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY);
};

interface S3Config {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

const getS3Config = (): S3Config => {
  const region = env.AWS_REGION;
  const bucket = env.AWS_S3_BUCKET;
  const accessKeyId = env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new AppError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'S3 upload is not configured. Add AWS S3 environment variables.');
  }

  return {
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
  };
};

const createS3Client = (): S3Client => {
  const config = getS3Config();

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

const resolvePublicUrl = (key: string): string => {
  if (env.AWS_S3_PUBLIC_BASE_URL) {
    return `${env.AWS_S3_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`;
  }

  const config = getS3Config();
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
};

const buildBlogImageKey = (fileNameSeed: string): string => {
  const safeSeed = sanitizeKeyPart(fileNameSeed) || 'blog-post';
  return `blog/${safeSeed}-${Date.now()}.webp`;
};

export interface UploadBlogImageInput {
  buffer: Buffer;
  contentType: string;
  fileNameSeed: string;
}

export interface UploadBlogImageResult {
  key: string;
  url: string;
}

export const uploadBlogImageToS3 = async (input: UploadBlogImageInput): Promise<UploadBlogImageResult> => {
  const config = getS3Config();
  const s3Client = createS3Client();
  const key = buildBlogImageKey(input.fileNameSeed);

  await s3Client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: input.buffer,
    ContentType: input.contentType,
  }));

  return {
    key,
    url: resolvePublicUrl(key),
  };
};

export const deleteObjectFromS3 = async (key: string): Promise<void> => {
  const config = getS3Config();

  if (!key) {
    return;
  }

  const s3Client = createS3Client();
  await s3Client.send(new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  }));
};

export const getSignedBlogImageUrl = async (key: string, expiresInSeconds = 3600): Promise<string> => {
  const config = getS3Config();
  const s3Client = createS3Client();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};

export const resolveBlogCoverImageUrl = async (
  coverImage: string | undefined,
  coverImageKey: string | undefined,
): Promise<string | undefined> => {
  if (!coverImageKey) {
    return coverImage;
  }

  if (!hasS3Config()) {
    return coverImage;
  }

  try {
    return await getSignedBlogImageUrl(coverImageKey);
  } catch {
    return coverImage;
  }
};
