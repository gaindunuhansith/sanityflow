import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  coverImageKey?: string;
  tags: string[];
  status: 'Draft' | 'Published';
  publishedAt?: Date;
}

const blogPostSchema = new mongoose.Schema<IBlogPost>(
  {
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, maxlength: 240 },
    summary: { type: String, maxlength: 500 },
    content: { type: String, required: true },
    coverImage: { type: String },
    coverImageKey: { type: String },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ coverImageKey: 1 });

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
