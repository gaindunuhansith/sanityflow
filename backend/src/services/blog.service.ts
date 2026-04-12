import BlogPost from '../models/BlogPost.js';
import type { IBlogPost } from '../models/BlogPost.js';
import type { CreateBlogPostData, UpdateBlogPostData, GetBlogPostsQuery } from '../validations/blog.schemas.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';
import mongoose from 'mongoose';
import { processBlogCoverImage } from './imageProcessing.service.js';
import { deleteObjectFromS3, resolveBlogCoverImageUrl, uploadBlogImageToS3 } from './s3Upload.service.js';

export interface PaginatedBlogPosts {
  posts: IBlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const enrichBlogImageUrl = async (post: IBlogPost): Promise<IBlogPost> => {
  const resolvedCoverImage = await resolveBlogCoverImageUrl(post.coverImage, post.coverImageKey);

  if (resolvedCoverImage) {
    post.coverImage = resolvedCoverImage;
  } else {
    post.set('coverImage', undefined, { strict: false });
  }

  return post;
};

const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '');
};

const buildUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  const base = toSlug(title) || `post-${Date.now()}`;
  const idFilter = excludeId ? { _id: { $ne: new mongoose.Types.ObjectId(excludeId) } } : {};

  let candidate = base;
  let suffix = 1;

  while (await BlogPost.exists({ slug: candidate, ...idFilter })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
};

export const getAllBlogPostsService = async (query: GetBlogPostsQuery): Promise<PaginatedBlogPosts> => {
  const { page, limit, status, tag, search } = query;

  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  if (tag) {
    filter.tags = tag;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BlogPost.countDocuments(filter),
  ]);

  const enrichedPosts = await Promise.all(posts.map((post) => enrichBlogImageUrl(post)));

  return {
    posts: enrichedPosts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBlogPostByIdService = async (id: string): Promise<IBlogPost> => {
  const post = await BlogPost.findById(id);
  if (!post) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
  }
  return await enrichBlogImageUrl(post);
};

export const createBlogPostService = async (data: CreateBlogPostData, coverImageFile?: Express.Multer.File): Promise<IBlogPost> => {
  const slug = await buildUniqueSlug(data.title);
  let uploadedCoverImage: { key: string; url: string } | undefined;

  if (coverImageFile) {
    const processedImage = await processBlogCoverImage(coverImageFile.buffer);
    uploadedCoverImage = await uploadBlogImageToS3({
      buffer: processedImage.buffer,
      contentType: processedImage.contentType,
      fileNameSeed: slug,
    });
  }

  const post = new BlogPost({
    ...data,
    slug,
    ...(uploadedCoverImage ? { coverImage: uploadedCoverImage.url, coverImageKey: uploadedCoverImage.key } : {}),
  });

  if (data.status === 'Published' && !post.publishedAt) {
    post.publishedAt = new Date();
  }

  try {
    const saved = await post.save();
    return await enrichBlogImageUrl(saved);
  } catch (error) {
    if (uploadedCoverImage) {
      await deleteObjectFromS3(uploadedCoverImage.key).catch(() => undefined);
    }
    throw error;
  }
};

export const updateBlogPostService = async (id: string, data: UpdateBlogPostData, coverImageFile?: Express.Multer.File): Promise<IBlogPost> => {
  const existingPost = await BlogPost.findById(id);
  if (!existingPost) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
  }

  const updatePayload: Record<string, unknown> = { ...data };
  let newlyUploadedImage: { key: string; url: string } | undefined;

  if (typeof data.title === 'string' && data.title.trim().length > 0) {
    updatePayload.slug = await buildUniqueSlug(data.title, id);
  }

  if (coverImageFile) {
    const processedImage = await processBlogCoverImage(coverImageFile.buffer);
    const fileNameSeed = typeof updatePayload.slug === 'string' ? updatePayload.slug : existingPost.slug;

    const uploadedImage = await uploadBlogImageToS3({
      buffer: processedImage.buffer,
      contentType: processedImage.contentType,
      fileNameSeed,
    });

    newlyUploadedImage = uploadedImage;
    updatePayload.coverImage = uploadedImage.url;
    updatePayload.coverImageKey = uploadedImage.key;
  }

  if (data.status === 'Published') {
    updatePayload.publishedAt = new Date();
  }

  try {
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    );

    if (!post) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
    }

    if (newlyUploadedImage && existingPost.coverImageKey && existingPost.coverImageKey !== newlyUploadedImage.key) {
      await deleteObjectFromS3(existingPost.coverImageKey).catch(() => undefined);
    }

    return await enrichBlogImageUrl(post);
  } catch (error) {
    if (newlyUploadedImage) {
      await deleteObjectFromS3(newlyUploadedImage.key).catch(() => undefined);
    }
    throw error;
  }
};

export const deleteBlogPostService = async (id: string): Promise<void> => {
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Blog post not found');
  }

  if (post.coverImageKey) {
    await deleteObjectFromS3(post.coverImageKey).catch(() => undefined);
  }
};
