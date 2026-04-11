import express from 'express';
import { register, login, createAdmin } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../validations/auth.schema.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/create-admin', auth, requireRole('admin'), validateRegister, createAdmin);

export default router;
