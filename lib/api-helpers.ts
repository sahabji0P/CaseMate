import { CaseFolder } from './models/case-folder';

export async function fetchCaseFolders() {
  const response = await fetch('/api/case-folders');
  if (!response.ok) throw new Error('Failed to fetch folders');
  return response.json();
}

export async function fetchRecentDocuments(limit = 5) {
  const response = await fetch(`/api/documents/recent?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recent documents');
  return response.json();
}

export async function getAllDocuments() {
  const folders = await fetchCaseFolders();
  const allDocuments = folders.flatMap((folder: any) => 
    folder.documents.map((doc: any) => ({
      ...doc,
      folderName: folder.name,
      folderId: folder._id
    }))
  );
  return allDocuments.sort((a: any, b: any) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );
} 