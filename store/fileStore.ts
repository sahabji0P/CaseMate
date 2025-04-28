import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Document {
  id: string
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

interface CaseFolder {
  id: string
  lawyerId: string
  clientId: string
  caseNumber: string
  caseTitle: string
  status: string
  importantDates: {
    date: Date
    description: string
    type: string
  }[]
  documents: string[] // Array of document IDs
  createdAt: Date
  updatedAt: Date
}

interface FileState {
  documents: Document[]
  caseFolders: CaseFolder[]
  currentFolder: string | null
  addDocument: (document: Document) => void
  removeDocument: (id: string) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  addCaseFolder: (folder: CaseFolder) => void
  removeCaseFolder: (id: string) => void
  updateCaseFolder: (id: string, updates: Partial<CaseFolder>) => void
  setCurrentFolder: (folderId: string | null) => void
  clearStore: () => void
}

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      documents: [],
      caseFolders: [],
      currentFolder: null,
      addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
      removeDocument: (id) => set((state) => ({ documents: state.documents.filter((doc) => doc.id !== id) })),
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
        })),
      addCaseFolder: (folder) => set((state) => ({ caseFolders: [...state.caseFolders, folder] })),
      removeCaseFolder: (id) =>
        set((state) => ({ caseFolders: state.caseFolders.filter((folder) => folder.id !== id) })),
      updateCaseFolder: (id, updates) =>
        set((state) => ({
          caseFolders: state.caseFolders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        })),
      setCurrentFolder: (folderId) => set({ currentFolder: folderId }),
      clearStore: () => set({ documents: [], caseFolders: [], currentFolder: null }),
    }),
    {
      name: 'file-storage',
    }
  )
) 