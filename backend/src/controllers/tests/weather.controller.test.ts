import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getWeatherController } from '../weather.controller.js';
import { fetchWeatherForLocation } from '../../services/weather.service.js';

jest.mock('../../services/weather.service.js', () => ({
  fetchWeatherForLocation: jest.fn(),
}));

const mockedFetchWeather = fetchWeatherForLocation as jest.MockedFunction<typeof fetchWeatherForLocation>;

const createMockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res;
};

describe('weather.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return weather data for a valid location', async () => {
    const req = { params: { location: 'London' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const weatherData = {
      condition: 'Clear',
      temp_c: 20,
      humidity: 60,
      pressure: 1013,
      windSpeed: 5.2,
      description: 'clear sky',
      rainfall_last_1h_mm: 0,
      isHighRisk: false,
    };

    mockedFetchWeather.mockResolvedValue(weatherData);

    await getWeatherController(req, res as any, next);

    expect(mockedFetchWeather).toHaveBeenCalledWith('London');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(weatherData);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 for missing location', async () => {
    const req = { params: {} } as any;
    const res = createMockRes();
    const next = jest.fn();

    await getWeatherController(req, res as any, next);

    expect(mockedFetchWeather).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Location parameter is required and must be a string' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid location type', async () => {
    const req = { params: { location: 123 } } as any;
    const res = createMockRes();
    const next = jest.fn();

    await getWeatherController(req, res as any, next);

    expect(mockedFetchWeather).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Location parameter is required and must be a string' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 for blank location string', async () => {
    const req = { params: { location: '   ' } } as any;
    const res = createMockRes();
    const next = jest.fn();

    await getWeatherController(req, res as any, next);

    expect(mockedFetchWeather).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Location parameter is required and must be a string' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 when weather data not found', async () => {
    const req = { params: { location: 'InvalidLocation' } } as any;
    const res = createMockRes();
    const next = jest.fn();

    mockedFetchWeather.mockResolvedValue(null);

    await getWeatherController(req, res as any, next);

    expect(mockedFetchWeather).toHaveBeenCalledWith('InvalidLocation');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Weather data not found for the specified location' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error on service failure', async () => {
    const req = { params: { location: 'London' } } as any;
    const res = createMockRes();
    const next = jest.fn();
    const error = new Error('Service error');

    mockedFetchWeather.mockRejectedValue(error);

    await getWeatherController(req, res as any, next);

    expect(mockedFetchWeather).toHaveBeenCalledWith('London');
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});