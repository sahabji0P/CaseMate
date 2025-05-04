import { NextRequest, NextResponse } from "next/server";
import connectDB, { gfsBucket } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Document from "@/lib/models/Documents";
import { Readable } from "stream";

// GET: Download a specific file
export async function GET(req: NextRequest)  {
  const url = new URL(req.url);
  const caseId = url.pathname.split("/")[3];
  const fileId = url.pathname.split("/")[5];
  try {
 
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fileID =  mongoose.Types.ObjectId.createFromHexString(fileId);

    const fileRecord = await gfsBucket!.find({ _id: fileID }).toArray();
    if (!fileRecord || fileRecord.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stream = gfsBucket!.openDownloadStream(fileID);
    const chunks: Buffer[] = [];

    return await new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const headers = new Headers();
        headers.set("Content-Type", fileRecord[0].contentType || "application/octet-stream");
        headers.set("Content-Disposition", `attachment; filename="${fileRecord[0].filename}"`);

        resolve(new NextResponse(buffer, { status: 200, headers }));
      });
      stream.on("error", (err) => {
        console.error("Download error:", err);
        reject(NextResponse.json({ error: "Error reading file stream" }, { status: 500 }));
      });
    });
  } catch(error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove file from GridFS and Document collection
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const caseId = url.pathname.split("/")[3];
  const fileId = url.pathname.split("/")[5];

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fileID =  mongoose.Types.ObjectId.createFromHexString(fileId);

    // Remove file from GridFS
    await gfsBucket!.delete(fileID);

    // Remove metadata record
    await Document.deleteOne({ fileId: fileID });

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch(error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
