import mongoose from 'mongoose';
import WaterQualityTest from '../models/WaterQualityTest.js';
import type { IWaterQualityTest } from '../models/WaterQualityTest.js';
import WaterSource from '../models/WaterSource.js';
import type { CreateWaterTestData, UpdateWaterTestData, WaterTestFilters } from '../validations/waterTest.schemas.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';
import { fetchWeatherForLocation } from './weather.service.js';

const classifyWaterSafety = (pH: number, tds: number, turbidity: number, contaminants: string[]): 'Safe' | 'Unsafe' => {
  if (pH < 6.5 || pH > 8.5 || tds > 500 || turbidity > 4 || contaminants.length > 0) {
    return 'Unsafe';
  }
  return 'Safe';
};

export const createWaterTestService = async (
  data: CreateWaterTestData,
  userId: string
): Promise<IWaterQualityTest> => {
  const source = await WaterSource.findById(data.waterSource);
  if (!source) {
    throw new AppError(404, 'Water source not found');
  }

  const status = classifyWaterSafety(data.pH, data.tds, data.turbidity, data.contaminants);

  // Fetch weather data for the water source location
  let weatherData = null;
  try {
    weatherData = await fetchWeatherForLocation(source.location);
  } catch (error) {
    logger.warn(`Failed to fetch weather data for location "${source.location}": ${(error as Error).message}`);
  }

  const testData: Partial<IWaterQualityTest> = {
    waterSource: new mongoose.Types.ObjectId(data.waterSource),
    pH: data.pH,
    tds: data.tds,
    turbidity: data.turbidity,
    contaminants: data.contaminants,
    status,
    tester: new mongoose.Types.ObjectId(userId),
    ...(data.notes && { notes: data.notes })
  };

  // Include weather data if available
  if (weatherData) {
    testData.temperature = weatherData.temp_c;
    testData.humidity = weatherData.humidity;
    testData.pressure = weatherData.pressure;
    testData.windSpeed = weatherData.windSpeed;
    testData.weatherCondition = weatherData.condition;
    testData.weatherDescription = weatherData.description;

    logger.info(`Weather data captured for water test: ${weatherData.condition}, ${weatherData.temp_c}°C, ${weatherData.humidity}% humidity`);
  }

  const test = new WaterQualityTest(testData);
  const saved = await test.save();

  if (status === 'Unsafe') {
    logger.warn(`UNSAFE water detected — source: ${data.waterSource}, pH: ${data.pH}, TDS: ${data.tds}, turbidity: ${data.turbidity}, contaminants: [${data.contaminants.join(', ')}]`);
  }

  return saved;
};

export const getAllWaterTestsService = async (filters: WaterTestFilters = {}): Promise<IWaterQualityTest[]> => {
  const query: Record<string, unknown> = {};

  if (filters.source) {
    query.waterSource = filters.source;
  }

  if (filters.from || filters.to) {
    const dateFilter: Record<string, Date> = {};
    if (filters.from) dateFilter.$gte = new Date(filters.from);
    if (filters.to) dateFilter.$lte = new Date(filters.to);
    query.testDate = dateFilter;
  }

  return await WaterQualityTest.find(query)
    .populate('tester', 'name email')
    .populate('waterSource', 'name location')
    .sort({ testDate: -1 });
};

export const getWaterTestByIdService = async (id: string): Promise<IWaterQualityTest> => {
  const test = await WaterQualityTest.findById(id)
    .populate('tester', 'name email')
    .populate('waterSource', 'name location');

  if (!test) {
    throw new AppError(404, 'Water quality test not found');
  }

  return test;
};

export const updateWaterTestService = async (
  id: string,
  data: UpdateWaterTestData
): Promise<IWaterQualityTest> => {
  const existingTest = await WaterQualityTest.findById(id);
  if (!existingTest) {
    throw new AppError(404, 'Water quality test not found');
  }

  const nextPH = data.pH ?? existingTest.pH;
  const nextTDS = data.tds ?? existingTest.tds;
  const nextTurbidity = data.turbidity ?? existingTest.turbidity;
  const nextContaminants = data.contaminants ?? existingTest.contaminants;
  const recalculatedStatus = classifyWaterSafety(nextPH, nextTDS, nextTurbidity, nextContaminants);

  const payload = {
    ...data,
    status: recalculatedStatus,
  };

  const test = await WaterQualityTest.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

  if (!test) {
    throw new AppError(404, 'Water quality test not found');
  }

  return test;
};

export const deleteWaterTestService = async (id: string): Promise<void> => {
  const test = await WaterQualityTest.findByIdAndDelete(id);

  if (!test) {
    throw new AppError(404, 'Water quality test not found');
  }
};

export const getWaterTestAnalyticsService = async (sourceId?: string) => {
  const matchStage: Record<string, unknown> = {};
  if (sourceId) {
    matchStage.waterSource = new mongoose.Types.ObjectId(sourceId);
  }

  const trends = await WaterQualityTest.aggregate([
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: {
          waterSource: '$waterSource',
          year: { $year: '$testDate' },
          month: { $month: '$testDate' },
          day: { $dayOfMonth: '$testDate' }
        },
        avgPH: { $avg: '$pH' },
        avgTDS: { $avg: '$tds' },
        avgTurbidity: { $avg: '$turbidity' },
        totalTests: { $sum: 1 },
        unsafeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Unsafe'] }, 1, 0] }
        },
        safeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Safe'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return trends;
};