import express from 'express';
import { 
  createWaterTestController, 
  getWaterTestsController,
  getWaterTestAnalyticsController,
  getWaterTestByIdController,
  updateWaterTestController, 
  deleteWaterTestController 
} from '../controllers/waterTest.controller.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getWaterTestsController);
router.get('/analytics', auth, getWaterTestAnalyticsController);
router.get('/:id', auth, getWaterTestByIdController);
router.post('/', auth, requireRole('admin'), createWaterTestController);
router.put('/:id', auth, requireRole('admin'), updateWaterTestController);
router.delete('/:id', auth, requireRole('admin'), deleteWaterTestController);

export default router;