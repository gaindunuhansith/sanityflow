import Driver from '../models/Driver.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import type { IDriver } from '../models/Driver.js';
import { AppError } from '../utils/errorHandler.js';

export const createDriver = async (data: Partial<IDriver> & { password: string }) => {
  const { password, ...profileData } = data;

  const existingUser = await User.findOne({ email: profileData.email });
  if (existingUser) throw new AppError(409, 'Email already in use');

  // Create the User account with driver role so they can log in via /auth/login
  const user = await User.create({
    name: profileData.name,
    email: profileData.email,
    password,
    role: 'driver',
  });

  try {
    const driver = await Driver.create({ ...profileData, userId: user._id });
    return driver;
  } catch (err) {
    // Roll back user creation if driver profile fails
    await User.findByIdAndDelete(user._id);
    throw err;
  }
};

export const getAllDrivers = async (filters?: {
  availability?: 'Active' | 'Inactive';
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query: any = {};

  if (filters?.availability) {
    query.availability = filters.availability;
  }

  if (filters?.search) {
    const pattern = new RegExp(filters.search, 'i');
    query.$or = [
      { name: pattern },
      { email: pattern },
      { contact: pattern },
      { vehicleInfo: pattern },
      { assignedArea: pattern },
    ];
  }

  const page = Number.isFinite(filters?.page) ? Math.max(1, filters?.page as number) : 1;
  const limit = Number.isFinite(filters?.limit)
    ? Math.min(100, Math.max(1, filters?.limit as number))
    : 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Driver.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Driver.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getDriverById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid driver ID');
  }
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(404, 'Driver not found');
  }
  return driver;
};

export const updateDriver = async (id: string, data: Partial<IDriver>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid driver ID');
  }
  const driver = await Driver.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!driver) {
    throw new AppError(404, 'Driver not found');
  }
  return driver;
};

export const deleteDriver = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid driver ID');
  }
  const driver = await Driver.findByIdAndDelete(id);
  if (!driver) {
    throw new AppError(404, 'Driver not found');
  }
  return driver;
};
