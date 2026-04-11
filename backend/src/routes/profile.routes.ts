import express from 'express';
import auth from '../middleware/auth.js';
import { getMe, updateMe } from '../controllers/profile.controller.js';
import { validateUpdateProfile } from '../validations/profile.schema.js';

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, validateUpdateProfile, updateMe);

export default router;
