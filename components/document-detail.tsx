"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Share2 } from "lucide-react"

interface DocumentDetailProps {
  document: {
    id: string
    title: string
    type: string
    caseType: string
    status: string
    date: string
    size: string
    thumbnail: string
  }
}

export function DocumentDetail({ document }: DocumentDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[200px] aspect-[3/4] bg-muted rounded-md overflow-hidden mb-4">
          <img
            src={document.thumbnail || "/placeholder.svg"}
            alt={document.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">{document.title}</h2>
        <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>
            {document.type} • {document.size}
          </span>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">AI Summary</h3>
            <p className="text-sm">
              This document is a {document.type.toLowerCase()} file related to a {document.caseType.toLowerCase()} case.
              It was uploaded on {document.date} and is currently {document.status.toLowerCase()}.
            </p>
            <p className="text-sm">
              The document contains important legal information that may require your attention. Our AI has analyzed the
              content and extracted key points for your review.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Key Points</h3>
            <ul className="text-sm space-y-1">
              <li>• Point 1: Important legal consideration</li>
              <li>• Point 2: Deadline information</li>
              <li>• Point 3: Relevant case law reference</li>
            </ul>
          </div>

          <div className="space-y-2 bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Next Steps</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Based on this document, you should prepare a response by May 4, 2025. Consider consulting with your
              attorney about the implications.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">File Type:</div>
            <div>{document.type}</div>

            <div className="font-medium">Size:</div>
            <div>{document.size}</div>

            <div className="font-medium">Uploaded:</div>
            <div>{document.date}</div>

            <div className="font-medium">Case Type:</div>
            <div>{document.caseType}</div>

            <div className="font-medium">Status:</div>
            <div>
              <Badge
                variant={
                  document.status === "Active" ? "default" : document.status === "Pending" ? "outline" : "secondary"
                }
              >
                {document.status}
              </Badge>
            </div>

            <div className="font-medium">Pages:</div>
            <div>12</div>

            <div className="font-medium">Author:</div>
            <div>John Smith</div>

            <div className="font-medium">Modified:</div>
            <div>Apr 15, 2025</div>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Set Reminder</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button className="w-full mt-2" size="sm">
              Set Reminder
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Related Templates</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  <FileText className="h-4 w-4 mr-2" /> Response Template
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  <FileText className="h-4 w-4 mr-2" /> Motion Template
                </Button>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
