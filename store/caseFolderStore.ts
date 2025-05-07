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
  selectedCase: CaseFolder | null
  setCases: (cases: CaseFolder[]) => void
  setSelectedCase: (caseFolder: CaseFolder | null) => void
  addCase: (caseFolder: CaseFolder) => void
  updateCase: (caseId: string, updates: Partial<CaseFolder>) => void
  deleteCase: (caseId: string) => void
  addNote: (caseId: string, note: { content: string; createdAt: Date; updatedAt: Date }) => void
  updateNote: (caseId: string, noteIndex: number, content: string) => void
  deleteNote: (caseId: string, noteIndex: number) => void
  clearCases: () => void
}

export const useCaseFolderStore = create<CaseFolderState>()(
  persist(
    (set) => ({
      cases: [],
      selectedCase: null,
      setCases: (cases) => set({ cases }),
      setSelectedCase: (caseFolder) => set({ selectedCase: caseFolder }),
      addCase: (caseFolder) => 
        set((state) => ({ cases: [...state.cases, caseFolder] })),
      updateCase: (caseId, updates) =>
        set((state) => ({
          cases: state.cases.map((caseFolder) =>
            caseFolder._id === caseId
              ? { ...caseFolder, ...updates, updatedAt: new Date() }
              : caseFolder
          ),
          selectedCase: state.selectedCase?._id === caseId
            ? { ...state.selectedCase, ...updates, updatedAt: new Date() }
            : state.selectedCase
        })),
      deleteCase: (caseId) =>
        set((state) => ({
          cases: state.cases.filter((caseFolder) => caseFolder._id !== caseId),
          selectedCase: state.selectedCase?._id === caseId ? null : state.selectedCase
        })),
      addNote: (caseId, note) =>
        set((state) => ({
          cases: state.cases.map((caseFolder) =>
            caseFolder._id === caseId
              ? { ...caseFolder, notes: [...caseFolder.notes, note] }
              : caseFolder
          ),
          selectedCase: state.selectedCase?._id === caseId
            ? { ...state.selectedCase, notes: [...state.selectedCase.notes, note] }
            : state.selectedCase
        })),
      updateNote: (caseId, noteIndex, content) =>
        set((state) => ({
          cases: state.cases.map((caseFolder) =>
            caseFolder._id === caseId
              ? {
                  ...caseFolder,
                  notes: caseFolder.notes.map((note, idx) =>
                    idx === noteIndex
                      ? { ...note, content, updatedAt: new Date() }
                      : note
                  )
                }
              : caseFolder
          ),
          selectedCase: state.selectedCase?._id === caseId
            ? {
                ...state.selectedCase,
                notes: state.selectedCase.notes.map((note, idx) =>
                  idx === noteIndex
                    ? { ...note, content, updatedAt: new Date() }
                    : note
                )
              }
            : state.selectedCase
        })),
      deleteNote: (caseId, noteIndex) =>
        set((state) => ({
          cases: state.cases.map((caseFolder) =>
            caseFolder._id === caseId
              ? {
                  ...caseFolder,
                  notes: caseFolder.notes.filter((_, idx) => idx !== noteIndex)
                }
              : caseFolder
          ),
          selectedCase: state.selectedCase?._id === caseId
            ? {
                ...state.selectedCase,
                notes: state.selectedCase.notes.filter((_, idx) => idx !== noteIndex)
              }
            : state.selectedCase
        })),
      clearCases: () => set({ cases: [], selectedCase: null }),
    }),
    {
      name: 'case-folder-storage',
    }
  )
) 