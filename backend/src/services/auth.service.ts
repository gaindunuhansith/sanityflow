import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { JWT_EXPIRES_IN, HTTP_STATUS } from '../constants/index.js';
import env from '../config/env.js';
import type { UserRole } from '../types/index.js';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: never; // role cannot be set during self-registration
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

const signToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const createAdminUser = async ({ name, email, password }: RegisterInput): Promise<AuthResult> => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(HTTP_STATUS.CONFLICT, 'Email already in use');

  const user = await User.create({ name, email, password, role: 'admin' });
  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
  };
};

export const registerUser = async ({ name, email, password }: RegisterInput): Promise<AuthResult> => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'Email already in use');
  }

  const user = await User.create({ name, email, password, role: 'member' });
  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
  };
};

export const loginUser = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
  };
};
