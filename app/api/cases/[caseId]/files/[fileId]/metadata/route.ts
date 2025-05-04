// 📁 app/api/cases/[caseId]/files/[fileId]/metadata/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import DocumentMetadata from '@/lib/models/DocumentsMetadata';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, context: { params: { caseId: string; fileId: string } }) {
  try {
    const url = new URL(req.url);
    const caseId = url.pathname.split("/")[3];
    const fileId = url.pathname.split("/")[5];

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const metadata = await DocumentMetadata.findOne({
      fileId: new mongoose.Types.ObjectId(fileId),
      caseId: new mongoose.Types.ObjectId(caseId),
    });

    if (!metadata) {
      return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
    }

    return NextResponse.json(metadata, { status: 200 });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
