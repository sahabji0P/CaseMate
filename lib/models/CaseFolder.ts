import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseFolder extends Document {
  title: string;
  description: string;
  caseNumber: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  lawyerId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  documents: mongoose.Types.ObjectId[]; // References to Document model
  notes: Array<{
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  nextHearingDate?: Date;
  courtName?: string;
  judgeName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CaseFolderSchema = new Schema<ICaseFolder>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  caseNumber: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  },
  priority: { 
    type: String, 
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  lawyerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  clientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  documents: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Document'  // References the existing Document model
  }],
  notes: [{
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  nextHearingDate: { type: Date },
  courtName: { type: String },
  judgeName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
CaseFolderSchema.index({ lawyerId: 1, status: 1 });
CaseFolderSchema.index({ clientId: 1, status: 1 });
CaseFolderSchema.index({ caseNumber: 1 }, { unique: true });

// Check if the model exists before compiling it
const CaseFolder = mongoose.models.CaseFolder || mongoose.model<ICaseFolder>('CaseFolder', CaseFolderSchema);

export default CaseFolder;
