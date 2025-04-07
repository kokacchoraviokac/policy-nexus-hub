
import React from "react";
import { 
  FileText, FileImage, FileArchive, FileBadge, FileCode, 
  FileJson, File, FileSpreadsheet 
} from "lucide-react";
import { Document, DocumentCategory } from "@/types/documents";

/**
 * Get an appropriate icon based on the document type or mime type
 */
export function getDocumentIcon(document: Document): React.ReactNode {
  const { document_type, mime_type } = document;

  if (mime_type) {
    if (mime_type.includes('image')) {
      return <FileImage className="h-5 w-5" />;
    } else if (mime_type.includes('pdf')) {
      return <FileBadge className="h-5 w-5" />;
    } else if (mime_type.includes('zip') || mime_type.includes('rar')) {
      return <FileArchive className="h-5 w-5" />;
    } else if (mime_type.includes('json')) {
      return <FileJson className="h-5 w-5" />;
    } else if (mime_type.includes('html') || mime_type.includes('javascript')) {
      return <FileCode className="h-5 w-5" />;
    } else if (mime_type.includes('spreadsheet') || mime_type.includes('excel') || mime_type.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5" />;
    }
  }

  // Fallback to document_type if mime_type is not useful
  if (document_type) {
    if (document_type.toLowerCase().includes('policy')) {
      return <FileBadge className="h-5 w-5" />;
    } else if (document_type.toLowerCase().includes('image')) {
      return <FileImage className="h-5 w-5" />;
    } else if (document_type.toLowerCase().includes('contract')) {
      return <FileText className="h-5 w-5" />;
    } else if (document_type.toLowerCase().includes('report') || document_type.toLowerCase().includes('spreadsheet')) {
      return <FileSpreadsheet className="h-5 w-5" />;
    }
  }

  // Default fallback
  return <File className="h-5 w-5" />;
}

/**
 * Get user-friendly label for document type
 */
export function getDocumentTypeLabel(documentType: string): string {
  const typeMap: Record<string, string> = {
    "policy": "Policy Document",
    "certificate": "Certificate",
    "invoice": "Invoice",
    "contract": "Contract",
    "report": "Report",
    "quote": "Quote",
    "claim": "Claim Document",
    "addendum": "Addendum",
    "image": "Image",
    "other": "Other",
    // Add more document types as needed
  };

  return typeMap[documentType.toLowerCase()] || documentType;
}

/**
 * Document category options for forms
 */
export const documentCategories = [
  { label: "policyDocument", value: DocumentCategory.POLICY },
  { label: "claimDocument", value: DocumentCategory.CLAIM },
  { label: "salesDocument", value: DocumentCategory.SALES },
  { label: "financial", value: DocumentCategory.FINANCIAL },
  { label: "legal", value: DocumentCategory.LEGAL },
  { label: "contract", value: DocumentCategory.CONTRACT },
  { label: "invoice", value: DocumentCategory.INVOICE },
  { label: "miscellaneous", value: DocumentCategory.MISCELLANEOUS },
  { label: "other", value: DocumentCategory.OTHER },
  { label: "lien", value: DocumentCategory.LIEN },
  { label: "notification", value: DocumentCategory.NOTIFICATION },
  { label: "correspondence", value: DocumentCategory.CORRESPONDENCE },
];

/**
 * Document type options for forms
 */
export const supportedDocumentTypes = [
  { label: "policyDocument", value: "policy" },
  { label: "certificate", value: "certificate" },
  { label: "invoice", value: "invoice" },
  { label: "contract", value: "contract" },
  { label: "report", value: "report" },
  { label: "quote", value: "quote" },
  { label: "claim", value: "claim" },
  { label: "addendum", value: "addendum" },
  { label: "image", value: "image" },
  { label: "other", value: "other" },
];
