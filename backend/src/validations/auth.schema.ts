import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
}).strip(); // strips any extra fields like 'role' before they reach the service

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = registerSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
