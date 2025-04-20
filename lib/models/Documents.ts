import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileId: mongoose.Types.ObjectId;
  originalName: string;
  fileType?: string;
  fileSize?: number;
  uploadDate: Date;
  metadataId?: mongoose.Types.ObjectId;
  isSharedWithClient: boolean;
  comments: { author: mongoose.Types.ObjectId; message: string; timestamp: Date }[];
}

const DocumentSchema = new Schema<IDocument>({
  caseId: { type: Schema.Types.ObjectId, ref: 'CaseFolder', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileId: { type: Schema.Types.ObjectId, required: true, ref: 'uploads.files' },
  originalName: { type: String, required: true },
  fileType: String,
  fileSize: Number,
  uploadDate: { type: Date, default: Date.now },
  metadataId: { type: Schema.Types.ObjectId, ref: 'DocumentMetadata' },
  isSharedWithClient: { type: Boolean, default: false },
  comments: [
    {
      author: { type: Schema.Types.ObjectId, ref: 'User' },
      message: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
