import type { Request, Response } from "express";
import * as service from "../services/inventoryTransaction.service.js";
import { HTTP_STATUS } from "../constants/index.js";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await service.createTransaction({
      ...req.body,
      user: req.user.userId,
    });

    res.status(HTTP_STATUS.CREATED).json(transaction);

  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message,
    });

  }
};

export const getAllTransactions = async (_req: Request, res: Response) => {
  const transactions = await service.getAllTransactions();
  res.status(HTTP_STATUS.OK).json(transactions);
};

export const getTransactionById = async (req: Request, res: Response) => {

    const {id} = req.params;

    if (!id || typeof id !== "string") {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: "Invalid resource ID" });
  }

  const transaction = await service.getTransactionById(id );

  if (!transaction)
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ error: "Transaction not found" });

  res.status(HTTP_STATUS.OK).json(transaction);
};