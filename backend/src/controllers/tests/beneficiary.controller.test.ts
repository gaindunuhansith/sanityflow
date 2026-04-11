import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  createBeneficiaryController,
  getAllBeneficiariesController,
  getBeneficiaryByIdController,
  updateBeneficiaryController,
  deleteBeneficiaryController,
} from '../beneficiary.controller.js';
import {
  createBeneficiary,
  getAllBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
} from '../../services/beneficiary.service.js';
import {
  createBeneficiarySchema,
  updateBeneficiarySchema,
} from '../../validations/beneficiary.schemas.js';

jest.mock('../../services/beneficiary.service.js', () => ({
  createBeneficiary: jest.fn(),
  getAllBeneficiaries: jest.fn(),
  getBeneficiaryById: jest.fn(),
  updateBeneficiary: jest.fn(),
  deleteBeneficiary: jest.fn(),
}));

jest.mock('../../validations/beneficiary.schemas.js', () => ({
  createBeneficiarySchema: { parse: jest.fn() },
  updateBeneficiarySchema: { parse: jest.fn() },
}));

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

describe('beneficiary.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createBeneficiaryController should return 201 with new beneficiary', async () => {
    const req = { body: { name: 'Alice' }, user: { userId: 'admin1', role: 'admin' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { name: 'Alice', location: 'Colombo', familySize: 3, contact: '0711111111', eligibilityStatus: 'Active' as const };
    const created = { _id: 'b1', ...parsedBody, submittedBy: 'admin1' };

    (createBeneficiarySchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (createBeneficiary as jest.MockedFunction<typeof createBeneficiary>).mockResolvedValue(created as any);

    await createBeneficiaryController(req, res as any, next);

    expect(createBeneficiarySchema.parse).toHaveBeenCalledWith(req.body);
    expect(createBeneficiary).toHaveBeenCalledWith({ ...parsedBody, submittedBy: 'admin1' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createBeneficiaryController should force Pending status for member submissions', async () => {
    const req = { body: { name: 'Alice' }, user: { userId: 'member1', role: 'member' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { name: 'Alice', location: 'Colombo', familySize: 3, contact: '0711111111', eligibilityStatus: 'Active' as const };
    const created = { _id: 'b1', ...parsedBody, eligibilityStatus: 'Pending', submittedBy: 'member1' };

    (createBeneficiarySchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (createBeneficiary as jest.MockedFunction<typeof createBeneficiary>).mockResolvedValue(created as any);

    await createBeneficiaryController(req, res as any, next);

    expect(createBeneficiary).toHaveBeenCalledWith({
      ...parsedBody,
      eligibilityStatus: 'Pending',
      submittedBy: 'member1',
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('getAllBeneficiariesController should return 200 with all beneficiaries', async () => {
    const req = { query: {} } as any;
    const res = createMockRes();
    const next = jest.fn();
    const beneficiaries = [{ _id: 'b1', name: 'Alice' }];

    (getAllBeneficiaries as jest.MockedFunction<typeof getAllBeneficiaries>).mockResolvedValue(beneficiaries as any);

    await getAllBeneficiariesController(req, res as any, next);

    expect(getAllBeneficiaries).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(beneficiaries);
  });

  it('getAllBeneficiariesController should pass eligibilityStatus filter', async () => {
    const req = { query: { eligibilityStatus: 'Active' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const beneficiaries = [{ _id: 'b2', name: 'Bob' }];

    (getAllBeneficiaries as jest.MockedFunction<typeof getAllBeneficiaries>).mockResolvedValue(beneficiaries as any);

    await getAllBeneficiariesController(req, res as any, next);

    expect(getAllBeneficiaries).toHaveBeenCalledWith({ eligibilityStatus: 'Active' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(beneficiaries);
  });

  it('getBeneficiaryByIdController should return 200 with a single beneficiary', async () => {
    const req = { params: { id: 'b1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const beneficiary = { _id: 'b1', name: 'Alice' };

    (getBeneficiaryById as jest.MockedFunction<typeof getBeneficiaryById>).mockResolvedValue(beneficiary as any);

    await getBeneficiaryByIdController(req, res as any, next);

    expect(getBeneficiaryById).toHaveBeenCalledWith('b1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(beneficiary);
  });

  it('updateBeneficiaryController should return 200 with updated beneficiary', async () => {
    const req = { params: { id: 'b1' }, body: { name: 'Alice Updated' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { name: 'Alice Updated', location: undefined };
    const updated = { _id: 'b1', name: 'Alice Updated' };

    (updateBeneficiarySchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (updateBeneficiary as jest.MockedFunction<typeof updateBeneficiary>).mockResolvedValue(updated as any);

    await updateBeneficiaryController(req, res as any, next);

    expect(updateBeneficiarySchema.parse).toHaveBeenCalledWith(req.body);
    // undefined values are stripped by Object.fromEntries
    expect(updateBeneficiary).toHaveBeenCalledWith('b1', { name: 'Alice Updated' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('deleteBeneficiaryController should return 200 with deleted message', async () => {
    const req = { params: { id: 'b1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const deleted = { _id: 'b1', name: 'Alice' };

    (deleteBeneficiary as jest.MockedFunction<typeof deleteBeneficiary>).mockResolvedValue(deleted as any);

    await deleteBeneficiaryController(req, res as any, next);

    expect(deleteBeneficiary).toHaveBeenCalledWith('b1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Beneficiary deleted', beneficiary: deleted });
  });

  it('should call next(error) when service throws in createBeneficiaryController', async () => {
    const req = { body: {}, user: { userId: 'member1', role: 'member' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Database failed');

    (createBeneficiarySchema.parse as jest.Mock).mockReturnValue({});
    (createBeneficiary as jest.MockedFunction<typeof createBeneficiary>).mockRejectedValue(error);

    await createBeneficiaryController(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next(error) when service throws in getAllBeneficiariesController', async () => {
    const req = { query: {} } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Database failed');

    (getAllBeneficiaries as jest.MockedFunction<typeof getAllBeneficiaries>).mockRejectedValue(error);

    await getAllBeneficiariesController(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
