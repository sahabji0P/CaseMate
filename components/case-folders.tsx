"use client"

import { Button } from "@/components/ui/button"
import { FolderOpen } from "lucide-react"

export function CaseFolders() {
  const folders = [
    // {
    //   id: 1,
    //   title: "Smith vs. Johnson",
    //   count: 12,
    //   lastUpdated: "Apr 18, 2025",
    // },
    // {
    //   id: 2,
    //   title: "Property Acquisition",
    //   count: 8,
    //   lastUpdated: "Apr 15, 2025",
    // },
    // {
    //   id: 3,
    //   title: "Insurance Claim",
    //   count: 5,
    //   lastUpdated: "Apr 10, 2025",
    // },
  ]

  return (
    <div className="space-y-3">
      {folders?.map((folder) => (
        <div
          key={folder.id}
          className="flex items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <div className="mr-3 bg-blue-100 dark:bg-blue-900 p-2 rounded">
            <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{folder.title}</h3>
            <div className="flex text-xs text-muted-foreground">
              <span>{folder.count} documents</span>
              <span className="mx-2">•</span>
              <span>Updated {folder.lastUpdated}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </div>
      ))}
    </div>
  )
}
