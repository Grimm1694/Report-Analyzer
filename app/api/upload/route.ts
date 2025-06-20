import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { processMedicalReport } from '@/lib/groq-service';
import { extractTextFromPdf } from '@/lib/pdf-utils'; // You'll need to implement this

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }

    // For PDF files, extract text
    let documentText = '';
    if (file.type === 'application/pdf') {
      const bytes = await file.arrayBuffer();
      documentText = await extractTextFromPdf(bytes);
    } else {
      // For image files (JPEG/PNG), you'll need OCR processing
      // You'll need to implement this or use a service
      return NextResponse.json({ error: 'Image processing not implemented yet' }, { status: 400 });
    }

    // Process the extracted text
    const analysisResult = await processMedicalReport([{ text: documentText }]);

    return NextResponse.json({
      report: analysisResult
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'File processing failed' }, 
      { status: 500 }
    );
  }
}