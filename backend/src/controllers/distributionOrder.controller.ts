import type { Request, Response, NextFunction } from 'express';
import * as distributionOrderService from '../services/distributionOrder.service.js';
import { createDistributionOrderSchema, updateDistributionOrderSchema, updateDeliveryStatusSchema } from '../validations/distributionOrder.schemas.js';
import { HTTP_STATUS } from '../constants/index.js';

export const createDistributionOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createDistributionOrderSchema.parse(req.body);
    const order = await distributionOrderService.createDistributionOrder({
      ...validatedData,
      createdBy: req.user.userId,
    });
    res.status(HTTP_STATUS.CREATED).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllDistributionOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, driver, beneficiary, search, page, limit } = req.query;
    const orders = await distributionOrderService.getAllDistributionOrders({
      ...(status ? { status: String(status) } : {}),
      ...(driver ? { driver: String(driver) } : {}),
      ...(beneficiary ? { beneficiary: String(beneficiary) } : {}),
      ...(search ? { search: String(search) } : {}),
      ...(page ? { page: Number(page) } : {}),
      ...(limit ? { limit: Number(limit) } : {}),
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getDistributionOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await distributionOrderService.getDistributionOrderById(req.params.id as string);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateDistributionOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateDistributionOrderSchema.parse(req.body);
    const order = await distributionOrderService.updateDistributionOrder(req.params.id as string, validatedData);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateDeliveryStatusSchema.parse(req.body);
    const order = await distributionOrderService.updateDeliveryStatus(req.params.id as string, validatedData.status);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteDistributionOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await distributionOrderService.deleteDistributionOrder(req.params.id as string);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
