import { z } from 'zod';

export const createDistributionOrderSchema = z.object({
  resource: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid resource ID'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  targetLocation: z.string().min(1, 'Target location is required'),
  beneficiaries: z.array(z.string().regex(/^[a-f\d]{24}$/i, 'Invalid beneficiary ID')).optional(),
  notes: z.string().optional()
});

export const updateDistributionOrderSchema = z.object({
  driver: z.string().optional(),
  beneficiaries: z.array(z.string().regex(/^[a-f\d]{24}$/i, 'Invalid beneficiary ID')).optional(),
  notes: z.string().optional()
});

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(['In Transit', 'Delivered', 'Failed'])
});
