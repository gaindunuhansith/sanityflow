import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(8).optional(),
}).refine(data => {
  // if either password field is provided, both must be present
  const either = data.currentPassword || data.newPassword;
  if (either) return data.currentPassword && data.newPassword;
  return true;
}, { message: 'Both currentPassword and newPassword are required to change password' });

export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateProfileSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
