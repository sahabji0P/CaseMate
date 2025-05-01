"use server"
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CaseFolder from "@/lib/models/CaseFolder";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/cases - Get all cases for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { id: id, role: userRole } = session.user;

    await connectDB();

    // Find cases where the user is either the lawyer or client
    const cases = await CaseFolder.find({
      $or: [
        { lawyerId: userRole === "lawyer" ? id : null },
        { clientId: userRole === "client" ? id : null }
      ]
    }).populate(
      userRole === "lawyer" 
        ? { path: "clientId", select: "name email" }
        : { path: "lawyerId", select: "name email" }
    ).sort({ createdAt: -1 });

    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Error fetching cases" },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create a new case
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { id: id, role: userRole } = session.user;
    console.log(id, userRole);
    if (userRole !== "lawyer") {
      return NextResponse.json({ error: "Unauthorized - Only lawyers can create cases" }, { status: 401 });
    }

    await connectDB();

    const { title, description, clientId, caseNumber, nextHearingDate, courtName, judgeName, status, priority, notes, documents } = await req.json();

    if (!title || !description || !clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const caseFolder = new CaseFolder({
      title,
      description,
      caseNumber: caseNumber || undefined,
      clientId,
      lawyerId: id,
      nextHearingDate: nextHearingDate || undefined,
      courtName: courtName || undefined,
      judgeName: judgeName || undefined,
      status: status || 'active',
      priority: priority || 'medium',
      notes: notes || [],
      documents: documents || []
    });

    await caseFolder.save();

    return NextResponse.json(caseFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Error creating case" },
      { status: 500 }
    );
  }
}
