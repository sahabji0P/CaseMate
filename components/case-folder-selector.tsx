"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Folder } from "lucide-react"

interface CaseFolder {
  _id: string
  name: string
  description?: string
  caseNumber?: string
  caseTitle?: string
}

interface CaseFolderSelectorProps {
  onFolderSelect: (folderId: string | null, createNew: boolean, newFolderName?: string, newFolderDescription?: string) => void
}

export function CaseFolderSelector({ onFolderSelect }: CaseFolderSelectorProps) {
  const [folders, setFolders] = useState<CaseFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [createNewFolder, setCreateNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDescription, setNewFolderDescription] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/case-folders")
      if (!response.ok) {
        throw new Error("Failed to fetch case folders")
      }
      const data = await response.json()
      setFolders(data)
    } catch (error) {
      toast({
        title: "Error fetching case folders",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFolderSelect = async () => {
    if (createNewFolder) {
      if (!newFolderName) {
        toast({
          title: "Folder name required",
          description: "Please enter a name for the new folder",
          variant: "destructive",
        })
        return
      }
      
      try {
        console.log('Attempting to create new folder with name:', newFolderName);
        // Create the folder first
        const response = await fetch("/api/case-folders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newFolderName,
            description: newFolderDescription,
          }),
        });
        
        console.log('Folder creation response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from folder creation:', errorData);
          throw new Error(errorData.error || "Failed to create folder");
        }
        
        const folderData = await response.json();
        console.log('Created new folder with ID:', folderData._id);
        
        // Now notify the parent with the new folder ID
        onFolderSelect(folderData._id, false);
        
        // Reset the form
        setCreateNewFolder(false);
        setNewFolderName("");
        setNewFolderDescription("");
        
        toast({
          title: "Folder created successfully",
          description: "You can now upload your document",
        });
      } catch (error) {
        console.error('Error creating folder:', error);
        toast({
          title: "Error creating folder",
          description: error instanceof Error ? error.message : "An error occurred while creating the folder",
          variant: "destructive",
        });
      }
    } else {
      if (!selectedFolderId) {
        toast({
          title: "No folder selected",
          description: "Please select a folder or create a new one",
          variant: "destructive",
        })
        return
      }
      onFolderSelect(selectedFolderId, false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant={createNewFolder ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCreateNewFolder(true);
            setSelectedFolderId(null);
          }}
          className="flex-1"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Folder
        </Button>
        <Button
          variant={!createNewFolder ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCreateNewFolder(false);
            setNewFolderName("");
            setNewFolderDescription("");
          }}
          className="flex-1"
        >
          <Folder className="mr-2 h-4 w-4" />
          Select Existing Folder
        </Button>
      </div>

      {createNewFolder ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folderDescription">Description (Optional)</Label>
            <Textarea
              id="folderDescription"
              placeholder="Enter folder description"
              value={newFolderDescription}
              onChange={(e) => setNewFolderDescription(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="folderSelect">Select Case Folder</Label>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              No case folders found. Create a new folder to get started.
            </div>
          ) : (
            <Select value={selectedFolderId || ""} onValueChange={setSelectedFolderId}>
              <SelectTrigger id="folderSelect">
                <SelectValue placeholder="Select a case folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder._id} value={folder._id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <Button onClick={handleFolderSelect} className="w-full">
        {createNewFolder ? "Create Folder" : "Select Folder"}
      </Button>
    </div>
  )
} 