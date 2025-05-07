  'use server'
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CaseFolder from "@/lib/models/CaseFolder";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidateTag, revalidatePath } from "next/cache";
import Document from "@/lib/models/Documents";
import DocumentsMetadata from "@/lib/models/DocumentsMetadata";
import { gfsBucket } from "@/lib/mongodb";
import mongoose from "mongoose";
// GET /api/cases/[caseId] - Get a specific case
export async function GET(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { id: id, role: userRole } = session.user;

    await connectDB();

    const caseFolder = await CaseFolder.findOne({
      _id: params.caseId,
      $or: [
        { lawyerId: userRole === "lawyer" ? id : null },
        { clientId: userRole === "client" ? id : null }
      ]
    }).populate(
      userRole === "lawyer" 
        ? { path: "clientId", select: "name email" }
        : { path: "lawyerId", select: "name email" }
    );

    if (!caseFolder) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseFolder);
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { error: "Error fetching case" },
      { status: 500 }
    );
  }
}

// PUT /api/cases/[caseId] - Update a case
export async function PUT(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { id: id, role: userRole } = session.user;

    if (userRole !== "lawyer") {
      return NextResponse.json({ error: "Unauthorized - Only lawyers can update cases" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      status,
      priority,
      nextHearingDate,
      courtName,
      judgeName
    } = body;

    await connectDB();

    // Find and update the case
    const caseFolder = await CaseFolder.findOneAndUpdate(
      {
        _id: params.caseId,
        lawyerId: id
      },
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          ...(priority && { priority }),
          ...(nextHearingDate && { nextHearingDate }),
          ...(courtName && { courtName }),
          ...(judgeName && { judgeName }),
          updatedAt: new Date()
        }
      },
      { new: true }
    ).populate("clientId", "name email");

    if (!caseFolder) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    revalidateTag('cases');
    revalidatePath('/dashboard');

    return NextResponse.json(caseFolder);
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      { error: "Error updating case" },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[caseId] - Delete a case
export async function DELETE(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
  }

  const { id, role } = session.user;
  if (role !== "lawyer") {
    return NextResponse.json({ error: "Unauthorized - Only lawyers can delete cases" }, { status: 403 });
  }

  await connectDB();

  const sessionMongo = await mongoose.startSession();
  sessionMongo.startTransaction();

  try {
    // 1. Find related documents
    const documents = await Document.find({ caseId: params.caseId }).session(sessionMongo);

    const fileIds = documents.map(doc => doc.fileId);
    const metadataIds = documents.map(doc => doc.metadataId); // assuming 'metadataId' field exists

    // 2. Delete from DocumentMetadata
    await DocumentsMetadata.deleteMany({ _id: { $in: metadataIds } }).session(sessionMongo);

    // 3. Delete from Document
    await Document.deleteMany({ caseId: params.caseId }).session(sessionMongo);

    // 4. Delete CaseFolder
    const deletedCase = await CaseFolder.findOneAndDelete({
      _id: params.caseId,
      lawyerId: id
    }).session(sessionMongo);

    if (!deletedCase) {
      await sessionMongo.abortTransaction();
      sessionMongo.endSession();
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // 5. Commit transaction
    await sessionMongo.commitTransaction();
    sessionMongo.endSession();

    // 6. Delete from GridFS (outside transaction)
    for (const fileId of fileIds) {
      try {
        await gfsBucket!.delete(fileId);
      } catch (err) {
        console.error(`Failed to delete file ${fileId} from GridFS`, err);
        // Log for retry
      }
    }

    revalidateTag('cases');
    revalidatePath('/dashboard');

    return NextResponse.json({ message: "Case and associated files deleted successfully" });
  } catch (error) {
    await sessionMongo.abortTransaction();
    sessionMongo.endSession();
    console.error("Error deleting case:", error);
    return NextResponse.json({ error: "Error deleting case" }, { status: 500 });
  }
}
