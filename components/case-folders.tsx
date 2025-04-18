"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FolderOpen } from "lucide-react"
import { fetchCaseFolders } from "@/lib/api-helpers"

export function CaseFolders() {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const data = await fetchCaseFolders();
        setFolders(data);
      } catch (error) {
        console.error('Failed to load folders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading folders...</div>;
  }

  return (
    <div className="space-y-3">
      {folders.map((folder) => (
        <div
          key={folder._id}
          className="flex items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <div className="mr-3 bg-blue-100 dark:bg-blue-900 p-2 rounded">
            <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{folder.name}</h3>
            <div className="flex text-xs text-muted-foreground">
              <span>{folder.documents?.length || 0} documents</span>
              <span className="mx-2">•</span>
              <span>Updated {new Date(folder.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </div>
      ))}

      {folders.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No folders found. Create a new folder to get started.
        </div>
      )}
    </div>
  )
}
