import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Document {
  _id: string
  caseId: string
  uploadedBy: string
  fileId: string
  originalName: string
  fileType?: string
  fileSize?: number
  uploadDate: Date
  metadataId?: string
  isSharedWithClient: boolean
  comments: Array<{
    author: string
    message: string
    timestamp: Date
  }>
}

interface DocumentState {
  documents: Document[]
  selectedDocument: Document | null
  setDocuments: (documents: Document[]) => void
  setSelectedDocument: (document: Document | null) => void
  addDocument: (document: Document) => void
  updateDocument: (documentId: string, updates: Partial<Document>) => void
  deleteDocument: (documentId: string) => void
  addComment: (documentId: string, comment: { author: string; message: string; timestamp: Date }) => void
  updateComment: (documentId: string, commentIndex: number, message: string) => void
  deleteComment: (documentId: string, commentIndex: number) => void
  toggleShareWithClient: (documentId: string) => void
  clearDocuments: () => void
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [],
      selectedDocument: null,
      setDocuments: (documents) => set({ documents }),
      setSelectedDocument: (document) => set({ selectedDocument: document }),
      addDocument: (document) =>
        set((state) => ({ documents: [...state.documents, document] })),
      updateDocument: (documentId, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === documentId ? { ...doc, ...updates } : doc
          ),
          selectedDocument: state.selectedDocument?._id === documentId
            ? { ...state.selectedDocument, ...updates }
            : state.selectedDocument
        })),
      deleteDocument: (documentId) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc._id !== documentId),
          selectedDocument: state.selectedDocument?._id === documentId ? null : state.selectedDocument
        })),
      addComment: (documentId, comment) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === documentId
              ? { ...doc, comments: [...doc.comments, comment] }
              : doc
          ),
          selectedDocument: state.selectedDocument?._id === documentId
            ? { ...state.selectedDocument, comments: [...state.selectedDocument.comments, comment] }
            : state.selectedDocument
        })),
      updateComment: (documentId, commentIndex, message) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === documentId
              ? {
                  ...doc,
                  comments: doc.comments.map((comment, idx) =>
                    idx === commentIndex
                      ? { ...comment, message, timestamp: new Date() }
                      : comment
                  )
                }
              : doc
          ),
          selectedDocument: state.selectedDocument?._id === documentId
            ? {
                ...state.selectedDocument,
                comments: state.selectedDocument.comments.map((comment, idx) =>
                  idx === commentIndex
                    ? { ...comment, message, timestamp: new Date() }
                    : comment
                )
              }
            : state.selectedDocument
        })),
      deleteComment: (documentId, commentIndex) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === documentId
              ? {
                  ...doc,
                  comments: doc.comments.filter((_, idx) => idx !== commentIndex)
                }
              : doc
          ),
          selectedDocument: state.selectedDocument?._id === documentId
            ? {
                ...state.selectedDocument,
                comments: state.selectedDocument.comments.filter((_, idx) => idx !== commentIndex)
              }
            : state.selectedDocument
        })),
      toggleShareWithClient: (documentId) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc._id === documentId
              ? { ...doc, isSharedWithClient: !doc.isSharedWithClient }
              : doc
          ),
          selectedDocument: state.selectedDocument?._id === documentId
            ? { ...state.selectedDocument, isSharedWithClient: !state.selectedDocument.isSharedWithClient }
            : state.selectedDocument
        })),
      clearDocuments: () => set({ documents: [], selectedDocument: null }),
    }),
    {
      name: 'document-storage',
    }
  )
) 