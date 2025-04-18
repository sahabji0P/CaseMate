import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { CaseFolder } from '@/lib/models/case-folder';

// GET all case folders
export async function GET() {
  try {
    await connectDB();
    const caseFolders = await CaseFolder.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(caseFolders);
  } catch (error) {
    console.error('Error fetching case folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case folders' },
      { status: 500 }
    );
  }
}

// POST a new case folder
export async function POST(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, description, caseNumber, caseTitle } = body;
    
    if (!name) {
      console.log('Missing required field: name');
      return NextResponse.json(
        { error: 'Case folder name is required' },
        { status: 400 }
      );
    }
    
    console.log('Creating new case folder with data:', {
      name,
      description,
      caseNumber,
      caseTitle
    });
    
    // Create a new case folder with empty documents array
    const caseFolder = await CaseFolder.create({
      name,
      description,
      caseNumber,
      caseTitle,
      documents: [],
      importantDates: []
    });
    
    console.log('Case folder created successfully:', caseFolder);
    
    return NextResponse.json(caseFolder, { status: 201 });
  } catch (error) {
    console.error('Error creating case folder:', error);
    return NextResponse.json(
      { error: 'Failed to create case folder' },
      { status: 500 }
    );
  }
} 