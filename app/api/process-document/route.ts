import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { CaseFolder } from '@/lib/models/case-folder';

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function processDocumentWithGemini(buffer: Buffer, mimeType: string): Promise<string> {
    try {
        // Use gemini-1.5-pro for all content types as it supports both text and vision
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const prompt = `You are a Legal‑AI assistant. Analyze the following case document and extract the information as specified below. 
IMPORTANT: Maintain the original language of the document in all extracted text - do not translate any content.

Return a single JSON object with the following fields. Use null for any fields not present. Dates should be in ISO 8601 format (YYYY‑MM‑DD).

{
  "documentType":          "Type of document in original language (e.g. Judgment/निर्णय, Petition/याचिका, etc.)",
  "petitionType":         "If petition, specify form in original language",
  "courtName":            "Name of court in original language",
  "bench":                ["Names of judges on bench in original language"],
  "caseTitle":            "Case title exactly as written in document",
  "caseNumber":           "Case/docket number exactly as written",
  "filedDate":            "Filing date in YYYY-MM-DD format",
  "dateOfJudgment":       "Judgment date in YYYY-MM-DD format",
  "caseStatus":           "Status in original language",
  "partiesInvolved": {
    "petitioner":         "Petitioner name(s) in original language",
    "respondent":         "Respondent name(s) in original language"
  },
  "advocates":            ["List of counsel/advocates in original language"],
  "legalIssues":          ["Key points of law/issues in original language"],
  "citations":            ["Case citations exactly as written"],
  "statutes":             ["Statutes/sections exactly as referenced"],
  "relevantRules":        ["Court rules/regulations as cited in original language"],
  "reliefSought":         "Remedy/relief claimed in original language",
  "verdict":              "Final verdict/order summary in original language",
  "damagesAwarded":       "Monetary relief amount if any, in original format",
  "deadlines":            ["Deadlines/compliance dates in original language"],
  "nextHearingDate":      "Next hearing date in YYYY-MM-DD format if mentioned",
  "keywords":             ["Keywords in original language"],
  "relatedCases":         ["Referenced cases exactly as written"]
}

IMPORTANT INSTRUCTIONS:
1. DO NOT translate any text from the document - keep all extracted text in its original language
2. Maintain original spellings, names, and numbers exactly as they appear
3. Only format dates into YYYY-MM-DD where explicitly mentioned
4. Ensure the JSON is valid and follows the exact structure shown above
5. Use null for any fields where information is not found in the document`;

        // For PDFs and images, we need to specify the mime type
        const parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: buffer.toString('base64')
                }
            }
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        // Validate that the response is valid JSON
        try {
            JSON.parse(text);
            return text;
        } catch (e) {
            // If the response isn't valid JSON, try to extract JSON from it
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return jsonMatch[0];
            }
            throw new Error('Failed to get valid JSON response from Gemini');
        }
    } catch (error) {
        console.error('Error in processDocumentWithGemini:', error);
        if (error instanceof Error && error.message.includes('404')) {
            throw new Error('The document processing service is temporarily unavailable. Please try again later.');
        }
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const caseFolderId = formData.get('caseFolderId') as string;
        const createNewFolder = formData.get('createNewFolder') === 'true';

        console.log('Request params:', {
            createNewFolder,
            caseFolderId,
            fileType: file?.type,
            fileName: file?.name
        });

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!caseFolderId) {
            return NextResponse.json({ error: 'Case folder ID is required' }, { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Process the document with Gemini
        const buffer = Buffer.from(await file.arrayBuffer());
        const resultJson = await processDocumentWithGemini(buffer, file.type);
        const metadata = JSON.parse(resultJson);

        console.log('Processed metadata:', metadata);

        // Generate a unique filename
        const timestamp = Date.now();
        const originalName = file.name;
        const fileExtension = originalName.split('.').pop();
        const fileName = `${timestamp}-${originalName}`;
        
        // In a real application, you would upload the file to a storage service
        // For now, we'll just store a placeholder URL
        const fileUrl = `/uploads/${fileName}`;

        // Create a document object
        const document = {
            name: fileName,
            originalName: originalName,
            fileType: file.type,
            fileSize: file.size,
            uploadDate: new Date(),
            metadata: metadata,
            fileUrl: fileUrl
        };

        // Find the case folder
        const caseFolder = await CaseFolder.findById(caseFolderId);
        
        if (!caseFolder) {
            return NextResponse.json({ error: 'Case folder not found' }, { status: 404 });
        }

        // Add the document to the folder
        caseFolder.documents.push(document);
        
        // Update case folder metadata if available
        if (metadata.caseNumber && !caseFolder.caseNumber) {
            caseFolder.caseNumber = metadata.caseNumber;
        }
        
        if (metadata.caseTitle && !caseFolder.caseTitle) {
            caseFolder.caseTitle = metadata.caseTitle;
        }
        
        if (metadata.nextHearingDate && (!caseFolder.nextHearingDate || new Date(metadata.nextHearingDate) > caseFolder.nextHearingDate)) {
            caseFolder.nextHearingDate = new Date(metadata.nextHearingDate);
        }
        
        // Add important dates
        if (metadata.deadlines && Array.isArray(metadata.deadlines)) {
            interface Deadline {
                date?: string | Date;
                description?: string;
                type?: string;
            }

            const newDeadlines = metadata.deadlines.map((deadline: string | Deadline) => {
                try {
                    // If deadline is already an object with date and description
                    if (typeof deadline === 'object' && deadline.date && deadline.description) {
                        return {
                            date: new Date(deadline.date),
                            description: deadline.description,
                            type: 'deadline'
                        };
                    }
                    
                    // If deadline is a string
                    return {
                        date: new Date(deadline as string),
                        description: deadline as string,
                        type: 'deadline'
                    };
                } catch (error) {
                    console.error('Error parsing deadline:', deadline, error);
                    return null;
                }
            }).filter((deadline: { date: Date; description: string; type: string } | null): deadline is { date: Date; description: string; type: string } => 
                deadline !== null && 
                deadline.date instanceof Date && 
                !isNaN(deadline.date.getTime())
            );
            
            if (newDeadlines.length > 0) {
                caseFolder.importantDates = [
                    ...caseFolder.importantDates || [],
                    ...newDeadlines
                ];
            }
        }
        
        try {
            await caseFolder.save();
            console.log('Case folder saved successfully with new document and dates');
        } catch (saveError) {
            console.error('Error saving case folder:', saveError);
            return NextResponse.json({ 
                error: 'Failed to save case folder', 
                details: saveError instanceof Error ? saveError.message : 'Unknown error'
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            caseFolder,
            document
        });
    } catch (error) {
        console.error('Error processing document:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process document' },
            { status: 500 }
        );
    }
} 