
import React from "react";
import { 
  FileText,
  FileImage,
  FilePdf,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileX
} from "lucide-react";

export const getDocumentIcon = (filePath: string, mimeType?: string) => {
  const extension = filePath?.toLowerCase().split('.').pop() || '';

  // Use mime type first if available
  if (mimeType) {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FilePdf className="h-8 w-8 text-red-500" />;
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    } else if (mimeType.includes('zip') || mimeType.includes('compressed')) {
      return <FileArchive className="h-8 w-8 text-yellow-500" />;
    } else if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('html')) {
      return <FileCode className="h-8 w-8 text-purple-500" />;
    }
  }

  // Fallback to extension-based detection
  switch (extension) {
    case 'pdf':
      return <FilePdf className="h-8 w-8 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <FileImage className="h-8 w-8 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileArchive className="h-8 w-8 text-yellow-500" />;
    case 'js':
    case 'html':
    case 'css':
    case 'json':
      return <FileCode className="h-8 w-8 text-purple-500" />;
    default:
      return <FileText className="h-8 w-8 text-gray-500" />;
  }
};

export const getFileExtensionFromPath = (filePath: string): string => {
  if (!filePath) return '';
  return filePath.toLowerCase().split('.').pop() || '';
};
