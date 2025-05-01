'use server'
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CaseFolder from "@/lib/models/CaseFolder";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { id: id, role: userRole } = session.user;

    if (userRole !== "lawyer") {
      return NextResponse.json({ error: "Unauthorized - Only lawyers can delete cases" }, { status: 401 });
    }

    await connectDB();

    // Find and delete the case
    const caseFolder = await CaseFolder.findOneAndDelete({
      _id: params.caseId,
      lawyerId: id
    });

    if (!caseFolder) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json(
      { error: "Error deleting case" },
      { status: 500 }
    );
  }
} 