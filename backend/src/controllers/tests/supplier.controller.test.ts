import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from '../supplier.controller.js';
import * as supplierService from '../../services/supplier.service.js';

jest.mock('../../services/supplier.service.js', () => ({
  createSupplier: jest.fn(),
  getAllSuppliers: jest.fn(),
  getSupplierById: jest.fn(),
  updateSupplier: jest.fn(),
  deleteSupplier: jest.fn(),
}));

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

describe('supplier.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createSupplier should return 201 with new supplier', async () => {
    const req = { body: { name: 'AquaSupply', contact: '0712345678' } } as any;
    const res = createMockRes();
    const created = { _id: 'sup1', name: 'AquaSupply', contact: '0712345678' };

    (supplierService.createSupplier as jest.MockedFunction<typeof supplierService.createSupplier>).mockResolvedValue(created as any);

    await createSupplier(req, res as any);

    expect(supplierService.createSupplier).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('getAllSuppliers should return 200 with all suppliers', async () => {
    const req = {} as any;
    const res = createMockRes();
    const suppliers = [{ _id: 'sup1', name: 'AquaSupply' }];

    (supplierService.getAllSuppliers as jest.MockedFunction<typeof supplierService.getAllSuppliers>).mockResolvedValue(suppliers as any);

    await getAllSuppliers(req, res as any);

    expect(supplierService.getAllSuppliers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(suppliers);
  });

  it('getSupplierById should return 400 when id is missing', async () => {
    const req = { params: { id: '' } } as any;
    const res = createMockRes();

    await getSupplierById(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('getSupplierById should return 404 when supplier not found', async () => {
    const req = { params: { id: 'sup999' } } as any;
    const res = createMockRes();

    (supplierService.getSupplierById as jest.MockedFunction<typeof supplierService.getSupplierById>).mockResolvedValue(null as any);

    await getSupplierById(req, res as any);

    expect(supplierService.getSupplierById).toHaveBeenCalledWith('sup999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Supplier not found' });
  });

  it('getSupplierById should return 200 with the supplier', async () => {
    const req = { params: { id: 'sup1' } } as any;
    const res = createMockRes();
    const supplier = { _id: 'sup1', name: 'AquaSupply' };

    (supplierService.getSupplierById as jest.MockedFunction<typeof supplierService.getSupplierById>).mockResolvedValue(supplier as any);

    await getSupplierById(req, res as any);

    expect(supplierService.getSupplierById).toHaveBeenCalledWith('sup1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(supplier);
  });

  it('updateSupplier should return 400 when id is missing', async () => {
    const req = { params: { id: '' }, body: {} } as any;
    const res = createMockRes();

    await updateSupplier(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('updateSupplier should return 404 when supplier not found', async () => {
    const req = { params: { id: 'sup999' }, body: { contact: '0799999999' } } as any;
    const res = createMockRes();

    (supplierService.updateSupplier as jest.MockedFunction<typeof supplierService.updateSupplier>).mockResolvedValue(null as any);

    await updateSupplier(req, res as any);

    expect(supplierService.updateSupplier).toHaveBeenCalledWith('sup999', req.body);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Supplier not found' });
  });

  it('updateSupplier should return 200 with updated supplier', async () => {
    const req = { params: { id: 'sup1' }, body: { contact: '0799999999' } } as any;
    const res = createMockRes();
    const updated = { _id: 'sup1', contact: '0799999999' };

    (supplierService.updateSupplier as jest.MockedFunction<typeof supplierService.updateSupplier>).mockResolvedValue(updated as any);

    await updateSupplier(req, res as any);

    expect(supplierService.updateSupplier).toHaveBeenCalledWith('sup1', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('deleteSupplier should return 400 when id is missing', async () => {
    const req = { params: { id: '' } } as any;
    const res = createMockRes();

    await deleteSupplier(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('deleteSupplier should return 204 on successful deletion', async () => {
    const req = { params: { id: 'sup1' } } as any;
    const res = createMockRes();

    (supplierService.deleteSupplier as jest.MockedFunction<typeof supplierService.deleteSupplier>).mockResolvedValue(undefined as any);

    await deleteSupplier(req, res as any);

    expect(supplierService.deleteSupplier).toHaveBeenCalledWith('sup1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
