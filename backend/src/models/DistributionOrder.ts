import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export interface IDistributionOrder extends Document {
  resource: mongoose.Types.ObjectId;
  quantity: number;
  targetLocation: string;
  beneficiaries: mongoose.Types.ObjectId[];
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Failed';
  driver?: mongoose.Types.ObjectId;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const distributionOrderSchema = new mongoose.Schema<IDistributionOrder>({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  quantity: { type: Number, required: true, min: 1 },
  targetLocation: { type: String, required: true },
  beneficiaries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' }],
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'In Transit', 'Delivered', 'Failed'], 
    default: 'Pending',
    required: true 
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IDistributionOrder>('DistributionOrder', distributionOrderSchema);
