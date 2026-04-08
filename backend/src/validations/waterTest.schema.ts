import { z } from 'zod';

// Schema for creating a new water quality test
export const createWaterTestSchema = z.object({
  waterSource: z.string().min(1, 'Water source is required'),
  pH: z.number().min(0).max(14),
  tds: z.number().min(0),
  turbidity: z.number().min(0),
  contaminants: z.array(z.string()).default([]),
  notes: z.string().optional()
});

// Schema for updating a water quality test
export const updateWaterTestSchema = z.object({
  pH: z.number().min(0).max(14).optional(),
  tds: z.number().min(0).optional(),
  turbidity: z.number().min(0).optional(),
  contaminants: z.array(z.string()).optional(),
  status: z.enum(['Safe', 'Unsafe']).optional(),
  notes: z.string().optional(),
  // Weather data fields (optional updates)
  temperature: z.number().min(-100).max(100).optional(),
  humidity: z.number().min(0).max(100).optional(),
  pressure: z.number().min(800).max(1200).optional(),
  windSpeed: z.number().min(0).optional(),
  weatherCondition: z.string().optional(),
  weatherDescription: z.string().optional()
});

// Query filters for GET /api/water-tests
export const waterTestFilterSchema = z.object({
  source: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});
