"use client"

import { useEffect } from "react";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCaseFolderStore } from "@/store/caseFolderStore";
import CaseFilesManager from "./Files/CaseFolderManager";

// import { CalendarWidget } from "@/components/calendar-widget"
// import { CaseFolders } from "@/components/case-folders"
// import { CaseGraph } from "@/components/case-graph"
// import { ChatbotButton } from "@/components/chatbot-button"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { DashboardShell } from "@/components/dashboard-shell"
// import { FileUpload } from "@/components/file-upload"
// import { PDFPreview } from "@/components/pdf-preview-dialog"
// import { RecentUploads } from "@/components/recent-uploads"
// import { TimelineView } from "@/components/timeline-view"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { getAllDocuments } from "@/lib/api-helpers"
// import { Calendar, ChevronRight, FileText, Plus } from "lucide-react"
// import { useEffect, useState } from "react"

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
//   const [documents, setDocuments] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedFile, setSelectedFile] = useState<{ url: string; name: string } | null>(null)
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false)

//   useEffect(() => {
//     const loadDocuments = async () => {
//       try {
//         const data = await getAllDocuments();
//         setDocuments(data);
//       } catch (error) {
//         console.error('Failed to load documents:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (activeTab === "documents") {
//       loadDocuments();
//     }
//   }, [activeTab]);

//   return (
//     <DashboardShell>
//       <div className="relative">

//         <DashboardHeader heading="Dashboard" text="Manage your legal documents and cases.">
//           <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="shimmer-button bg-blue-600 hover:bg-blue-700">
//                 <Plus className="mr-2 h-4 w-4" /> Upload Document
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Upload Document</DialogTitle>
//                 <DialogDescription>
//                   Upload a PDF document to process and analyze
//                 </DialogDescription>
//               </DialogHeader>
//               <FileUpload onSuccess={() => setIsUploadDialogOpen(false)} />
//             </DialogContent>
//           </Dialog>
//         </DashboardHeader>
//       </div>



//       <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="cases">My Cases</TabsTrigger>
//           <TabsTrigger value="documents">Documents</TabsTrigger>
//           <TabsTrigger value="calendar">Calendar</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4 relative">

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <Card className="col-span-2">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
//                 <Button variant="ghost" size="sm" className="text-blue-500">
//                   <Calendar className="h-4 w-4 mr-1" /> Add Reminder
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <CalendarWidget />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
//                 <Button variant="ghost" size="sm" className="text-blue-500">
//                   View All <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <RecentUploads />
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-4 md:grid-cols-1">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Case Overview</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CaseGraph />
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Folders</CardTitle>
//                 <Button variant="ghost" size="sm" className="text-blue-500">
//                   <Plus className="h-4 w-4 mr-1" /> New Folder
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <CaseFolders />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Timeline View</CardTitle>
//                 <Button variant="ghost" size="sm" className="text-blue-500">
//                   View All <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <TimelineView />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="cases" className="space-y-4 relative">

//           <Card>
//             <CardHeader>
//               <CardTitle>My Cases</CardTitle>
//               <CardDescription>View and manage all your legal cases.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {[
//                   // {
//                   //   title: "Smith vs. Johnson",
//                   //   type: "Civil Dispute",
//                   //   status: "Active",
//                   //   documents: 12,
//                   //   nextDeadline: "May 15, 2025",
//                   // },
//                   // {
//                   //   title: "Property Acquisition",
//                   //   type: "Real Estate",
//                   //   status: "Pending",
//                   //   documents: 8,
//                   //   nextDeadline: "June 3, 2025",
//                   // },
//                   // {
//                   //   title: "Insurance Claim",
//                   //   type: "Insurance",
//                   //   status: "Active",
//                   //   documents: 5,
//                   //   nextDeadline: "April 28, 2025",
//                   // },
//                 ].map((caseItem, index) => (
//                   <Card key={index} className="card-hover">
//                     <CardContent className="p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-medium">{caseItem.title}</h3>
//                           <p className="text-sm text-muted-foreground">{caseItem.type}</p>
//                         </div>
//                         <div
//                           className={`px-2 py-1 rounded-full text-xs ${caseItem.status === "Active"
//                             ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                             : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//                             }`}
//                         >
//                           {caseItem.status}
//                         </div>
//                       </div>
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Documents:</span>
//                           <span>{caseItem.documents}</span>
//                         </div>
//                         <div className="flex justify- text-sm">
//                           <span className="text-muted-foreground">Next Deadline:</span>
//                           <span>{caseItem.nextDeadline}</span>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm" className="w-full mt-4">
//                         View Details
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="documents" className="space-y-4 relative">

