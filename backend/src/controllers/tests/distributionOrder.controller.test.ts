import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  createDistributionOrder,
  getAllDistributionOrders,
  getDistributionOrderById,
  updateDistributionOrder,
  updateDeliveryStatus,
  deleteDistributionOrder,
} from '../distributionOrder.controller.js';
import * as distributionOrderService from '../../services/distributionOrder.service.js';
import {
  createDistributionOrderSchema,
  updateDistributionOrderSchema,
  updateDeliveryStatusSchema,
} from '../../validations/distributionOrder.schemas.js';

jest.mock('../../services/distributionOrder.service.js', () => ({
  createDistributionOrder: jest.fn(),
  getAllDistributionOrders: jest.fn(),
  getDistributionOrderById: jest.fn(),
  updateDistributionOrder: jest.fn(),
  updateDeliveryStatus: jest.fn(),
  deleteDistributionOrder: jest.fn(),
}));

jest.mock('../../validations/distributionOrder.schemas.js', () => ({
  createDistributionOrderSchema: { parse: jest.fn() },
  updateDistributionOrderSchema: { parse: jest.fn() },
  updateDeliveryStatusSchema: { parse: jest.fn() },
}));

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

describe('distributionOrder.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createDistributionOrder should return 201 with the new order', async () => {
    const req = {
      body: { resource: 'res1', quantity: 10, targetLocation: 'Galle' },
      user: { userId: 'user1' },
    } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { resource: 'res1', quantity: 10, targetLocation: 'Galle' };
    const created = { _id: 'ord1', ...parsedBody, createdBy: 'user1' };

    (createDistributionOrderSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (distributionOrderService.createDistributionOrder as jest.MockedFunction<typeof distributionOrderService.createDistributionOrder>)
      .mockResolvedValue(created as any);

    await createDistributionOrder(req, res as any, next);

    expect(createDistributionOrderSchema.parse).toHaveBeenCalledWith(req.body);
    expect(distributionOrderService.createDistributionOrder).toHaveBeenCalledWith({
      ...parsedBody,
      createdBy: 'user1',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('getAllDistributionOrders should return 200 with all orders', async () => {
    const req = { query: {}, user: { role: 'admin' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const orders = [{ _id: 'ord1' }, { _id: 'ord2' }];

    (distributionOrderService.getAllDistributionOrders as jest.MockedFunction<typeof distributionOrderService.getAllDistributionOrders>)
      .mockResolvedValue(orders as any);

    await getAllDistributionOrders(req, res as any, next);

    expect(distributionOrderService.getAllDistributionOrders).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  it('getAllDistributionOrders should pass status and driver filters', async () => {
    const req = { query: { status: 'Assigned', driver: 'drv1' }, user: { role: 'admin' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const orders = [{ _id: 'ord1', status: 'Assigned' }];

    (distributionOrderService.getAllDistributionOrders as jest.MockedFunction<typeof distributionOrderService.getAllDistributionOrders>)
      .mockResolvedValue(orders as any);

    await getAllDistributionOrders(req, res as any, next);

    expect(distributionOrderService.getAllDistributionOrders).toHaveBeenCalledWith({
      status: 'Assigned',
      driver: 'drv1',
    });
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  it('getDistributionOrderById should return 200 with a single order', async () => {
    const req = { params: { id: 'ord1' }, user: { role: 'admin' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const order = { _id: 'ord1' };

    (distributionOrderService.getDistributionOrderById as jest.MockedFunction<typeof distributionOrderService.getDistributionOrderById>)
      .mockResolvedValue(order as any);

    await getDistributionOrderById(req, res as any, next);

    expect(distributionOrderService.getDistributionOrderById).toHaveBeenCalledWith('ord1', { role: 'admin' });
    expect(res.json).toHaveBeenCalledWith(order);
  });

  it('updateDistributionOrder should return 200 with updated order', async () => {
    const req = { params: { id: 'ord1' }, body: { driver: 'drv1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { driver: 'drv1' };
    const updated = { _id: 'ord1', driver: 'drv1', status: 'Assigned' };

    (updateDistributionOrderSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (distributionOrderService.updateDistributionOrder as jest.MockedFunction<typeof distributionOrderService.updateDistributionOrder>)
      .mockResolvedValue(updated as any);

    await updateDistributionOrder(req, res as any, next);

    expect(updateDistributionOrderSchema.parse).toHaveBeenCalledWith(req.body);
    expect(distributionOrderService.updateDistributionOrder).toHaveBeenCalledWith('ord1', parsedBody);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('updateDeliveryStatus should return 200 with updated status', async () => {
    const req = { params: { id: 'ord1' }, body: { status: 'In Transit' }, user: { userId: 'uid1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { status: 'In Transit' };
    const updated = { _id: 'ord1', status: 'In Transit' };

    (updateDeliveryStatusSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (distributionOrderService.updateDeliveryStatus as jest.MockedFunction<typeof distributionOrderService.updateDeliveryStatus>)
      .mockResolvedValue(updated as any);

    await updateDeliveryStatus(req, res as any, next);

    expect(updateDeliveryStatusSchema.parse).toHaveBeenCalledWith(req.body);
    expect(distributionOrderService.updateDeliveryStatus).toHaveBeenCalledWith('ord1', 'In Transit', 'uid1');
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('deleteDistributionOrder should return 204', async () => {
    const req = { params: { id: 'ord1' } } as any;
    const res = createMockRes();
    const next = jest.fn();

    (distributionOrderService.deleteDistributionOrder as jest.MockedFunction<typeof distributionOrderService.deleteDistributionOrder>)
      .mockResolvedValue(undefined as any);

    await deleteDistributionOrder(req, res as any, next);

    expect(distributionOrderService.deleteDistributionOrder).toHaveBeenCalledWith('ord1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should call next(error) when service throws in createDistributionOrder', async () => {
    const req = {
      body: {},
      user: { userId: 'user1' },
    } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Database failed');

    (createDistributionOrderSchema.parse as jest.Mock).mockReturnValue({});
    (distributionOrderService.createDistributionOrder as jest.MockedFunction<typeof distributionOrderService.createDistributionOrder>)
      .mockRejectedValue(error);

    await createDistributionOrder(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next(error) when service throws in getAllDistributionOrders', async () => {
    const req = { query: {}, user: { role: 'admin' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Database failed');

    (distributionOrderService.getAllDistributionOrders as jest.MockedFunction<typeof distributionOrderService.getAllDistributionOrders>)
      .mockRejectedValue(error);

    await getAllDistributionOrders(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
