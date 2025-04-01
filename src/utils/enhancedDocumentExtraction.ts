
// Import pdf-parse correctly
const pdfParse = require('pdf-parse');

// Feature toggle - set to false by default
// This can be changed to true when you're ready to use the feature
export const ENABLE_ENHANCED_EXTRACTION = false;

/**
 * Extracts text from a PDF file using pdf-parse
 * @param file PDF file to extract text from
 * @returns Promise resolving to the extracted text
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(new Uint8Array(buffer)));
    return data.text || "No text could be extracted from this PDF.";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF. The file may be corrupted or password-protected.");
  }
};

/**
 * Performs OCR on an image file using Tesseract.js
 * @param file Image file to perform OCR on
 * @returns Promise resolving to the extracted text
 */
export const performOCR = async (file: File): Promise<string> => {
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker();
    const imageUrl = URL.createObjectURL(file);
    
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    
    const { data } = await worker.recognize(imageUrl);
    await worker.terminate();
    
    URL.revokeObjectURL(imageUrl);
    
    return data.text || "No text could be extracted using OCR.";
  } catch (error) {
    console.error("Error performing OCR:", error);
    throw new Error("Failed to perform OCR on the image.");
  }
};

/**
 * Determines if a file is a scanned PDF (likely an image without text)
 * This is a simplified heuristic and may need refinement based on your specific needs
 * @param pdfText The text extracted from the PDF
 * @returns Boolean indicating if the PDF appears to be a scan
 */
export const isScannedPdf = (pdfText: string): boolean => {
  // If the PDF has very little text or just whitespace, it might be a scan
  return !pdfText || pdfText.trim().length < 50;
};

/**
 * Enhanced file text extraction with PDF parsing and OCR capabilities
 * @param file File to extract text from
 * @returns Promise resolving to the extracted text
 */
export const enhancedExtractTextFromFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  // If enhanced extraction is disabled, return a message
  if (!ENABLE_ENHANCED_EXTRACTION) {
    return "Enhanced document extraction is currently disabled. Contact your administrator to enable this feature.";
  }

  // Handle text files directly
  if (file.type === "text/plain") {
    return await file.text();
  }

  // Handle PDFs with pdf-parse
  if (file.type === "application/pdf") {
    const pdfText = await extractTextFromPdf(file);
    
    // If the PDF appears to be a scan with little or no text, try OCR
    if (isScannedPdf(pdfText)) {
      try {
        return await performOCR(file);
      } catch (ocrError) {
        console.warn("OCR failed, returning limited PDF text:", ocrError);
        return pdfText || "Limited text could be extracted from this scanned PDF.";
      }
    }
    
    return pdfText;
  }

  // Handle image files with OCR
  if (file.type.startsWith("image/")) {
    return await performOCR(file);
  }

  // For docx files and others, return a placeholder for now
  // In a future enhancement, you could add support for more file types
  return `Text extraction not fully supported for file type: ${file.type}. Basic content may be available.`;
};
