import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DocumentMetadata {
  _id: string
  documentType: string
  petitionType?: string
  courtName: string
  bench: string[]
  caseTitle: string
  caseNumber: string
  filedDate?: Date
  dateOfJudgment?: Date
  caseStatus: string
  partiesInvolved: {
    petitioner: string
    respondent: string
  }
  advocates: string[]
  legalIssues: string[]
  citations: string[]
  statutes: string[]
  relevantRules: string[]
  reliefSought?: string
  verdict?: string
  damagesAwarded?: string
  deadlines: string[]
  nextHearingDate?: Date
  keywords: string[]
  relatedCases: string[]
  caseSummary: string
  createdAt: Date
  updatedAt: Date
}

interface DocumentMetadataState {
  metadata: DocumentMetadata[]
  selectedMetadata: DocumentMetadata | null
  setMetadata: (metadata: DocumentMetadata[]) => void
  setSelectedMetadata: (metadata: DocumentMetadata | null) => void
  addMetadata: (metadata: DocumentMetadata) => void
  updateMetadata: (metadataId: string, updates: Partial<DocumentMetadata>) => void
  deleteMetadata: (metadataId: string) => void
  addKeyword: (metadataId: string, keyword: string) => void
  removeKeyword: (metadataId: string, keyword: string) => void
  addLegalIssue: (metadataId: string, issue: string) => void
  removeLegalIssue: (metadataId: string, issue: string) => void
  addCitation: (metadataId: string, citation: string) => void
  removeCitation: (metadataId: string, citation: string) => void
  addStatute: (metadataId: string, statute: string) => void
  removeStatute: (metadataId: string, statute: string) => void
  addRelatedCase: (metadataId: string, caseId: string) => void
  removeRelatedCase: (metadataId: string, caseId: string) => void
  clearMetadata: () => void
}

export const useDocumentMetadataStore = create<DocumentMetadataState>()(
  persist(
    (set) => ({
      metadata: [],
      selectedMetadata: null,
      setMetadata: (metadata) => set({ metadata }),
      setSelectedMetadata: (metadata) => set({ selectedMetadata: metadata }),
      addMetadata: (metadata) =>
        set((state) => ({ metadata: [...state.metadata, metadata] })),
      updateMetadata: (metadataId, updates) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, ...updates, updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, ...updates, updatedAt: new Date() }
            : state.selectedMetadata
        })),
      deleteMetadata: (metadataId) =>
        set((state) => ({
          metadata: state.metadata.filter((meta) => meta._id !== metadataId),
          selectedMetadata: state.selectedMetadata?._id === metadataId ? null : state.selectedMetadata
        })),
      addKeyword: (metadataId, keyword) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, keywords: [...meta.keywords, keyword], updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, keywords: [...state.selectedMetadata.keywords, keyword], updatedAt: new Date() }
            : state.selectedMetadata
        })),
      removeKeyword: (metadataId, keyword) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, keywords: meta.keywords.filter((k) => k !== keyword), updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, keywords: state.selectedMetadata.keywords.filter((k) => k !== keyword), updatedAt: new Date() }
            : state.selectedMetadata
        })),
      addLegalIssue: (metadataId, issue) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, legalIssues: [...meta.legalIssues, issue], updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, legalIssues: [...state.selectedMetadata.legalIssues, issue], updatedAt: new Date() }
            : state.selectedMetadata
        })),
      removeLegalIssue: (metadataId, issue) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, legalIssues: meta.legalIssues.filter((i) => i !== issue), updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, legalIssues: state.selectedMetadata.legalIssues.filter((i) => i !== issue), updatedAt: new Date() }
            : state.selectedMetadata
        })),
      addCitation: (metadataId, citation) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, citations: [...meta.citations, citation], updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, citations: [...state.selectedMetadata.citations, citation], updatedAt: new Date() }
            : state.selectedMetadata
        })),
      removeCitation: (metadataId, citation) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, citations: meta.citations.filter((c) => c !== citation), updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, citations: state.selectedMetadata.citations.filter((c) => c !== citation), updatedAt: new Date() }
            : state.selectedMetadata
        })),
      addStatute: (metadataId, statute) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, statutes: [...meta.statutes, statute], updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, statutes: [...state.selectedMetadata.statutes, statute], updatedAt: new Date() }
            : state.selectedMetadata
        })),
      removeStatute: (metadataId, statute) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, statutes: meta.statutes.filter((s) => s !== statute), updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, statutes: state.selectedMetadata.statutes.filter((s) => s !== statute), updatedAt: new Date() }
            : state.selectedMetadata
        })),
      addRelatedCase: (metadataId, caseId) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, relatedCases: [...meta.relatedCases, caseId], updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, relatedCases: [...state.selectedMetadata.relatedCases, caseId], updatedAt: new Date() }
            : state.selectedMetadata
        })),
      removeRelatedCase: (metadataId, caseId) =>
        set((state) => ({
          metadata: state.metadata.map((meta) =>
            meta._id === metadataId
              ? { ...meta, relatedCases: meta.relatedCases.filter((c) => c !== caseId), updatedAt: new Date() }
              : meta
          ),
          selectedMetadata: state.selectedMetadata?._id === metadataId
            ? { ...state.selectedMetadata, relatedCases: state.selectedMetadata.relatedCases.filter((c) => c !== caseId), updatedAt: new Date() }
            : state.selectedMetadata
        })),
      clearMetadata: () => set({ metadata: [], selectedMetadata: null }),
    }),
    {
      name: 'document-metadata-storage',
    }
  )
) 