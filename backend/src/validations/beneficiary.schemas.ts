import { z } from 'zod';

export const createBeneficiarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  familySize: z.number().int().min(1, 'Family size must be at least 1'),
  contact: z.string().min(1, 'Contact is required'),
  eligibilityStatus: z.enum(['Pending', 'Active', 'Inactive']).optional(),
});

export const updateBeneficiarySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  familySize: z.number().int().min(1, 'Family size must be at least 1').optional(),
  contact: z.string().min(1, 'Contact is required').optional(),
  eligibilityStatus: z.enum(['Pending', 'Active', 'Inactive']).optional(),
});

export const eligibilityStatusSchema = z.object({
  eligibilityStatus: z.enum(['Pending', 'Active', 'Inactive']),
});
