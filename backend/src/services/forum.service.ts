import ForumThread from '../models/ForumThread.js';
import ForumReply from '../models/ForumReply.js';
import type { IForumThread } from '../models/ForumThread.js';
import type { IForumReply } from '../models/ForumReply.js';
import type { UserRole } from '../types/index.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateThreadData, UpdateThreadData, CreateReplyData, GetThreadsQuery } from '../validations/forum.schemas.js';

export interface PaginatedThreads {
  threads: IForumThread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ThreadWithReplies {
  thread: IForumThread;
  replies: IForumReply[];
  totalReplies: number;
}

export const getAllThreadsService = async (query: GetThreadsQuery): Promise<PaginatedThreads> => {
  const { page, limit, status, tag, search } = query;

  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [threads, total] = await Promise.all([
    ForumThread.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ForumThread.countDocuments(filter),
  ]);

  return { threads, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getThreadByIdService = async (id: string): Promise<IForumThread> => {
  const thread = await ForumThread.findById(id).populate('author', 'name');
  if (!thread) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Thread not found');
  return thread;
};

export const createThreadService = async (data: CreateThreadData, userId: string): Promise<IForumThread> => {
  const thread = new ForumThread({ ...data, author: userId });
  return await thread.save();
};

export const updateThreadService = async (
  id: string,
  data: UpdateThreadData,
  userId: string,
  role: UserRole,
): Promise<IForumThread> => {
  const thread = await ForumThread.findById(id);
  if (!thread) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Thread not found');

  if (role === 'admin') {
    const hasNonStatusField =
      data.title !== undefined ||
      data.content !== undefined ||
      data.tags !== undefined;

    if (hasNonStatusField) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, 'Admins can only update thread status');
    }

    if (data.status === undefined) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Status is required for admin updates');
    }
  } else if (thread.author.toString() !== userId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'You can only edit your own threads');
  }

  const updated = await ForumThread.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  ).populate('author', 'name');

  return updated!;
};

export const deleteThreadService = async (id: string, userId: string, role: UserRole): Promise<void> => {
  const thread = await ForumThread.findById(id);
  if (!thread) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Thread not found');

  if (role !== 'admin' && thread.author.toString() !== userId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own threads');
  }

  await Promise.all([
    ForumThread.findByIdAndDelete(id),
    ForumReply.deleteMany({ thread: id }),
  ]);
};

// ─── Replies ──────────────────────────────────────────────────────────────────

export const getRepliesService = async (threadId: string, page: number, limit: number) => {
  const thread = await ForumThread.findById(threadId);
  if (!thread) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Thread not found');

  const skip = (page - 1) * limit;

  const [replies, total] = await Promise.all([
    ForumReply.find({ thread: threadId })
      .populate('author', 'name')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    ForumReply.countDocuments({ thread: threadId }),
  ]);

  return { replies, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createReplyService = async (
  threadId: string,
  data: CreateReplyData,
  userId: string,
): Promise<IForumReply> => {
  const thread = await ForumThread.findById(threadId);
  if (!thread) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Thread not found');
  if (thread.status === 'Closed') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Cannot reply to a closed thread');
  }

  const reply = new ForumReply({ thread: threadId, content: data.content, author: userId });
  await reply.save();

  await ForumThread.findByIdAndUpdate(threadId, { $inc: { replyCount: 1 } });

  return reply;
};

export const deleteReplyService = async (
  threadId: string,
  replyId: string,
  userId: string,
): Promise<void> => {
  const reply = await ForumReply.findOne({ _id: replyId, thread: threadId });
  if (!reply) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Reply not found');
  if (reply.author.toString() !== userId) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own replies');
  }

  await Promise.all([
    ForumReply.findByIdAndDelete(replyId),
    ForumThread.findByIdAndUpdate(threadId, { $inc: { replyCount: -1 } }),
  ]);
};
