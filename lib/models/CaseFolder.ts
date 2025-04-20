import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseFolder extends Document {
  lawyerId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  caseNumber: string;
  caseTitle: string;
  status: string;
  importantDates: { date: Date; description: string; type: string }[];
  documents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CaseFolderSchema = new Schema<ICaseFolder>({
  lawyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caseNumber: { type: String, required: true },
  caseTitle: { type: String, required: true },
  status: { type: String, default: 'active' },
  importantDates: [
    {
      date: Date,
      description: String,
      type: String
    }
  ],
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICaseFolder>('CaseFolder', CaseFolderSchema);
