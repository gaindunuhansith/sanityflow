import type { Request, Response, NextFunction } from 'express';
import {
  getAllThreadsService,
  getThreadByIdService,
  createThreadService,
  updateThreadService,
  deleteThreadService,
  getRepliesService,
  createReplyService,
  deleteReplyService,
} from '../services/forum.service.js';
import {
  getThreadsQuerySchema,
  threadIdParamSchema,
  replyParamSchema,
  createThreadSchema,
  updateThreadSchema,
  createReplySchema,
} from '../validations/forum.schemas.js';
import Logger from '../utils/logger.js';

export const getAllThreadsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = getThreadsQuerySchema.parse(req.query);
    const result = await getAllThreadsService(query);
    res.status(200).json(result);
  } catch (error) { next(error); }
};

export const getThreadByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = threadIdParamSchema.parse(req.params);
    const thread = await getThreadByIdService(id);
    res.status(200).json(thread);
  } catch (error) { next(error); }
};

export const createThreadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createThreadSchema.parse(req.body);
    const userId = req.user.userId;
    const thread = await createThreadService(data, userId);
    Logger.info(`Thread created: ${thread._id} by user: ${userId}`);
    res.status(201).json(thread);
  } catch (error) { next(error); }
};

export const updateThreadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = threadIdParamSchema.parse(req.params);
    const data = updateThreadSchema.parse(req.body);
    const userId = req.user.userId;
    const userRole = req.user.role;
    const thread = await updateThreadService(id, data, userId, userRole);
    Logger.info(`Thread updated: ${id} by user: ${userId}`);
    res.status(200).json(thread);
  } catch (error) { next(error); }
};

export const deleteThreadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = threadIdParamSchema.parse(req.params);
    const userId = req.user.userId;
    const userRole = req.user.role;
    await deleteThreadService(id, userId, userRole);
    Logger.info(`Thread deleted: ${id} by user: ${userId}`);
    res.status(204).send();
  } catch (error) { next(error); }
};

export const getRepliesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = threadIdParamSchema.parse(req.params);
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const result = await getRepliesService(id, page, limit);
    res.status(200).json(result);
  } catch (error) { next(error); }
};

export const createReplyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = threadIdParamSchema.parse(req.params);
    const data = createReplySchema.parse(req.body);
    const userId = req.user.userId;
    const reply = await createReplyService(id, data, userId);
    Logger.info(`Reply created: ${reply._id} on thread: ${id} by user: ${userId}`);
    res.status(201).json(reply);
  } catch (error) { next(error); }
};

export const deleteReplyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, replyId } = replyParamSchema.parse(req.params);
    const userId = req.user.userId;
    const userRole = req.user.role;
    await deleteReplyService(id, replyId, userId, userRole);
    Logger.info(`Reply deleted: ${replyId} on thread: ${id} by user: ${userId}`);
    res.status(204).send();
  } catch (error) { next(error); }
};
