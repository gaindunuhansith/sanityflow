import express from 'express';
import {
  createWaterSourceController,
  getAllWaterSourcesController,
  getWaterSourceByIdController,
  updateWaterSourceController,
  deleteWaterSourceController
} from '../controllers/waterSource.controller.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllWaterSourcesController);
router.get('/:id', auth, getWaterSourceByIdController);
router.post('/', auth, requireRole('admin'), createWaterSourceController);
router.put('/:id', auth, requireRole('admin'), updateWaterSourceController);
router.delete('/:id', auth, requireRole('admin'), deleteWaterSourceController);

export default router;
