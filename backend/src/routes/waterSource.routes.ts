import express from 'express';
import {
  createWaterSourceController,
  getAllWaterSourcesController,
  getWaterSourceByIdController,
  updateWaterSourceController,
  deleteWaterSourceController
} from '../controllers/waterSource.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllWaterSourcesController);
router.get('/:id', auth, getWaterSourceByIdController);
router.post('/', auth, createWaterSourceController);
router.put('/:id', auth, updateWaterSourceController);
router.delete('/:id', auth, deleteWaterSourceController);

export default router;
