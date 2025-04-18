"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function RecentUploads() {
  const recentUploads = [
    {
      id: 1,
      title: "Court Order.pdf",
      date: "Apr 16, 2025",
      summary: "Order granting motion for extension of time to respond to complaint.",
      nextSteps: "File response by May 4, 2025.",
    },
    {
      id: 2,
      title: "Witness Statement.docx",
      date: "Apr 17, 2025",
      summary: "Statement from primary witness detailing events of March 15.",
      nextSteps: "Prepare for cross-examination during deposition.",
    },
    {
      id: 3,
      title: "Settlement Agreement.pdf",
      date: "Apr 18, 2025",
      summary: "Draft settlement agreement with proposed terms.",
      nextSteps: "Review and provide feedback by April 25, 2025.",
    },
  ]

  return (
    <div className="space-y-4">
      {recentUploads.map((upload) => (
        <div key={upload.id} className="space-y-2 pb-4 border-b last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{upload.title}</span>
            </div>
            <span className="text-xs text-muted-foreground">{upload.date}</span>
          </div>
          <p className="text-sm text-muted-foreground">{upload.summary}</p>
          <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-md">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Next Steps:</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">{upload.nextSteps}</p>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <Button variant="ghost" size="sm">
              View
            </Button>
            <Button variant="outline" size="sm">
              Take Action
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
