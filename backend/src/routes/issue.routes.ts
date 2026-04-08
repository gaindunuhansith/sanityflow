import express from 'express';
import {
  createIssueController,
  getIssuesController,
  getIssueByIdController,
  updateIssueController,
  deleteIssueController
} from '../controllers/issue.controller.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getIssuesController);
router.get('/:id', auth, getIssueByIdController);
router.post('/', auth, requireRole('admin'), createIssueController);
router.put('/:id', auth, requireRole('admin'), updateIssueController);
router.delete('/:id', auth, requireRole('admin'), deleteIssueController);

export default router;