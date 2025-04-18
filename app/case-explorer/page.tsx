"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DocumentDetail } from "@/components/document-detail"
import { Badge } from "@/components/ui/badge"

export default function CaseExplorerPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCase, setSelectedCase] = useState<string | null>(null)

  // Sample cases data
  const cases = [
    {
      id: "case1",
      title: "Smith vs. Johnson",
      type: "Civil",
      status: "Active",
      documents: [
        {
          id: "doc1",
          title: "Complaint.pdf",
          type: "PDF",
          status: "Active",
          date: "Apr 10, 2025",
          size: "2.4 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=PDF",
        },
        {
          id: "doc2",
          title: "Response Letter.docx",
          type: "DOCX",
          status: "Active",
          date: "Apr 12, 2025",
          size: "1.8 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=DOCX",
        },
        {
          id: "doc4",
          title: "Court Order.pdf",
          type: "PDF",
          status: "Closed",
          date: "Apr 16, 2025",
          size: "3.2 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=PDF",
        },
      ],
    },
    {
      id: "case2",
      title: "Property Acquisition",
      type: "Real Estate",
      status: "Pending",
      documents: [
        {
          id: "doc7",
          title: "Property Deed.pdf",
          type: "PDF",
          status: "Active",
          date: "Apr 19, 2025",
          size: "3.8 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=PDF",
        },
      ],
    },
    {
      id: "case3",
      title: "Insurance Claim",
      type: "Insurance",
      status: "Active",
      documents: [
        {
          id: "doc8",
          title: "Insurance Claim.pdf",
          type: "PDF",
          status: "Pending",
          date: "Apr 20, 2025",
          size: "2.9 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=PDF",
        },
        {
          id: "doc3",
          title: "Evidence Photos.zip",
          type: "ZIP",
          status: "Pending",
          date: "Apr 14, 2025",
          size: "15.7 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=ZIP",
        },
        {
          id: "doc5",
          title: "Witness Statement.docx",
          type: "DOCX",
          status: "Active",
          date: "Apr 17, 2025",
          size: "1.1 MB",
          thumbnail: "/placeholder.svg?height=200&width=150&text=DOCX",
        },
      ],
    },
  ]

  // Flatten documents for the all documents view
  const documents = cases.flatMap((c) => c.documents)

  // Get documents for the selected case
  const caseDocuments = selectedCase ? cases.find((c) => c.id === selectedCase)?.documents || [] : documents

  return (
    <DashboardShell>
      <DashboardHeader heading="Case Explorer" text="Browse and manage all your legal documents." />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar Filters */}
        <Card className="lg:w-64">
          <CardHeader>
            <CardTitle className="text-lg">Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant={selectedCase === null ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCase(null)}
            >
              All Documents
            </Button>

            <div className="space-y-2">
              {cases.map((caseItem) => (
                <Button
                  key={caseItem.id}
                  variant={selectedCase === caseItem.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCase(caseItem.id)}
                >
                  {caseItem.title}
                  <Badge className="ml-auto">{caseItem.documents.length}</Badge>
                </Button>
              ))}
            </div>

            <div className="pt-4 border-t mt-4">
              <h3 className="text-sm font-medium mb-2">Filters</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Document Type</h4>
                <div className="space-y-1">
                  {["PDF", "DOCX", "ZIP", "JPG"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <input type="checkbox" id={`type-${type}`} className="rounded" />
                      <label htmlFor={`type-${type}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>
                  {selectedCase ? `${cases.find((c) => c.id === selectedCase)?.title} Documents` : "All Documents"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documents..."
                      className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
              <CardDescription>{caseDocuments.length} documents found</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {caseDocuments.map((doc) => (
                    <Card
                      key={doc.id}
                      className={`card-hover cursor-pointer ${selectedDocument === doc.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedDocument(doc.id)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-[3/4] mb-3 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                          <img
                            src={doc.thumbnail || "/placeholder.svg"}
                            alt={doc.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium truncate">{doc.title}</h3>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>
                            {doc.type} • {doc.size}
                          </span>
                          <span>{doc.date}</span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              doc.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : doc.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {caseDocuments.map((doc) => (
                    <Card
                      key={doc.id}
                      className={`card-hover cursor-pointer ${selectedDocument === doc.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedDocument(doc.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-muted rounded-md overflow-hidden flex items-center justify-center h-12 w-12 flex-shrink-0">
                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{doc.title}</h3>
                            <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground mt-1">
                              <span>
                                {doc.type} • {doc.size}
                              </span>
                              <span>{doc.date}</span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full ${
                                  doc.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : doc.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-auto">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Document Detail Panel */}
        {selectedDocument && (
          <Card className="mt-4 lg:mt-0 lg:ml-4 lg:w-96">
            <CardHeader>
              <CardTitle className="text-lg">Document Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setSelectedDocument(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <DocumentDetail document={documents.find((doc) => doc.id === selectedDocument)!} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
