import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CaseFolder {
  _id: string
  title: string
  description: string
  caseNumber: string
  status: 'active' | 'closed' | 'pending'
  priority: 'high' | 'medium' | 'low'
  lawyerId: string
  clientId: {
    _id: string
    name: string
    email: string
  }
  documents: string[]
  notes: Array<{
    content: string
    createdAt: Date
    updatedAt: Date
  }>
  nextHearingDate?: Date
  courtName?: string
  judgeName?: string
  createdAt: Date
  updatedAt: Date
}

interface CaseFolderState {
  cases: CaseFolder[]
  setCases: (cases: CaseFolder[]) => void
  addCase: (caseFolder: CaseFolder) => void
  updateCase: (caseId: string, updates: Partial<CaseFolder>) => void
  deleteCase: (caseId: string) => void
  clearCases: () => void
}

export const useCaseFolderStore = create<CaseFolderState>()(
  persist(
    (set) => ({
      cases: [],
      setCases: (cases) => set({ cases }),
      addCase: (caseFolder) => 
        set((state) => ({ cases: [...state.cases, caseFolder] })),
      updateCase: (caseId, updates) =>
        set((state) => ({
          cases: state.cases.map((caseFolder) =>
            caseFolder._id === caseId
              ? { ...caseFolder, ...updates }
              : caseFolder
          ),
        })),
      deleteCase: (caseId) =>
        set((state) => ({
          cases: state.cases.filter((caseFolder) => caseFolder._id !== caseId),
        })),
      clearCases: () => set({ cases: [] }),
    }),
    {
      name: 'case-folder-storage',
    }
  )
) 