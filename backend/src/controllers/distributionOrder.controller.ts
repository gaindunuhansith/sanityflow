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
    const isDriver = req.user.role === 'driver';

    const filters: {
      status?: string;
      driver?: string;
      beneficiary?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {};

    if (status) filters.status = String(status);
    if (isDriver) filters.driver = req.user.userId;
    else if (driver) filters.driver = String(driver);
    if (beneficiary) filters.beneficiary = String(beneficiary);
    if (search) filters.search = String(search);
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);

    const orders = await distributionOrderService.getAllDistributionOrders(filters);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getDistributionOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await distributionOrderService.getDistributionOrderById(req.params.id as string, req.user);
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
    const order = await distributionOrderService.updateDeliveryStatus(
      req.params.id as string,
      validatedData.status,
      req.user.userId,
    );
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
