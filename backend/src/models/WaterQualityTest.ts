import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface IWaterQualityTest extends Document {
  waterSource: mongoose.Types.ObjectId; // Reference to WaterSource
  testDate: Date;
  pH: number;
  tds: number; // Total Dissolved Solids (ppm)
  turbidity: number; // Turbidity (NTU)
  contaminants: string[]; // Array of detected contaminants
  status: 'Safe' | 'Unsafe';
  tester: mongoose.Types.ObjectId; // Reference to User
  notes?: string;
  // Weather data for scientific correlation
  temperature?: number; // Temperature in Celsius
  humidity?: number; // Humidity percentage (0-100)
  pressure?: number; // Atmospheric pressure in hPa
  windSpeed?: number; // Wind speed in m/s
  weatherCondition?: string; // Main weather condition (e.g., "Clear", "Rain")
  weatherDescription?: string; // Detailed weather description
}

const waterQualityTestSchema = new mongoose.Schema<IWaterQualityTest>({
  waterSource: { type: mongoose.Schema.Types.ObjectId, ref: 'WaterSource', required: true },
  testDate: { type: Date, required: true, default: Date.now },
  pH: { type: Number, required: true, min: 0, max: 14 },
  tds: { type: Number, required: true, min: 0 },
  turbidity: { type: Number, required: true, min: 0 },
  contaminants: [{ type: String }],
  status: { type: String, enum: ['Safe', 'Unsafe'], required: true },
  tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String },
  // Weather data fields (optional for correlation with water quality)
  temperature: { type: Number, min: -100, max: 100 }, // Temperature in Celsius
  humidity: { type: Number, min: 0, max: 100 }, // Humidity percentage
  pressure: { type: Number, min: 800, max: 1200 }, // Atmospheric pressure in hPa
  windSpeed: { type: Number, min: 0 }, // Wind speed in m/s
  weatherCondition: { type: String }, // Main weather condition
  weatherDescription: { type: String } // Detailed weather description
}, { timestamps: true });

export default mongoose.model<IWaterQualityTest>('WaterQualityTest', waterQualityTestSchema);