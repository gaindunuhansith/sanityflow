import { z } from "zod";

export const barcodeSchema = z.object({
  barcode: z
    .string()
    .min(8, "Barcode must be at least 8 characters")
    .max(20, "Barcode too long")
    .regex(/^[0-9]+$/, "Barcode must contain only numbers"),
});

// 👇 Type (VERY IMPORTANT)
export type BarcodeParams = z.infer<typeof barcodeSchema>;