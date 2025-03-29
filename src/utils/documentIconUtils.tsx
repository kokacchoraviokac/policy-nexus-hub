
import React from "react";
import { FileText, FileImage, FileSpreadsheet, FilePdf2 as FilePdf, FileCode, FileArchive, File } from "lucide-react";

export const getDocumentIcon = (filePath: string, mimeType?: string) => {
  const path = filePath.toLowerCase();
  
  // Check file extension first
  if (path.endsWith('.pdf')) {
    return <FilePdf className="h-5 w-5 text-red-500" />;
  } else if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif') || path.endsWith('.svg')) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  } else if (path.endsWith('.xls') || path.endsWith('.xlsx') || path.endsWith('.csv')) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  } else if (path.endsWith('.doc') || path.endsWith('.docx') || path.endsWith('.txt')) {
    return <FileText className="h-5 w-5 text-blue-700" />;
  } else if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.json')) {
    return <FileCode className="h-5 w-5 text-violet-500" />;
  } else if (path.endsWith('.zip') || path.endsWith('.rar') || path.endsWith('.7z')) {
    return <FileArchive className="h-5 w-5 text-amber-500" />;
  }
  
  // If no match by extension, try MIME type if available
  if (mimeType) {
    if (mimeType.includes('pdf')) {
      return <FilePdf className="h-5 w-5 text-red-500" />;
    } else if (mimeType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    } else if (mimeType.includes('word') || mimeType.includes('text')) {
      return <FileText className="h-5 w-5 text-blue-700" />;
    } else if (mimeType.includes('html') || mimeType.includes('javascript') || mimeType.includes('json')) {
      return <FileCode className="h-5 w-5 text-violet-500" />;
    } else if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) {
      return <FileArchive className="h-5 w-5 text-amber-500" />;
    }
  }
  
  // Default icon
  return <File className="h-5 w-5 text-gray-500" />;
};
