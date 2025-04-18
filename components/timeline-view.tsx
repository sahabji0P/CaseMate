"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText } from "lucide-react"

export function TimelineView() {
  const timelineItems = [
    {
      id: 1,
      title: "Complaint Filed",
      date: "Apr 10, 2025",
      document: "Complaint.pdf",
      status: "completed",
      icon: FileText,
    },
    {
      id: 2,
      title: "Response Submitted",
      date: "Apr 15, 2025",
      document: "Response.pdf",
      status: "completed",
      icon: FileText,
    },
    {
      id: 3,
      title: "Evidence Submission",
      date: "Apr 20, 2025",
      document: "Evidence.zip",
      status: "completed",
      icon: FileText,
    },
    {
      id: 4,
      title: "Court Hearing",
      date: "May 5, 2025",
      document: null,
      status: "pending",
      icon: Clock,
    },
  ]

  return (
    <div className="relative">
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {timelineItems.map((item, index) => (
          <Card key={item.id} className="min-w-[200px] timeline-item">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={item.status === "completed" ? "default" : "outline"}>
                  {item.status === "completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="font-medium">{item.title}</h3>
              {item.document && (
                <div className="flex items-center mt-2 text-sm text-blue-500">
                  <FileText className="h-3 w-3 mr-1" />
                  {item.document}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline connector */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -z-10" />
    </div>
  )
}
