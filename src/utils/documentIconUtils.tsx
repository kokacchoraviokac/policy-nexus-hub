
import { FileText, FileImage, File, FileArchive, FileCode, FileMusic, FileVideo } from "lucide-react";
import React from "react";

export const getDocumentIcon = (filePath?: string, mimeType?: string | null) => {
  // If mimetype is provided, use it to determine icon
  if (mimeType) {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    }
    if (mimeType === 'application/pdf') {
      return <FileText className="h-10 w-10 text-red-500" />;
    }
    if (mimeType.startsWith('audio/')) {
      return <FileMusic className="h-10 w-10 text-purple-500" />;
    }
    if (mimeType.startsWith('video/')) {
      return <FileVideo className="h-10 w-10 text-pink-500" />;
    }
    if (mimeType.startsWith('text/')) {
      return <FileText className="h-10 w-10 text-green-500" />;
    }
    if (mimeType.includes('zip') || mimeType.includes('compress')) {
      return <FileArchive className="h-10 w-10 text-amber-500" />;
    }
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('json')) {
      return <FileCode className="h-10 w-10 text-cyan-500" />;
    }
  }
  
  // Fallback to file extension
  if (filePath) {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="h-10 w-10 text-blue-500" />;
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-10 w-10 text-green-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive className="h-10 w-10 text-amber-500" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FileMusic className="h-10 w-10 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'webm':
        return <FileVideo className="h-10 w-10 text-pink-500" />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'json':
        return <FileCode className="h-10 w-10 text-cyan-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  }
  
  // Default icon
  return <File className="h-10 w-10 text-gray-500" />;
};