//           <Card>
//             <CardHeader>
//               <CardTitle>Documents</CardTitle>
//               <CardDescription>All your legal documents in one place.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     <Button variant="outline" size="sm">
//                       All
//                     </Button>

//                     <Button variant="outline" size="sm">
//                       Recent
//                     </Button>
//                     <Button variant="outline" size="sm">
//                       Shared
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                   <Card className="col-span-full">
//                     <CardHeader>
//                       <CardTitle>Upload New Document</CardTitle>
//                       <CardDescription>Upload a PDF document to process and analyze</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <FileUpload onSuccess={() => loadDocuments()} />
//                     </CardContent>
//                   </Card>

//                   {loading ? (
//                     <div className="col-span-full text-center py-4">Loading documents...</div>
//                   ) : documents.length === 0 ? (
//                     <div className="col-span-full text-center py-4 text-muted-foreground">
//                       No documents uploaded yet.
//                     </div>
//                   ) : (
//                     documents.map((doc) => (
//                       <Card key={doc._id} className="card-hover">
//                         <CardContent className="p-4">
//                           <div className="flex items-start space-x-3">
//                             <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
//                               <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                             </div>
//                             <div className="flex-1">
//                               <h3 className="font-medium truncate">{doc.fileName}</h3>
//                               <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                                 <span>
//                                   From: {doc.folderName}
//                                 </span>
//                                 <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
//                               </div>
//                             </div>
//                           </div>
//                           {doc.summary && (
//                             <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
//                               {doc.summary}
//                             </p>
//                           )}
//                           <div className="flex justify-between mt-4">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => {
//                                 setSelectedFile({
//                                   url: doc.fileUrl,
//                                   name: doc.fileName
//                                 });
//                                 setIsPreviewOpen(true);
//                               }}
//                             >
//                               Preview
//                             </Button>
//                             <Button variant="ghost" size="sm">
//                               Download
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {selectedFile && (
//             <PDFPreview
//               isOpen={isPreviewOpen}
//               onClose={() => {
//                 setIsPreviewOpen(false);
//                 setSelectedFile(null);
//               }}
//               fileUrl={selectedFile.url}
//               fileName={selectedFile.name}
//             />
//           )}
//         </TabsContent>

//         <TabsContent value="calendar" className="space-y-4 relative">

//           <Card>
//             <CardHeader>
//               <CardTitle>Calendar</CardTitle>
//               <CardDescription>Track important dates and deadlines.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[500px]">
//                 <CalendarWidget fullSize />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <ChatbotButton />
//     </DashboardShell>
//   )
// }




// export default function PostingCase() { {

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     caseNumber: '',
//     status: 'active',
//     priority: 'medium',
//     clientId: '',
//     nextHearingDate: '',
//     courtName: '',
//     judgeName: '',
//   });

//   const router = useRouter();
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const res = await fetch('/api/cases', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           ...form,
//           documents: [],
//           notes: [],
//           nextHearingDate: form.nextHearingDate ? new Date(form.nextHearingDate) : undefined,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || 'Something went wrong');
//       }

//       setSuccess('Case created successfully!');
//       router.refresh(); // optional: refresh the page or navigate
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };



//   return (
//     <div>
//       <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-4">Create Case Folder</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="text" name="caseNumber" placeholder="Case Number" value={form.caseNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
        
//         <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
//           <option value="active">Active</option>
//           <option value="closed">Closed</option>
//           <option value="pending">Pending</option>
//         </select>

//         <select name="priority" value={form.priority} onChange={handleChange} className="w-full p-2 border rounded">
//           <option value="high">High</option>
//           <option value="medium">Medium</option>
//           <option value="low">Low</option>
//         </select>

//         <input type="text" name="clientId" placeholder="Client ID" value={form.clientId} onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="date" name="nextHearingDate" value={form.nextHearingDate} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="courtName" placeholder="Court Name" value={form.courtName} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="judgeName" placeholder="Judge Name" value={form.judgeName} onChange={handleChange} className="w-full p-2 border rounded" />

//         {error && <p className="text-red-600">{error}</p>}
//         {success && <p className="text-green-600">{success}</p>}

//         <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">Create Case</button>
//       </form>
//     </div>
//     </div>
//   )
// }

// }

// export default function GetingCases() {
//   const [cases, setCases] = useState([]);

//   useEffect(() => {
//     const fetchCases = async () => {
//       const res = await fetch('/api/cases');
//       const data = await res.json();
//       setCases(data);
//     };
//     fetchCases();
//   }, []);

//   return (
//     <div>
//       <h1>Cases</h1>
//       {cases.map((caseItem) => (
//         <div key={caseItem._id}>{caseItem.title}</div>
//       ))}
//     </div>
//   )
// }

export default function GetingCases() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const { data: session } = useSession();
  const {
    cases,
    setCases,
    updateCase,
    deleteCase: removeCase,
  } = useCaseFolderStore();

  useEffect(() => {
    const fetchCases = async () => {
      const res = await fetch('/api/cases', {
        next: { tags: ['cases'], revalidate: 60 }, // ⬅️ tag-based cache + revalidate
        credentials: 'include',
        cache: 'force-cache', // or 'default' (force-cache works with revalidate)
      });

      if (!res.ok) {
        console.error('Failed to fetch cases');
        return;
      }

      const data = await res.json();
      setCases(data);
      console.log(data);
    };

    if (cases.length === 0) fetchCases(); // prevent re-fetch if already stored
  }, [setCases, cases.length]);

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this case?');
    if (!confirmed) return;

    const res = await fetch(`/api/cases/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      removeCase(id);
      setSelectedCase(null);
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/cases/${selectedCase._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...selectedCase,
        lawyerId: undefined,
        clientId: undefined,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      updateCase(updated._id, updated);
      setEditMode(false);
    }
  };

  const handleChange = (e) => {
    setSelectedCase({
      ...selectedCase,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Case Folders</h1>

      <ul className="space-y-2">
        {cases.map((caseItem) => (
          <li
            key={caseItem._id}
            onClick={() => {
              setSelectedCase(caseItem);
              setEditMode(false);
            }}
            className="cursor-pointer p-3 border rounded hover:bg-gray-100"
          >
            {caseItem.title}
          </li>
        ))}
      </ul>

      {selectedCase && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Case Details</h2>

          {editMode ? (
            <div className="space-y-3 mt-2">
              <input
                name="title"
                value={selectedCase.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={selectedCase.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="caseNumber"
                value={selectedCase.caseNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={selectedCase.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
              <select
                name="priority"
                value={selectedCase.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                name="courtName"
                value={selectedCase.courtName || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="judgeName"
                value={selectedCase.judgeName || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="nextHearingDate"
                type="date"
                value={
                  selectedCase.nextHearingDate
                    ? new Date(selectedCase.nextHearingDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <div className="flex gap-2">
                <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <p><strong>Title:</strong> {selectedCase.title}</p>
              <p><strong>Description:</strong> {selectedCase.description}</p>
              <p><strong>Case Number:</strong> {selectedCase.caseNumber}</p>
              <p><strong>Status:</strong> {selectedCase.status}</p>
              <p><strong>Priority:</strong> {selectedCase.priority}</p>
              <p><strong>Court Name:</strong> {selectedCase.courtName}</p>
              <p><strong>Judge Name:</strong> {selectedCase.judgeName}</p>
              <p><strong>Next Hearing Date:</strong> {selectedCase.nextHearingDate?.slice(0, 10)}</p>
              <p><strong>Client ID:</strong> {selectedCase.clientId?._id || selectedCase.clientId}</p>
              <p><strong>Lawyer ID:</strong> {selectedCase.lawyerId}</p>

              {session?.user?.role === 'lawyer' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(selectedCase._id)} className="bg-red-600 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </div>
              )}
              <button onClick={() => {
                  !showFiles ? setShowFiles(true) : setShowFiles(false)
              }}>
                {showFiles ? "Hide Files" : "Show Files"}
              </button>
                {showFiles && <CaseFilesManager caseId={selectedCase._id} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

