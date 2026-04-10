import DistributionOrder from '../models/DistributionOrder.js';
import { Resource } from '../models/resource.model.js';
import { InventoryTransaction } from '../models/inventoryTransaction.model.js';
import Beneficiary from '../models/Beneficiary.js';
import mongoose from 'mongoose';
import { AppError } from '../utils/errorHandler.js';
import { sendOrderAssignedEmail, sendStatusUpdateEmail } from './email.service.js';
import type { JWTPayload } from '../types/index.js';

const validateBeneficiaries = async (beneficiaries?: string[]) => {
  if (!beneficiaries || beneficiaries.length === 0) {
    return;
  }

  for (const beneficiaryId of beneficiaries) {
    if (!mongoose.Types.ObjectId.isValid(beneficiaryId)) {
      throw new AppError(400, `Invalid beneficiary ID: ${beneficiaryId}`);
    }
  }

  const foundBeneficiaries = await Beneficiary.find({ _id: { $in: beneficiaries } }).select('_id eligibilityStatus');
  if (foundBeneficiaries.length !== beneficiaries.length) {
    throw new AppError(404, 'One or more beneficiaries not found');
  }

  const inactiveBeneficiary = foundBeneficiaries.find((beneficiary) => beneficiary.eligibilityStatus !== 'Active');
  if (inactiveBeneficiary) {
    throw new AppError(400, 'All beneficiaries must be Active');
  }
};

export const createDistributionOrder = async (data: {
  resource: string;
  quantity: number;
  targetLocation: string;
  beneficiaries?: string[] | undefined;
  notes?: string | undefined;
  createdBy: string;
}) => {
  const resource = await Resource.findById(data.resource);
  if (!resource) throw new AppError(404, 'Resource not found');
  if (resource.quantity < data.quantity) throw new AppError(400, 'Insufficient stock');

  await validateBeneficiaries(data.beneficiaries);

  const normalizedBeneficiaries = data.beneficiaries ? Array.from(new Set(data.beneficiaries)) : [];

  const order = await DistributionOrder.create({
    ...data,
    beneficiaries: normalizedBeneficiaries,
    status: 'Pending'
  });

  await Resource.findByIdAndUpdate(data.resource, { $inc: { quantity: -data.quantity } });
  await InventoryTransaction.create({
    product: data.resource,
    type: 'REMOVE',
    quantity: data.quantity,
    user: data.createdBy,
    reason: `Distribution order ${order._id} created`
  });

  return await DistributionOrder.findById(order._id)
    .populate('resource', 'name unit category')
    .populate('driver', 'name email')
    .populate('createdBy', 'name email')
    .populate('beneficiaries', 'name location eligibilityStatus');
};

export const getAllDistributionOrders = async (filters?: {
  status?: string;
  driver?: string;
  beneficiary?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query: any = {};
  
  if (filters?.status) query.status = filters.status;
  if (filters?.driver !== undefined) query.driver = filters.driver;
  if (filters?.beneficiary) query.beneficiaries = filters.beneficiary;

  if (filters?.search) {
    const pattern = new RegExp(filters.search, 'i');
    query.$or = [{ targetLocation: pattern }, { notes: pattern }];

    if (mongoose.Types.ObjectId.isValid(filters.search)) {
      query.$or.push({ _id: new mongoose.Types.ObjectId(filters.search) });
    }
  }

  const page = Number.isFinite(filters?.page) ? Math.max(1, filters?.page as number) : 1;
  const limit = Number.isFinite(filters?.limit)
    ? Math.min(100, Math.max(1, filters?.limit as number))
    : 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    DistributionOrder.find(query)
      .populate('resource', 'name unit category')
      .populate('driver', 'name email')
      .populate('createdBy', 'name email')
      .populate('beneficiaries', 'name location eligibilityStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    DistributionOrder.countDocuments(query),
  ]);
  
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getDistributionOrderById = async (id: string, requester?: JWTPayload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid order ID');
  }

  const query: { _id: string; driver?: string } = { _id: id };
  if (requester?.role === 'driver') {
    query.driver = requester.userId;
  }
  
  const order = await DistributionOrder.findOne(query)
    .populate('resource', 'name unit category')
    .populate('driver', 'name email')
    .populate('createdBy', 'name email')
    .populate('beneficiaries', 'name location eligibilityStatus');
  
  if (!order) {
    throw new AppError(404, 'Distribution order not found');
  }
  
  return order;
};

export const updateDistributionOrder = async (
  id: string,
  data: { driver?: string | undefined; beneficiaries?: string[] | undefined; notes?: string | undefined }
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid order ID');
  }
  
  const updateData: any = {};
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.beneficiaries !== undefined) {
    await validateBeneficiaries(data.beneficiaries);
    updateData.beneficiaries = Array.from(new Set(data.beneficiaries));
  }
  
  if (data.driver) {
    if (!mongoose.Types.ObjectId.isValid(data.driver)) {
      throw new AppError(400, 'Invalid driver ID');
    }
    updateData.driver = data.driver;
    updateData.status = 'Assigned';
  }
  
  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, 'No valid fields provided for update');
  }

  const updatedOrder = await DistributionOrder.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    throw new AppError(404, 'Distribution order not found');
  }

  const order = await DistributionOrder.findById(id)
    .populate('resource', 'name unit category')
    .populate<{ driver: { _id: mongoose.Types.ObjectId; name: string; email: string } | null }>('driver', 'name email')
    .populate('createdBy', 'name email')
    .populate('beneficiaries', 'name location eligibilityStatus');
  
  if (!order) {
    throw new AppError(404, 'Distribution order not found');
  }

  // Email driver when assigned
  if (data.driver && order.driver) {
    const driver = order.driver as { _id: mongoose.Types.ObjectId; name: string; email: string };
    void sendOrderAssignedEmail({
      driverEmail: driver.email,
      driverName: driver.name,
      orderId: order._id.toString(),
      targetLocation: order.targetLocation,
    });
  }
  
  return order;
};

export const updateDeliveryStatus = async (id: string, status: string, driverUserId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid order ID');
  }
  
  const order = await DistributionOrder.findOneAndUpdate(
    { _id: id, driver: driverUserId },
    { status },
    { new: true, runValidators: true }
  ).populate('resource', 'name unit category')
   .populate('driver', 'name email')
   .populate<{ createdBy: { _id: mongoose.Types.ObjectId; name: string; email: string } }>('createdBy', 'name email')
   .populate('beneficiaries', 'name location eligibilityStatus');
  
  if (!order) {
    throw new AppError(404, 'Distribution order not found for this driver');
  }

  // Email the admin (order creator) on every status change
  const creator = order.createdBy as unknown as { email: string };
  if (creator?.email) {
    void sendStatusUpdateEmail({
      recipientEmail: creator.email,
      orderId: order._id.toString(),
      targetLocation: order.targetLocation,
      status,
      ...(order.notes !== undefined && { notes: order.notes }),
    });
  }
  
  return order;
};

export const deleteDistributionOrder = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid order ID');
  }
  
  const order = await DistributionOrder.findByIdAndDelete(id);
  
  if (!order) {
    throw new AppError(404, 'Distribution order not found');
  }

  if (['Pending', 'Assigned'].includes(order.status)) {
    await Resource.findByIdAndUpdate(order.resource, { $inc: { quantity: order.quantity } });
    await InventoryTransaction.create({
      product: order.resource,
      type: 'ADD',
      quantity: order.quantity,
      user: order.createdBy,
      reason: `Distribution order ${order._id} cancelled`
    });
  }

  return order;
};
