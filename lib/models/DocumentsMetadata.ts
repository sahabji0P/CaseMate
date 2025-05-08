
// 📁 models/DocumentMetadata.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentMetadata extends Document {
  documentType: string;
  petitionType?: string;
  courtName: string;
  bench: string[];
  caseTitle: string;
  caseNumber: string;
  filedDate?: Date;
  dateOfJudgment?: Date;
  caseStatus: string;
  partiesInvolved: { petitioner: string; respondent: string };
  advocates: string[];
  legalIssues: string[];
  citations: string[];
  statutes: string[];
  relevantRules: string[];
  reliefSought?: string;
  verdict?: string;
  damagesAwarded?: string;
  deadlines: string[];
  nextHearingDate?: Date;
  keywords: string[];
  relatedCases: string[];
  caseSummary: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentMetadataSchema = new Schema<IDocumentMetadata>({
  documentType: String,
  petitionType: String,
  courtName: String,
  bench: [String],
  caseTitle: String,
  caseNumber: String,
  filedDate: Date,
  dateOfJudgment: Date,
  caseStatus: String,
  partiesInvolved: {
    petitioner: String,
    respondent: String
  },
  advocates: [String],
  legalIssues: [String],
  citations: [String],
  statutes: [String],
  relevantRules: [String],
  reliefSought: String,
  verdict: String,
  damagesAwarded: String,
  deadlines: [String],
  nextHearingDate: Date,
  keywords: [String],
  relatedCases: [String],
  caseSummary: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.DocumentMetadata || mongoose.model<IDocumentMetadata>('DocumentMetadata', DocumentMetadataSchema);
