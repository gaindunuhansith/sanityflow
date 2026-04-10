import express from 'express';
import auth, { requireRole } from '../middleware/auth.js';
import {
  createBeneficiaryController,
  getAllBeneficiariesController,
  getBeneficiaryByIdController,
  updateBeneficiaryController,
  deleteBeneficiaryController
} from '../controllers/beneficiary.controller.js';

const router = express.Router();

router.post('/', auth, requireRole('admin'), createBeneficiaryController);
router.get('/', auth, requireRole('admin'), getAllBeneficiariesController);
router.get('/:id', auth, requireRole('admin'), getBeneficiaryByIdController);
router.put('/:id', auth, requireRole('admin'), updateBeneficiaryController);
router.delete('/:id', auth, requireRole('admin'), deleteBeneficiaryController);

export default router;
