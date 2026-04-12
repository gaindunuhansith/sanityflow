import { Router } from 'express';
import auth, { requireRole } from '../middleware/auth.js';

import {
  getAllThreadsHandler,
  getThreadByIdHandler,
  createThreadHandler,
  updateThreadHandler,
  deleteThreadHandler,
  getRepliesHandler,
  createReplyHandler,
  deleteReplyHandler,
} from '../controllers/forum.controller.js';

const forumRouter = Router();

forumRouter.get('/', getAllThreadsHandler);
forumRouter.get('/:id', getThreadByIdHandler);
forumRouter.post('/', auth, createThreadHandler);
forumRouter.patch('/:id', auth, updateThreadHandler);
forumRouter.delete('/:id', auth, deleteThreadHandler);

forumRouter.get('/:id/replies', getRepliesHandler);
forumRouter.post('/:id/replies', auth, createReplyHandler);
forumRouter.delete('/:id/replies/:replyId', auth, deleteReplyHandler);

export default forumRouter;
