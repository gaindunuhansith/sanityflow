import express from 'express';
import auth, { requireRole } from '../middleware/auth.js';
import {
  createDriverController,
  getAllDriversController,
  getDriverByIdController,
  updateDriverController,
  deleteDriverController
} from '../controllers/driver.controller.js';

const router = express.Router();

router.post('/', auth, requireRole('admin'), createDriverController);
router.get('/', auth, requireRole('admin'), getAllDriversController);
router.get('/:id', auth, requireRole('admin'), getDriverByIdController);
router.put('/:id', auth, requireRole('admin'), updateDriverController);
router.delete('/:id', auth, requireRole('admin'), deleteDriverController);

export default router;
