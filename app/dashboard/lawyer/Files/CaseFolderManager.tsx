"use client";

import { useEffect, useState } from "react";

interface FileRecord {
  _id: string;
  fileId: string;
  filename: string;
  contentType: string;
  uploadDate: string;
  caseId: string;
}

interface Metadata {
  [key: string]: any;
}

export default function CaseFilesManager({ caseId }: { caseId: string }) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    const res = await fetch(`/api/cases/${caseId}/files`);
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, [caseId]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setUploading(true);

    try {
      const res = await fetch(`/api/cases/${caseId}/files`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      await fetchFiles();
      form.reset();
    } catch (err) {
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    const res = await fetch(`/api/cases/${caseId}/files/${fileId}`);
    if (!res.ok) {
      alert("Download failed");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    const res = await fetch(`/api/cases/${caseId}/files/${fileId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    await fetchFiles();
  };

  const handleShowMetadata = async (fileId: string) => {
    try {
      const res = await fetch(
        `/api/cases/${caseId}/files/${fileId}/metadata`
      );

      if (!res.ok) {
        alert("Metadata not found");
        return;
      }

      const metadata: Metadata = await res.json();
      alert(JSON.stringify(metadata, null, 2)); // Replace with modal or UI later
    } catch (err) {
      alert("Error fetching metadata");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Case Files</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 flex items-center gap-4">
        <input
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="border px-2 py-1 rounded"
        />
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>

      {/* File Cards */}
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold break-words">
                  {file.filename}
                </h3>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(file.uploadDate).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDownload(file.fileId, file.filename)}
                  className="bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file.fileId)}
                  className="bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleShowMetadata(file.fileId)}
                  className="bg-gray-700 text-white text-sm py-2 rounded hover:bg-gray-800 transition"
                >
                  Show Metadata
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
