
import React from "react";
import { 
  FileText, 
  FileImage, 
  File,
  FileSpreadsheet, 
  FileArchive, 
  FileCode
} from "lucide-react";

export const getDocumentIcon = (
  filePath: string,
  mimeType?: string
): React.ReactNode => {
  // Helper to determine icon based on extension and mime type
  const getIconByType = (ext: string, mime?: string): React.ReactNode => {
    ext = ext.toLowerCase();
    
    // Check mime type first if available
    if (mime) {
      if (mime.startsWith('image/')) {
        return <FileImage className="h-10 w-10 text-blue-500" />;
      }
      if (mime === 'application/pdf') {
        return <File className="h-10 w-10 text-red-500" />;
      }
      if (mime.includes('spreadsheet') || mime.includes('excel')) {
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      }
      if (mime.includes('zip') || mime.includes('compressed')) {
        return <FileArchive className="h-10 w-10 text-yellow-500" />;
      }
      if (mime.includes('html') || mime.includes('javascript') || mime.includes('xml')) {
        return <FileCode className="h-10 w-10 text-purple-500" />;
      }
    }
    
    // Fallback to extension check
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    }
    if (ext === 'pdf') {
      return <File className="h-10 w-10 text-red-500" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return <FileArchive className="h-10 w-10 text-yellow-500" />;
    }
    if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml'].includes(ext)) {
      return <FileCode className="h-10 w-10 text-purple-500" />;
    }
    
    // Default icon
    return <FileText className="h-10 w-10 text-gray-500" />;
  };
  
  // Extract extension from file path
  const extension = filePath.split('.').pop() || '';
  
  return getIconByType(extension, mimeType);
};
