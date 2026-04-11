import mongoose, { Schema, Document } from 'mongoose';

export interface IBeneficiary extends Document {
  name: string;
  location: string;
  familySize: number;
  contact: string;
  eligibilityStatus: 'Pending' | 'Active' | 'Inactive';
  submittedBy: mongoose.Types.ObjectId | string;
}

const BeneficiarySchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  familySize: { type: Number, required: true },
  contact: { type: String, required: true },
  eligibilityStatus: { type: String, enum: ['Pending', 'Active', 'Inactive'], default: 'Active', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

export default mongoose.model<IBeneficiary>('Beneficiary', BeneficiarySchema);
