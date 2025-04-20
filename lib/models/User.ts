// 📁 models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  mobileNumber?: string;
  aadharNumber?: string;
  barCouncilId?: string; // for lawyers only
  role: 'lawyer' | 'client';
  linkedLawyers?: mongoose.Types.ObjectId[]; // for clients
  linkedClients?: mongoose.Types.ObjectId[]; // for lawyers
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  mobileNumber: { type: String },
  aadharNumber: { type: String },
  barCouncilId: { type: String },
  role: { type: String, enum: ['lawyer', 'client'], required: true },
  linkedLawyers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  linkedClients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);