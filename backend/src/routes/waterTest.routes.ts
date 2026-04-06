import express from 'express';
import { 
  createWaterTestController, 
  getWaterTestsController,
  getWaterTestAnalyticsController,
  getWaterTestByIdController,
  updateWaterTestController, 
  deleteWaterTestController 
} from '../controllers/waterTest.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getWaterTestsController);
router.get('/analytics', auth, getWaterTestAnalyticsController);
router.get('/:id', auth, getWaterTestByIdController);
router.post('/', auth, createWaterTestController);
router.put('/:id', auth, updateWaterTestController);
router.delete('/:id', auth, deleteWaterTestController);

export default router;