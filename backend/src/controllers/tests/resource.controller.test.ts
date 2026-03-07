import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} from '../resource.controller.js';
import * as resourceService from '../../services/resource.service.js';

jest.mock('../../services/resource.service.js', () => ({
  createResource: jest.fn(),
  getAllResources: jest.fn(),
  getResourceById: jest.fn(),
  updateResource: jest.fn(),
  deleteResource: jest.fn(),
}));

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

describe('resource.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createResource should return 201 with new resource', async () => {
    const req = { body: { name: 'Water Pump', quantity: 10 } } as any;
    const res = createMockRes();
    const created = { _id: 'res1', name: 'Water Pump', quantity: 10 };

    (resourceService.createResource as jest.MockedFunction<typeof resourceService.createResource>).mockResolvedValue(created as any);

    await createResource(req, res as any);

    expect(resourceService.createResource).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createResource should return 500 when service throws', async () => {
    const req = { body: {} } as any;
    const res = createMockRes();

    (resourceService.createResource as jest.MockedFunction<typeof resourceService.createResource>).mockRejectedValue(new Error('DB error'));

    await createResource(req, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create resource' });
  });

  it('getAllResources should return 200 with all resources', async () => {
    const req = {} as any;
    const res = createMockRes();
    const resources = [{ _id: 'res1', name: 'Water Pump' }];

    (resourceService.getAllResources as jest.MockedFunction<typeof resourceService.getAllResources>).mockResolvedValue(resources as any);

    await getAllResources(req, res as any);

    expect(resourceService.getAllResources).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resources);
  });

  it('getResourceById should return 400 when id is missing', async () => {
    const req = { params: { id: '' } } as any;
    const res = createMockRes();

    await getResourceById(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('getResourceById should return 404 when resource not found', async () => {
    const req = { params: { id: 'res999' } } as any;
    const res = createMockRes();

    (resourceService.getResourceById as jest.MockedFunction<typeof resourceService.getResourceById>).mockResolvedValue(null as any);

    await getResourceById(req, res as any);

    expect(resourceService.getResourceById).toHaveBeenCalledWith('res999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });

  it('getResourceById should return 200 with the resource', async () => {
    const req = { params: { id: 'res1' } } as any;
    const res = createMockRes();
    const resource = { _id: 'res1', name: 'Water Pump' };

    (resourceService.getResourceById as jest.MockedFunction<typeof resourceService.getResourceById>).mockResolvedValue(resource as any);

    await getResourceById(req, res as any);

    expect(resourceService.getResourceById).toHaveBeenCalledWith('res1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resource);
  });

  it('updateResource should return 400 when id is missing', async () => {
    const req = { params: { id: '' }, body: {} } as any;
    const res = createMockRes();

    await updateResource(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('updateResource should return 404 when resource not found', async () => {
    const req = { params: { id: 'res999' }, body: { quantity: 5 } } as any;
    const res = createMockRes();

    (resourceService.updateResource as jest.MockedFunction<typeof resourceService.updateResource>).mockResolvedValue(null as any);

    await updateResource(req, res as any);

    expect(resourceService.updateResource).toHaveBeenCalledWith('res999', req.body);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });

  it('updateResource should return 200 with updated resource', async () => {
    const req = { params: { id: 'res1' }, body: { quantity: 20 } } as any;
    const res = createMockRes();
    const updated = { _id: 'res1', quantity: 20 };

    (resourceService.updateResource as jest.MockedFunction<typeof resourceService.updateResource>).mockResolvedValue(updated as any);

    await updateResource(req, res as any);

    expect(resourceService.updateResource).toHaveBeenCalledWith('res1', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('deleteResource should return 400 when id is missing', async () => {
    const req = { params: { id: '' } } as any;
    const res = createMockRes();

    await deleteResource(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid resource ID' });
  });

  it('deleteResource should return 404 when resource not found', async () => {
    const req = { params: { id: 'res999' } } as any;
    const res = createMockRes();

    (resourceService.deleteResource as jest.MockedFunction<typeof resourceService.deleteResource>).mockResolvedValue(null as any);

    await deleteResource(req, res as any);

    expect(resourceService.deleteResource).toHaveBeenCalledWith('res999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });

  it('deleteResource should return 204 on successful deletion', async () => {
    const req = { params: { id: 'res1' } } as any;
    const res = createMockRes();
    const deleted = { _id: 'res1', name: 'Water Pump' };

    (resourceService.deleteResource as jest.MockedFunction<typeof resourceService.deleteResource>).mockResolvedValue(deleted as any);

    await deleteResource(req, res as any);

    expect(resourceService.deleteResource).toHaveBeenCalledWith('res1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
