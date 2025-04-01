import { enhancedExtractTextFromFile, ENABLE_ENHANCED_EXTRACTION } from "./enhancedDocumentExtraction";

export const extractTextFromFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Use the enhanced extraction if it's enabled
  if (ENABLE_ENHANCED_EXTRACTION) {
    return enhancedExtractTextFromFile(file);
  }

  // Otherwise, use the current simple extraction logic
  // Handle text files directly
  if (file.type === "text/plain") {
    return await file.text();
  }

  // For PDF files, we would need to use a PDF.js or similar library
  // This is a simplified version that works for text and simple formats
  // For a production app, you would want to integrate proper PDF parsing
  
  if (file.type === "application/pdf") {
    // In a real implementation, use PDF.js to extract text
    // For now, we'll return a message
    return "PDF text extraction would be implemented with PDF.js or similar library.";
  }

  // For docx files, would need specific libraries
  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return "DOCX text extraction would be implemented with specific libraries.";
  }

  // For other file types, we can return a placeholder
  return `Text extraction not supported for file type: ${file.type}`;
};
