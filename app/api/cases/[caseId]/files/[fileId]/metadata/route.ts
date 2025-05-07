import {NextResponse,NextRequest} from "next/server";
import connectDB from "@/lib/mongodb";
import{getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import DocumentMetadata from "@/lib/models/DocumentsMetadata";
import Document from "@/lib/models/Documents";
import processDocumentWithGemini from "@/app/api/analyser-ap/utils";
import { revalidatePath } from "next/cache";




export async function POST(req:NextRequest){
    const url = new URL(req.url);
    const  caseId = url.pathname.split("/")[3];
    const fileId = url.pathname.split("/")[5];
    const metadataId = url.pathname.split("/")[7];
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("file") as File;
  
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      const metadataJSON = await processDocumentWithGemini(buffer, file.type);
      const metadata = JSON.parse(metadataJSON);
  
      const savedMetadata = await DocumentMetadata.create({
        ...metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      await Document.findByIdAndUpdate(fileId, {
        $push: {
          metadata: savedMetadata._id,
        },
      });
      console.log("DocumentMetadata updated and document updated with Id successfully");
      revalidatePath(`/cases/${caseId}/files/`);
  
      return NextResponse.json(savedMetadata, { status: 200 });
  }
    catch (error) {
      console.error("Error processing document:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
  