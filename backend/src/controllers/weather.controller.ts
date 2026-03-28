import type { Request, Response, NextFunction } from 'express';
import { fetchWeatherForLocation } from '../services/weather.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getWeatherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location } = req.params;
    if (!location || typeof location !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Location parameter is required and must be a string' });
    }

    const weather = await fetchWeatherForLocation(location);
    if (!weather) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Weather data not found for the specified location' });
    }

    res.status(HTTP_STATUS.OK).json(weather);
  } catch (error) {
    next(error);
  }
};