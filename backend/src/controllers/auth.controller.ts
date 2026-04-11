import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, createAdminUser } from '../services/auth.service.js';
import { HTTP_STATUS } from '../constants/index.js';
import Logger from '../utils/logger.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerUser(req.body);
    Logger.info(`User registered: ${result.user.id} (${result.user.email})`);
    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUser(req.body);
    Logger.info(`User logged in: ${result.user.id} (${result.user.email})`);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createAdminUser(req.body);
    Logger.info(`Admin created: ${result.user.id} (${result.user.email})`);
    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
