"use client"

import { Button } from "@/components/ui/button"
import { fetchRecentDocuments } from "@/lib/api-helpers"
import { FileText } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { PDFPreview } from "./pdf-preview-dialog"

export function RecentUploads() {
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const loadRecentUploads = async () => {
      try {
        const data = await fetchRecentDocuments(3); // Limit to 3 recent documents
        setRecentUploads(data);
      } catch (error) {
        console.error('Failed to load recent uploads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentUploads();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading recent uploads...</div>;
  }

  return (
    <div className="space-y-4">
      {recentUploads.map((upload) => (
        <div key={upload.document._id} className="space-y-2 pb-4 border-b last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{upload.document.fileName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(upload.document.uploadDate).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            From folder: {upload.folderName}
          </p>
          {upload.document.summary && (
            <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-md">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Summary:</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">{upload.document.summary}</p>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile({
                  url: upload.document.fileUrl,
                  name: upload.document.fileName
                });
                setIsPreviewOpen(true);
              }}
            >
              Preview
            </Button>
            <Link href={"/upload"}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {recentUploads.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No documents uploaded yet.
        </div>
      )}

      {selectedFile && (
        <PDFPreview
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedFile(null);
          }}
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      )}
    </div>
  )
}
