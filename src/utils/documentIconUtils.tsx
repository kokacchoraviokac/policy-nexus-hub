
import React from "react";
import { FileText, FileImage, FileSpreadsheet, File } from "lucide-react";

export const getDocumentIcon = (filePath: string, mimeType?: string) => {
  const path = filePath.toLowerCase();
  
  // Check file extension first
  if (path.endsWith('.pdf')) {
    return <FileText className="h-5 w-5 text-red-500" />;
  } else if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  } else if (path.endsWith('.xls') || path.endsWith('.xlsx') || path.endsWith('.csv')) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  }
  
  // If no match by extension, try MIME type if available
  if (mimeType) {
    if (mimeType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (mimeType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    }
  }
  
  // Default icon
  return <File className="h-5 w-5 text-gray-500" />;
};
