import axios from 'axios';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export interface WeatherData {
  condition: string;
  temp_c: number;
  humidity: number;
  rainfall_last_1h_mm: number;
  pressure: number;
  windSpeed: number;
  description: string;
  isHighRisk: boolean;
  riskReason?: string;
}

const HIGH_RISK_CONDITIONS = new Set(['Thunderstorm', 'Drizzle', 'Rain', 'Snow', 'Squall', 'Tornado']);

export const fetchWeatherForLocation = async (location: string): Promise<WeatherData | null> => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${env.OPENWEATHER_API_KEY}&units=metric`;
    const { data } = await axios.get(url, { timeout: 10000 });

    const condition: string = data.weather?.[0]?.main ?? 'Unknown';
    const temp_c: number = data.main?.temp ?? 0;
    const humidity: number = data.main?.humidity ?? 0;
    const pressure: number = data.main?.pressure ?? 0;
    const windSpeed: number = data.wind?.speed ?? 0;
    const description: string = data.weather?.[0]?.description ?? 'Unknown';
    const rainfall_last_1h_mm: number = data.rain?.['1h'] ?? 0;

    const hasHeavyRainfall = rainfall_last_1h_mm > 10;
    const isHighRisk = HIGH_RISK_CONDITIONS.has(condition) || hasHeavyRainfall;

    let riskReason: string | undefined;
    if (isHighRisk) {
      riskReason = `${condition} detected`;
      if (hasHeavyRainfall) {
        riskReason += ` with ${rainfall_last_1h_mm}mm rainfall in last hour`;
      }
    }

    if (isHighRisk) {
      logger.warn(`Weather risk at "${location}": ${riskReason}`);
    }

    return { condition, temp_c, humidity, pressure, windSpeed, description, rainfall_last_1h_mm, isHighRisk, ...(riskReason && { riskReason }) };
  } catch (error) {
    logger.warn(`Weather fetch failed for location "${location}": ${(error as Error).message}`);
    return null;
  }
};
