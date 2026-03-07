import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import type { IInventoryTransaction } from "../types/inventoryTransaction.type.js";
import { Resource } from "../models/resource.model.js";

export const createTransaction = async (
  data: Partial<IInventoryTransaction>
) => {

  const resource = await Resource.findById(data.product);

  if (!resource) {
    throw new Error("Resource not found");
  }

  const quantity = data.quantity ?? 0;

  if (data.type === "REMOVE") {

    if (resource.quantity < quantity) {
      throw new Error("Not enough stock available");
    }

    resource.quantity -= quantity;
  }

  if (data.type === "ADD") {
    resource.quantity += quantity;
  }

  await resource.save();

  const transaction = await InventoryTransaction.create(data);

  return transaction;
};

export const getAllTransactions = async () => {
  return await InventoryTransaction.find()
    .populate("product")
    .populate("user");
};

export const getTransactionById = async (id: string) => {
  return await InventoryTransaction.findById(id)
    .populate("product")
    .populate("user");
};