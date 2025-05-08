"use server";

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/lib/models/Documents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { gfsBucket } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Readable } from "stream";
import { revalidatePath } from "next/cache";
import DocumentMetadata from "@/lib/models/DocumentsMetadata";

import processDocumentWithGemini from "@/app/api/analyser-ap/utils";
// GET: Get all documents for a caseId
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const caseId = url.pathname.split("/")[3];

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

   

    // Find all documents for this case
    const documents = await Document.find({ caseId }).populate("uploadedBy", "name email");

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Upload PDF document to GridFS and create Document entry
// POST: Upload PDF document to GridFS and create Document entry
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const caseId = url.pathname.split("/")[3];
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadStream = gfsBucket!.openUploadStream(file.name, {
      contentType: file.type,
    });

    const readableFile = Readable.from(buffer);
    readableFile.pipe(uploadStream);

    return await new Promise((resolve, reject) => {
      uploadStream.on("finish", async () => {
        try {
          // Save Document first
          const doc = new Document({
            caseId: new mongoose.Types.ObjectId(caseId),
            uploadedBy: new mongoose.Types.ObjectId(userId),
            fileId: uploadStream.id,
            originalName: file.name,
            fileType: file.type,
            fileSize: file.size,
            isSharedWithClient: false,
            uploadDate: new Date(),
          });

          const savedDoc = await doc.save();

          // Trigger async metadata generation
          // (async () => {
          //   try {
          //     const metadataJSON = await processDocumentWithGemini(buffer, file.type);
          //     const metadata = JSON.parse(metadataJSON);

          //     const savedMetadata = await DocumentMetadata.create({
          //       ...metadata,
          //       createdAt: new Date(),
          //       updatedAt: new Date(),
          //     });

          //     // Update Document with metadataId
          //     await Document.findByIdAndUpdate(savedDoc._id, {
          //       metadataId: savedMetadata._id,
          //     });
          //     console.log("Metadata generated and saved successfully ");
          //     revalidatePath(`api/cases/${caseId}`);
          //   } catch (err) {
          //     console.error("Metadata generation failed:", err);
          //     // Optional: log to error tracking service
          //   }
          // })();


          // ✅ Immediately return response
          revalidatePath(`/cases/${caseId}`);
          resolve(NextResponse.json(savedDoc, { fileId: uploadStream.id ,status: 201 }));
        } catch (err) {
          console.error("Error saving document:", err);
          reject(NextResponse.json({ error: "Failed to save document" }, { status: 500 }));
        }
      });

      uploadStream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
      });
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

