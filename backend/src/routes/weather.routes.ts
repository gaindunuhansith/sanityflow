import express from 'express';
import { getWeatherController } from '../controllers/weather.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:location', auth, getWeatherController);

export default router;