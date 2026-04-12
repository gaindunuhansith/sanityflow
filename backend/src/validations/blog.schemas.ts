import { z } from 'zod';

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);
        }
      } catch {
        return [];
      }
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

const normalizeOptionalCoverImage = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  summary: z.string().max(500, 'Summary must be at most 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.preprocess(normalizeOptionalCoverImage, z.url('Cover image must be a valid URL').optional()),
  tags: z.preprocess(normalizeTags, z.array(z.string().min(1)).default([])),
  status: z.enum(['Draft', 'Published']).default('Draft'),
});

export const updateBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters').optional(),
  summary: z.string().max(500, 'Summary must be at most 500 characters').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  coverImage: z.preprocess(normalizeOptionalCoverImage, z.url('Cover image must be a valid URL').optional()),
  tags: z.preprocess((value) => (value === undefined ? undefined : normalizeTags(value)), z.array(z.string().min(1)).optional()),
  status: z.enum(['Draft', 'Published']).optional(),
});

export const blogPostIdParamSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
});

export const getBlogPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['Draft', 'Published']).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});

export type CreateBlogPostData = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostData = z.infer<typeof updateBlogPostSchema>;
export type BlogPostIdParam = z.infer<typeof blogPostIdParamSchema>;
export type GetBlogPostsQuery = z.infer<typeof getBlogPostsQuerySchema>;
