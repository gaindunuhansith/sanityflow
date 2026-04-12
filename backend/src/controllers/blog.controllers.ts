import type { Request, Response, NextFunction } from "express";
import {
  getAllBlogPostsService,
  getBlogPostByIdService,
  createBlogPostService,
  updateBlogPostService,
  deleteBlogPostService,
} from "../services/blog.service.js";
import {
  getBlogPostsQuerySchema,
  blogPostIdParamSchema,
  createBlogPostSchema,
  updateBlogPostSchema,
} from "../validations/blog.schemas.js";

export const getAllBlogPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = getBlogPostsQuerySchema.parse(req.query);
    const result = await getAllBlogPostsService(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBlogPostByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = blogPostIdParamSchema.parse(req.params);
    const post = await getBlogPostByIdService(id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const createBlogPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createBlogPostSchema.parse(req.body);
    const post = await createBlogPostService(data, req.file);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updateBlogPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = blogPostIdParamSchema.parse(req.params);
    const data = updateBlogPostSchema.parse(req.body);
    const post = await updateBlogPostService(id, data, req.file);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = blogPostIdParamSchema.parse(req.params);
    await deleteBlogPostService(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};