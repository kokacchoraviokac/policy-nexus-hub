
import React from 'react';
import { 
  FileText, FileIcon, FileImage, FileArchive, FileCog, 
  FileCode, FileJson, FileSpreadsheet, FileCheck, File
} from 'lucide-react';
import { DocumentCategory, EntityType } from '@/types/common';

/**
 * Get the icon component for a document type
 * @param mimeType MIME type of the document
 * @returns The icon component
 */
export const getDocumentIcon = (mimeType: string | null) => {
  if (!mimeType) return <FileIcon className="h-8 w-8" />;
  
  if (mimeType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
  if (mimeType.includes('image')) return <FileImage className="h-8 w-8 text-blue-500" />;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive className="h-8 w-8 text-orange-500" />;
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || mimeType.includes('xlsx') || mimeType.includes('xls')) {
    return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
  }
  if (mimeType.includes('word') || mimeType.includes('document') || mimeType.includes('docx') || mimeType.includes('doc')) {
    return <FileText className="h-8 w-8 text-blue-500" />;
  }
  if (mimeType.includes('text') || mimeType.includes('txt')) return <FileText className="h-8 w-8 text-gray-500" />;
  if (mimeType.includes('json')) return <FileJson className="h-8 w-8 text-yellow-500" />;
  if (mimeType.includes('code') || mimeType.includes('xml') || mimeType.includes('html')) {
    return <FileCode className="h-8 w-8 text-purple-500" />;
  }
  
  return <File className="h-8 w-8 text-gray-500" />;
};

/**
 * Get a human-readable label for a document category
 * @param category Document category
 * @returns The human-readable label
 */
export const getDocumentCategoryLabel = (category: string | undefined) => {
  if (!category) return 'Uncategorized';
  
  switch (category) {
    case DocumentCategory.POLICY:
      return 'Policy Document';
    case DocumentCategory.CLAIM:
      return 'Claim Document';
    case DocumentCategory.INVOICE:
      return 'Invoice Document';
    case DocumentCategory.CONTRACT:
      return 'Contract';
    case DocumentCategory.SALES:
      return 'Sales Document';
    case DocumentCategory.LEGAL:
      return 'Legal Document';
    case DocumentCategory.MISCELLANEOUS:
      return 'Miscellaneous';
    case DocumentCategory.AUTHORIZATION:
      return 'Authorization';
    case DocumentCategory.GENERAL:
      return 'General Document';
    case DocumentCategory.PROPOSAL:
      return 'Proposal';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

/**
 * Get a human-readable label for a document type
 * @param type Document type
 * @returns The human-readable label
 */
export const getDocumentTypeLabel = (type: string) => {
  if (!type) return 'Unknown Type';
  
  // Remove underscores and capitalize each word
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get a human-readable label for an entity type
 * @param entityType Entity type
 * @returns The human-readable label
 */
export const getEntityTypeLabel = (entityType: string | undefined) => {
  if (!entityType) return 'Unknown Entity';
  
  switch (entityType) {
    case EntityType.POLICY:
      return 'Policy';
    case EntityType.CLAIM:
      return 'Claim';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'Sales Process';
    case EntityType.CLIENT:
      return 'Client';
    case EntityType.INSURER:
      return 'Insurer';
    case EntityType.AGENT:
      return 'Agent';
    case EntityType.INVOICE:
      return 'Invoice';
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return 'Policy Addendum';
    default:
      return entityType.charAt(0).toUpperCase() + entityType.slice(1);
  }
};
