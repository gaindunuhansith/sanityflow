import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from '../inventoryTransaction.controller.js';
import * as service from '../../services/inventoryTransaction.service.js';

jest.mock('../../services/inventoryTransaction.service.js', () => ({
  createTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getTransactionById: jest.fn(),
}));

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

describe('inventoryTransaction.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createTransaction should return 201 with new transaction', async () => {
    const req = {
      body: { resourceId: 'res1', quantity: 5, type: 'IN' },
      user: { userId: 'user1' },
    } as any;
    const res = createMockRes();
    const created = { _id: 'txn1', resourceId: 'res1', quantity: 5, type: 'IN', user: 'user1' };

    (service.createTransaction as jest.MockedFunction<typeof service.createTransaction>).mockResolvedValue(created as any);

    await createTransaction(req, res as any);

    expect(service.createTransaction).toHaveBeenCalledWith({
      ...req.body,
      user: 'user1',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createTransaction should return 400 when service throws', async () => {
    const req = {
      body: { resourceId: 'res1', quantity: -1, type: 'IN' },
      user: { userId: 'user1' },
    } as any;
    const res = createMockRes();
    const error = new Error('Invalid quantity');

    (service.createTransaction as jest.MockedFunction<typeof service.createTransaction>).mockRejectedValue(error);

    await createTransaction(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid quantity' });
  });

  it('getAllTransactions should return 200 with all transactions', async () => {
    const req = {} as any;
    const res = createMockRes();
    const transactions = [{ _id: 'txn1', type: 'IN' }, { _id: 'txn2', type: 'OUT' }];

    (service.getAllTransactions as jest.MockedFunction<typeof service.getAllTransactions>).mockResolvedValue(transactions as any);

    await getAllTransactions(req, res as any);

    expect(service.getAllTransactions).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(transactions);
  });

  it('getTransactionById should return 400 when id is missing', async () => {
    const req = { params: { id: '' } } as any;
    const res = createMockRes();

    await getTransactionById(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('getTransactionById should return 404 when transaction not found', async () => {
    const req = { params: { id: 'txn999' } } as any;
    const res = createMockRes();

    (service.getTransactionById as jest.MockedFunction<typeof service.getTransactionById>).mockResolvedValue(null as any);

    await getTransactionById(req, res as any);

    expect(service.getTransactionById).toHaveBeenCalledWith('txn999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Transaction not found' });
  });

  it('getTransactionById should return 200 with the transaction', async () => {
    const req = { params: { id: 'txn1' } } as any;
    const res = createMockRes();
    const transaction = { _id: 'txn1', type: 'IN', quantity: 5 };

    (service.getTransactionById as jest.MockedFunction<typeof service.getTransactionById>).mockResolvedValue(transaction as any);

    await getTransactionById(req, res as any);

    expect(service.getTransactionById).toHaveBeenCalledWith('txn1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(transaction);
  });
});
