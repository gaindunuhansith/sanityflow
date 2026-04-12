import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  getAllThreadsHandler,
  getThreadByIdHandler,
  createThreadHandler,
  updateThreadHandler,
  deleteThreadHandler,
  getRepliesHandler,
  createReplyHandler,
  deleteReplyHandler,
} from '../forum.controller.js';
import {
  getAllThreadsService,
  getThreadByIdService,
  createThreadService,
  updateThreadService,
  deleteThreadService,
  getRepliesService,
  createReplyService,
  deleteReplyService,
} from '../../services/forum.service.js';
import {
  getThreadsQuerySchema,
  threadIdParamSchema,
  replyParamSchema,
  createThreadSchema,
  updateThreadSchema,
  createReplySchema,
} from '../../validations/forum.schemas.js';
import Logger from '../../utils/logger.js';

jest.mock('../../services/forum.service.js', () => ({
  getAllThreadsService: jest.fn(),
  getThreadByIdService: jest.fn(),
  createThreadService: jest.fn(),
  updateThreadService: jest.fn(),
  deleteThreadService: jest.fn(),
  getRepliesService: jest.fn(),
  createReplyService: jest.fn(),
  deleteReplyService: jest.fn(),
}));

jest.mock('../../validations/forum.schemas.js', () => ({
  getThreadsQuerySchema: { parse: jest.fn() },
  threadIdParamSchema: { parse: jest.fn() },
  replyParamSchema: { parse: jest.fn() },
  createThreadSchema: { parse: jest.fn() },
  updateThreadSchema: { parse: jest.fn() },
  createReplySchema: { parse: jest.fn() },
}));

jest.mock('../../utils/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
  },
}));

const createMockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  return res;
};

describe('forum.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllThreadsHandler should return 200 with threads', async () => {
    const req = { query: { page: '1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedQuery = { page: 1, limit: 10 };
    const result = { data: [{ id: 't1' }] };

    (getThreadsQuerySchema.parse as jest.Mock).mockReturnValue(parsedQuery);
    (getAllThreadsService as jest.MockedFunction<typeof getAllThreadsService>).mockResolvedValue(result as any);

    await getAllThreadsHandler(req, res as any, next);

    expect(getAllThreadsService).toHaveBeenCalledWith(parsedQuery);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('getThreadByIdHandler should return 200 with thread', async () => {
    const req = { params: { id: 'raw-id' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const thread = { id: 't1', title: 'Thread' };

    (threadIdParamSchema.parse as jest.Mock).mockReturnValue({ id: 't1' });
    (getThreadByIdService as jest.MockedFunction<typeof getThreadByIdService>).mockResolvedValue(thread as any);

    await getThreadByIdHandler(req, res as any, next);

    expect(getThreadByIdService).toHaveBeenCalledWith('t1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(thread);
  });

  it('createThreadHandler should return 201 with created thread', async () => {
    const req = { body: { title: 'Help' }, user: { userId: 'u1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { title: 'Help', content: 'Need assistance', tags: ['support'], status: 'Open' };
    const createdThread = { _id: 't2', ...parsedBody };

    (createThreadSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (createThreadService as jest.MockedFunction<typeof createThreadService>).mockResolvedValue(createdThread as any);

    await createThreadHandler(req, res as any, next);

    expect(createThreadService).toHaveBeenCalledWith(parsedBody as any, 'u1');
    expect(Logger.info).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdThread);
  });

  it('updateThreadHandler should return 200 with updated thread', async () => {
    const req = { params: { id: 'raw-id' }, body: { title: 'Updated' }, user: { userId: 'u1', role: 'member' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { title: 'Updated' };
    const updatedThread = { _id: 't2', title: 'Updated' };

    (threadIdParamSchema.parse as jest.Mock).mockReturnValue({ id: 't2' });
    (updateThreadSchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (updateThreadService as jest.MockedFunction<typeof updateThreadService>).mockResolvedValue(updatedThread as any);

    await updateThreadHandler(req, res as any, next);

    expect(updateThreadService).toHaveBeenCalledWith('t2', parsedBody, 'u1', 'member');
    expect(Logger.info).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedThread);
  });

  it('deleteThreadHandler should return 204', async () => {
    const req = { params: { id: 'raw-id' }, user: { userId: 'u1', role: 'member' } } as any;
    const res = createMockRes();
    const next = jest.fn();

    (threadIdParamSchema.parse as jest.Mock).mockReturnValue({ id: 't3' });
    (deleteThreadService as jest.MockedFunction<typeof deleteThreadService>).mockResolvedValue(undefined as any);

    await deleteThreadHandler(req, res as any, next);

    expect(deleteThreadService).toHaveBeenCalledWith('t3', 'u1', 'member');
    expect(Logger.info).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('getRepliesHandler should return 200 with replies', async () => {
    const req = { params: { id: 'raw-id' }, query: { page: '2', limit: '5' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const result = { data: [{ id: 'r1' }] };

    (threadIdParamSchema.parse as jest.Mock).mockReturnValue({ id: 't4' });
    (getRepliesService as jest.MockedFunction<typeof getRepliesService>).mockResolvedValue(result as any);

    await getRepliesHandler(req, res as any, next);

    expect(getRepliesService).toHaveBeenCalledWith('t4', 2, 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('createReplyHandler should return 201 with created reply', async () => {
    const req = { params: { id: 'raw-id' }, body: { content: 'Reply' }, user: { userId: 'u1' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const parsedBody = { content: 'Reply' };
    const reply = { _id: 'r1', content: 'Reply' };

    (threadIdParamSchema.parse as jest.Mock).mockReturnValue({ id: 't5' });
    (createReplySchema.parse as jest.Mock).mockReturnValue(parsedBody);
    (createReplyService as jest.MockedFunction<typeof createReplyService>).mockResolvedValue(reply as any);

    await createReplyHandler(req, res as any, next);

    expect(createReplyService).toHaveBeenCalledWith('t5', parsedBody, 'u1');
    expect(Logger.info).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(reply);
  });

  it('deleteReplyHandler should return 204', async () => {
    const req = { params: { id: 'raw-id', replyId: 'raw-reply' }, user: { userId: 'u1', role: 'member' } } as any;
    const res = createMockRes();
    const next = jest.fn();

    (replyParamSchema.parse as jest.Mock).mockReturnValue({ id: 't6', replyId: 'r2' });
    (deleteReplyService as jest.MockedFunction<typeof deleteReplyService>).mockResolvedValue(undefined as any);

    await deleteReplyHandler(req, res as any, next);

    expect(deleteReplyService).toHaveBeenCalledWith('t6', 'r2', 'u1', 'member');
    expect(Logger.info).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should call next(error) when service throws in getAllThreadsHandler', async () => {
    const req = { query: {} } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Service failed');

    (getThreadsQuerySchema.parse as jest.Mock).mockReturnValue({});
    (getAllThreadsService as jest.MockedFunction<typeof getAllThreadsService>).mockRejectedValue(error);

    await getAllThreadsHandler(req, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
