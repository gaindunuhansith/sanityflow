import type { Request, Response, NextFunction } from 'express';
import { createDriverSchema, updateDriverSchema } from '../validations/driver.schemas.js';
import { createDriver, getAllDrivers, getDriverById, updateDriver, deleteDriver } from '../services/driver.service.js';
import type { IDriver } from '../models/Driver.js';

export const createDriverController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createDriverSchema.parse(req.body);
    const driver = await createDriver(data);
    res.status(201).json(driver);
  } catch (error) {
    next(error);
  }
};

export const getAllDriversController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { availability, search, page, limit } = req.query;
    const drivers = await getAllDrivers(
      {
        ...(availability ? { availability: availability as 'Active' | 'Inactive' } : {}),
        ...(search ? { search: String(search) } : {}),
        ...(page ? { page: Number(page) } : {}),
        ...(limit ? { limit: Number(limit) } : {}),
      }
    );
    res.status(200).json(drivers);
  } catch (error) {
    next(error);
  }
};

export const getDriverByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const driver = await getDriverById(req.params['id'] as string);
    res.status(200).json(driver);
  } catch (error) {
    next(error);
  }
};

export const updateDriverController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateDriverSchema.parse(req.body);
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Partial<IDriver>;
    const driver = await updateDriver(req.params['id'] as string, cleanData);
    res.status(200).json(driver);
  } catch (error) {
    next(error);
  }
};

export const deleteDriverController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const driver = await deleteDriver(req.params['id'] as string);
    res.status(200).json({ message: 'Driver deleted', driver });
  } catch (error) {
    next(error);
  }
};
