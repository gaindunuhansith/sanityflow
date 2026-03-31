import type { Request, Response, NextFunction } from "express";
import { lookupBarcodeService } from "../services/barcode.service.js";
import { HTTP_STATUS } from "../constants/index.js";
import { barcodeSchema } from "../validations/barcode.schema.js";

export const lookupBarcodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Zod validation (fixes string | string[] issue automatically)
    const parsed = barcodeSchema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({
          error: "Invalid barcode",
          details: parsed.error.format(),
        });
    }

    const { barcode } = parsed.data;

    const product = await lookupBarcodeService(barcode);

    if (!product) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Product not found in external databases" });
    }

    res.status(HTTP_STATUS.OK).json(product);

  } catch (error) {
    next(error);
  }
};