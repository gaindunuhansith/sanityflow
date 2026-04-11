import type { Request, Response, NextFunction } from 'express';
import { createBeneficiarySchema, updateBeneficiarySchema } from '../validations/beneficiary.schemas.js';
import { createBeneficiary, getAllBeneficiaries, getBeneficiaryById, updateBeneficiary, deleteBeneficiary } from '../services/beneficiary.service.js';
import type { IBeneficiary } from '../models/Beneficiary.js';

export const createBeneficiaryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createBeneficiarySchema.parse(req.body);
    const beneficiary = await createBeneficiary({
      ...data,
      eligibilityStatus: req.user.role === 'member' ? 'Pending' : (data.eligibilityStatus ?? 'Active'),
      submittedBy: req.user.userId,
    });
    res.status(201).json(beneficiary);
  } catch (error) {
    next(error);
  }
};

export const getAllBeneficiariesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eligibilityStatus, search, page, limit } = req.query;
    const beneficiaries = await getAllBeneficiaries(
      {
        ...(eligibilityStatus ? { eligibilityStatus: eligibilityStatus as 'Pending' | 'Active' | 'Inactive' } : {}),
        ...(search ? { search: String(search) } : {}),
        ...(page ? { page: Number(page) } : {}),
        ...(limit ? { limit: Number(limit) } : {}),
      }
    );
    res.status(200).json(beneficiaries);
  } catch (error) {
    next(error);
  }
};

export const getBeneficiaryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const beneficiary = await getBeneficiaryById(req.params['id'] as string);
    res.status(200).json(beneficiary);
  } catch (error) {
    next(error);
  }
};

export const updateBeneficiaryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateBeneficiarySchema.parse(req.body);
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Partial<IBeneficiary>;
    const beneficiary = await updateBeneficiary(req.params['id'] as string, cleanData);
    res.status(200).json(beneficiary);
  } catch (error) {
    next(error);
  }
};

export const deleteBeneficiaryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const beneficiary = await deleteBeneficiary(req.params['id'] as string);
    res.status(200).json({ message: 'Beneficiary deleted', beneficiary });
  } catch (error) {
    next(error);
  }
};
