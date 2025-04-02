
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { FileText, Clipboard, File, Receipt, Info, FileBox, FilePlus, FileCode, Calendar } from "lucide-react";
import React from "react";

export const getDocumentIcon = (document: Document | { category: DocumentCategory }) => {
  // First check by mime type if available
  if ('mime_type' in document) {
    if (document.mime_type?.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (document.mime_type?.includes('image')) {
      return <FileBox className="h-6 w-6 text-blue-500" />;
    } else if (document.mime_type?.includes('excel') || document.mime_type?.includes('spreadsheet')) {
      return <FileCode className="h-6 w-6 text-green-600" />;
    }
  }
  
  // Then fallback to category
  switch (document.category) {
    case 'policy':
      return <FileText className="h-6 w-6 text-primary" />;
    case 'claim':
      return <Clipboard className="h-6 w-6 text-amber-500" />;
    case 'invoice':
      return <Receipt className="h-6 w-6 text-purple-500" />;
    case 'client':
      return <File className="h-6 w-6 text-blue-500" />;
    case 'lien':
      return <Calendar className="h-6 w-6 text-green-500" />;
    case 'notification':
      return <FilePlus className="h-6 w-6 text-orange-500" />;
    default:
      return <Info className="h-6 w-6 text-gray-500" />;
  }
};

export const supportedDocumentTypes = [
  { value: 'policy', label: 'policy' },
  { value: 'certificate', label: 'certificate' },
  { value: 'invoice', label: 'invoice' },
  { value: 'claim', label: 'claim' },
  { value: 'report', label: 'report' },
  { value: 'contract', label: 'contract' },
  { value: 'amendment', label: 'amendment' },
  { value: 'correspondence', label: 'correspondence' },
  { value: 'other', label: 'other' }
];

export const documentCategories = [
  { value: 'policy', label: 'policy' },
  { value: 'claim', label: 'claim' },
  { value: 'client', label: 'client' },
  { value: 'invoice', label: 'invoice' },
  { value: 'lien', label: 'lien' },
  { value: 'notification', label: 'notification' },
  { value: 'other', label: 'other' }
];

export const salesProcessStages = [
  { value: 'discovery', label: 'discovery' },
  { value: 'quote', label: 'quoteManagement' },
  { value: 'proposal', label: 'proposals' },
  { value: 'contract', label: 'contracts' },
  { value: 'closeout', label: 'closeout' }
];

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
};
