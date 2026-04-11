import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  createDriverController,
  getAllDriversController,
  getDriverByIdController,
  updateDriverController,
  deleteDriverController,
} from '../driver.controller.js';
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} from '../../services/driver.service.js';
import {
  createDriverSchema,
  updateDriverSchema,
} from '../../validations/driver.schemas.js';

jest.mock('../../services/driver.service.js', () => ({
  createDriver: jest.fn(),
  getAllDrivers: jest.fn(),
  getDriverById: jest.fn(),
  updateDriver: jest.fn(),
  deleteDriver: jest.fn(),
}));

jest.mock('../../validations/driver.schemas.js', () => ({
  createDriverSchema: { parse: jest.fn() },
  updateDriverSchema: { parse: jest.fn() },
}));

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

describe('driver.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createDriverController should return 201 with new driver', async () => {
    const req = { body: { name: 'John Doe' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Pass1234!',
      contact: '0712345678',
      vehicleInfo: 'Toyota Hiace',
      assignedArea: 'Colombo',
      availability: 'Active' as const,
    };
    const created = { _id: 'drv1', ...parsedBody };

    (createDriverSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (createDriver as jest.MockedFunction<typeof createDriver>).mockResolvedValue(created as any);

    await createDriverController(req, res as any, next);

    expect(createDriverSchema.parse).toHaveBeenCalledWith(req.body);
    expect(createDriver).toHaveBeenCalledWith(parsedBody);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('getAllDriversController should return 200 with all drivers', async () => {
    const req = { query: {} } as any;
    const res = createMockRes();
    const next = jest.fn();
    const drivers = [{ _id: 'drv1', name: 'John Doe' }];

    (getAllDrivers as jest.MockedFunction<typeof getAllDrivers>).mockResolvedValue(drivers as any);

    await getAllDriversController(req, res as any, next);

    expect(getAllDrivers).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(drivers);
  });

  it('getAllDriversController should pass availability filter', async () => {
    const req = { query: { availability: 'Active' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const drivers = [{ _id: 'drv1', availability: 'Active' }];

    (getAllDrivers as jest.MockedFunction<typeof getAllDrivers>).mockResolvedValue(drivers as any);

    await getAllDriversController(req, res as any, next);

    expect(getAllDrivers).toHaveBeenCalledWith({ availability: 'Active' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(drivers);
  });

  it('getDriverByIdController should return 200 with a single driver', async () => {
    const req = { params: { id: 'drv1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const driver = { _id: 'drv1', name: 'John Doe' };

    (getDriverById as jest.MockedFunction<typeof getDriverById>).mockResolvedValue(driver as any);

    await getDriverByIdController(req, res as any, next);

    expect(getDriverById).toHaveBeenCalledWith('drv1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(driver);
  });

  it('updateDriverController should return 200 with updated driver', async () => {
    const req = { params: { id: 'drv1' }, body: { assignedArea: 'Kandy' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { assignedArea: 'Kandy', availability: undefined };
    const updated = { _id: 'drv1', assignedArea: 'Kandy' };

    (updateDriverSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (updateDriver as jest.MockedFunction<typeof updateDriver>).mockResolvedValue(updated as any);

    await updateDriverController(req, res as any, next);

    expect(updateDriverSchema.parse).toHaveBeenCalledWith(req.body);
    // undefined values are stripped by Object.fromEntries
    expect(updateDriver).toHaveBeenCalledWith('drv1', { assignedArea: 'Kandy' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('deleteDriverController should return 200 with deleted message', async () => {
    const req = { params: { id: 'drv1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const deleted = { _id: 'drv1', name: 'John Doe' };

    (deleteDriver as jest.MockedFunction<typeof deleteDriver>).mockResolvedValue(deleted as any);

    await deleteDriverController(req, res as any, next);

    expect(deleteDriver).toHaveBeenCalledWith('drv1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Driver deleted', driver: deleted });
  });

  it('should call next(error) when service throws in createDriverController', async () => {
    const req = { body: {} } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Database failed');

    (createDriverSchema.parse as jest.Mock).mockReturnValue({});
    (createDriver as jest.MockedFunction<typeof createDriver>).mockRejectedValue(error);

    await createDriverController(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next(error) when service throws in getAllDriversController', async () => {
    const req = { query: {} } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Database failed');

    (getAllDrivers as jest.MockedFunction<typeof getAllDrivers>).mockRejectedValue(error);

    await getAllDriversController(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
