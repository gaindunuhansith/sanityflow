import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) throw new AppError(404, 'User not found');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) throw new AppError(404, 'User not found');

    if (currentPassword && newPassword) {
      const valid = await user.comparePassword(currentPassword);
      if (!valid) throw new AppError(400, 'Current password is incorrect');
      user.password = newPassword;
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const taken = await User.findOne({ email });
      if (taken) throw new AppError(409, 'Email already in use');
      user.email = email;
    }

    await user.save();
    const { password: _, ...profile } = user.toObject();
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
