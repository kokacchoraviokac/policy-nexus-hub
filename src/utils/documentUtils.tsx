
import React from 'react';
import { FileText, FileImage, FileArchive, FileCode, File, FileSpreadsheet } from 'lucide-react';
import { DocumentCategory, PolicyDocument } from '@/types/documents';

// Document type options for dropdowns
export const supportedDocumentTypes = [
  { value: 'policy', label: 'policy' },
  { value: 'invoice', label: 'invoice' },
  { value: 'amendment', label: 'amendment' },
  { value: 'contract', label: 'contract' },
  { value: 'certificate', label: 'certificate' },
  { value: 'claim', label: 'claim' },
  { value: 'legal', label: 'legal' },
  { value: 'correspondence', label: 'correspondence' },
  { value: 'report', label: 'report' },
  { value: 'other', label: 'other' }
];

// Document categories for dropdowns
export const documentCategories = [
  { value: 'policy', label: 'policy' },
  { value: 'claim', label: 'claim' },
  { value: 'client', label: 'client' },
  { value: 'invoice', label: 'invoice' },
  { value: 'claim_evidence', label: 'claimEvidence' },
  { value: 'medical', label: 'medical' },
  { value: 'legal', label: 'legal' },
  { value: 'financial', label: 'financial' },
  { value: 'lien', label: 'lien' },
  { value: 'notification', label: 'notification' },
  { value: 'correspondence', label: 'correspondence' },
  { value: 'other', label: 'other' }
];

// Get an appropriate icon based on mime type
export const getDocumentIcon = (document: PolicyDocument) => {
  if (document.mime_type?.includes('pdf')) {
    return <FileText className="h-6 w-6" />;
  } else if (document.mime_type?.includes('image')) {
    return <FileImage className="h-6 w-6" />;
  } else if (document.mime_type?.includes('zip') || document.mime_type?.includes('compressed')) {
    return <FileArchive className="h-6 w-6" />;
  } else if (document.mime_type?.includes('spreadsheet') || document.mime_type?.includes('excel')) {
    return <FileSpreadsheet className="h-6 w-6" />;
  } else if (document.mime_type?.includes('javascript') || document.mime_type?.includes('html')) {
    return <FileCode className="h-6 w-6" />;
  } else {
    return <File className="h-6 w-6" />;
  }
};

// Get a human-readable label for a document type
export const getDocumentTypeLabel = (type: string): string => {
  const typeOption = supportedDocumentTypes.find(option => option.value === type);
  return typeOption ? typeOption.label : type;
};

// Get a human-readable label for a document category
export const getCategoryLabel = (category?: DocumentCategory): string => {
  if (!category) return 'Other';
  const categoryOption = documentCategories.find(option => option.value === category);
  return categoryOption ? categoryOption.label : category;
};

// Format a file size to a human-readable string
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Get the file extension from a filename
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Check if a file is an image
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
};

// Check if a file is a PDF
export const isPdfFile = (filename: string): boolean => {
  return getFileExtension(filename).toLowerCase() === 'pdf';
};
