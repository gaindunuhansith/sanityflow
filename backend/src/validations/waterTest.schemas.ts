import { z } from 'zod';
import { createWaterTestSchema, updateWaterTestSchema, waterTestFilterSchema } from './waterTest.schema.js';

export { createWaterTestSchema, updateWaterTestSchema, waterTestFilterSchema };

export type WaterTestStatus = 'Safe' | 'Unsafe';

export type CreateWaterTestData = z.infer<typeof createWaterTestSchema>;
export type UpdateWaterTestData = z.infer<typeof updateWaterTestSchema>;
export type WaterTestFilters = z.infer<typeof waterTestFilterSchema>;
