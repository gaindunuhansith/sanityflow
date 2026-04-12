import Beneficiary from '../models/Beneficiary.js';
import mongoose from 'mongoose';
import type { IBeneficiary } from '../models/Beneficiary.js';
import { AppError } from '../utils/errorHandler.js';

export const createBeneficiary = async (data: Partial<IBeneficiary>) => {
  // TODO: Send notification to beneficiary (if needed)
  const createdBeneficiary = await Beneficiary.create(data);
  return await createdBeneficiary.populate('submittedBy', 'name email');
};

export const getAllBeneficiaries = async (filters?: {
  eligibilityStatus?: 'Pending' | 'Active' | 'Inactive';
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query: any = {};

  if (filters?.eligibilityStatus) {
    query.eligibilityStatus = filters.eligibilityStatus;
  }

  if (filters?.search) {
    const pattern = new RegExp(filters.search, 'i');
    query.$or = [{ name: pattern }, { location: pattern }, { contact: pattern }];
  }

  const page = Number.isFinite(filters?.page) ? Math.max(1, filters?.page as number) : 1;
  const limit = Number.isFinite(filters?.limit)
    ? Math.min(100, Math.max(1, filters?.limit as number))
    : 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Beneficiary.find(query)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Beneficiary.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getBeneficiaryById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid beneficiary ID');
  }
  const beneficiary = await Beneficiary.findById(id).populate('submittedBy', 'name email');
  if (!beneficiary) {
    throw new AppError(404, 'Beneficiary not found');
  }
  return beneficiary;
};

export const updateBeneficiary = async (id: string, data: Partial<IBeneficiary>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid beneficiary ID');
  }
  const beneficiary = await Beneficiary.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).populate('submittedBy', 'name email');
  if (!beneficiary) {
    throw new AppError(404, 'Beneficiary not found');
  }
  // TODO: Send notification to beneficiary (if needed)
  return beneficiary;
};

export const deleteBeneficiary = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid beneficiary ID');
  }
  const beneficiary = await Beneficiary.findByIdAndDelete(id);
  if (!beneficiary) {
    throw new AppError(404, 'Beneficiary not found');
  }
  // TODO: Handle related cleanup (if needed)
  return beneficiary;
};
