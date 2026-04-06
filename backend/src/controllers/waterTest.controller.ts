import type { Request, Response, NextFunction } from 'express';
import { 
  createWaterTestService, 
  getAllWaterTestsService,
  getWaterTestByIdService,
  updateWaterTestService, 
  deleteWaterTestService,
  getWaterTestAnalyticsService
} from '../services/waterTest.service.js';
import { createWaterTestSchema, updateWaterTestSchema, waterTestFilterSchema } from '../validations/waterTest.schemas.js';
import { HTTP_STATUS } from '../constants/index.js';

export const createWaterTestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createWaterTestSchema.parse(req.body);
    const test = await createWaterTestService(validatedData, req.user.userId);
    res.status(HTTP_STATUS.CREATED).json(test);
  } catch (error) {
    next(error);
  }
};

export const getWaterTestsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = waterTestFilterSchema.parse(req.query);
    const tests = await getAllWaterTestsService(filters);
    res.json(tests);
  } catch (error) {
    next(error);
  }
};

export const getWaterTestAnalyticsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { source } = req.query as { source?: string };
    const trends = await getWaterTestAnalyticsService(source);
    res.json(trends);
  } catch (error) {
    next(error);
  }
};

export const getWaterTestByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const test = await getWaterTestByIdService(id);
    res.json(test);
  } catch (error) {
    next(error);
  }
};

export const updateWaterTestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const validatedData = updateWaterTestSchema.parse(req.body);
    const test = await updateWaterTestService(id, validatedData);
    res.json(test);
  } catch (error) {
    next(error);
  }
};

export const deleteWaterTestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await deleteWaterTestService(id);
    res.json({ message: 'Water quality test deleted successfully' });
  } catch (error) {
    next(error);
  }
};