import { CaseFolder } from '@/lib/models/case-folder';
import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Aggregate pipeline to get recent documents across all folders
    const recentDocs = await CaseFolder.aggregate([
      // Unwind documents array to get individual documents
      { $unwind: '$documents' },
      // Sort by document's uploadDate
      { $sort: { 'documents.uploadDate': -1 } },
      // Limit results
      { $limit: limit },
      // Project needed fields
      {
        $project: {
          folderName: '$name',
          folderId: '$_id',
          document: '$documents'
        }
      }
    ]);

    return NextResponse.json(recentDocs);
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent documents' },
      { status: 500 }
    );
  }
} 