import mongoose from 'mongoose';

// Define the schema for document metadata
const DocumentMetadataSchema = new mongoose.Schema({
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
  relatedCases: [String]
});

// Define the schema for documents
const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  metadata: { type: DocumentMetadataSchema, default: {} },
  fileUrl: { type: String, required: true }
});

// Define the schema for case folders
const CaseFolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  documents: [DocumentSchema],
  caseNumber: String,
  caseTitle: String,
  status: { type: String, default: 'active' },
  nextHearingDate: Date,
  importantDates: [{
    date: Date,
    description: String,
    type: String
  }]
});

// Update the updatedAt field on save
CaseFolderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create the model
export const CaseFolder = mongoose.models.CaseFolder || mongoose.model('CaseFolder', CaseFolderSchema); 