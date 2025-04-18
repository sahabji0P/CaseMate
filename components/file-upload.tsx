"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { CaseFolderSelector } from "@/components/case-folder-selector"
import { Separator } from "@/components/ui/separator"

interface FileUploadProps {
  onSuccess?: () => void
}

export function FileUpload({ onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [step, setStep] = useState<"select-file" | "select-folder">("select-file")
  const [folderId, setFolderId] = useState<string | null>(null)
  const [createNewFolder, setCreateNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDescription, setNewFolderDescription] = useState("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setStep("select-folder")
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
    }
  }

  const handleFolderSelect = (
    selectedFolderId: string | null, 
    createNew: boolean, 
    folderName?: string, 
    folderDescription?: string
  ) => {
    console.log('Folder selected in FileUpload:', { selectedFolderId, createNew, folderName, folderDescription });
    setFolderId(selectedFolderId);
    setCreateNewFolder(createNew);
    if (folderName) setNewFolderName(folderName);
    if (folderDescription) setNewFolderDescription(folderDescription);
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }

    if (!folderId) {
      toast({
        title: "No folder selected",
        description: "Please select a folder or create a new one",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Process the document with the folder ID
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseFolderId", folderId);
      formData.append("createNewFolder", "false");
      
      console.log('Processing document with folder ID:', folderId);
      const response = await fetch("/api/process-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process document");
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      toast({
        title: "Document processed successfully",
        description: "The document has been analyzed and processed",
      });

      // Reset the form
      setFile(null);
      setStep("select-file");
      setFolderId(null);
      setCreateNewFolder(false);
      setNewFolderName("");
      setNewFolderDescription("");
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error processing document",
        description: error instanceof Error ? error.message : "An error occurred while processing the document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      {step === "select-file" ? (
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <Button 
            onClick={() => setStep("select-folder")} 
            disabled={!file || isUploading}
            className="w-full"
          >
            Next: Select Folder
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Selected file: {file?.name}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setStep("select-file")}
              disabled={isUploading}
            >
              Change File
            </Button>
          </div>
          
          <Separator />
          
          <CaseFolderSelector onFolderSelect={handleFolderSelect} />
          
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload and Process"
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 