import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  try {
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/pdf' });
    
    // Load the PDF
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    
    return docs.map(doc => doc.pageContent).join('\n\n');
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}