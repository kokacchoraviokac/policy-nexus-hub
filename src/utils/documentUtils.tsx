
import { Document, DocumentCategory, EntityType, DocumentApprovalStatus } from "@/types/documents";
import { FileText, Clipboard, File, Receipt, Info } from "lucide-react";
import React from "react";

export const getDocumentIcon = (document: Document | { category: DocumentCategory }) => {
  switch (document.category) {
    case 'policy':
      return <FileText className="h-4 w-4" />;
    case 'claim':
      return <Clipboard className="h-4 w-4" />;
    case 'invoice':
      return <Receipt className="h-4 w-4" />;
    case 'identification':
      return <File className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

export const getDocumentTypeLabel = (documentType: string): string => {
  const documentTypes: Record<string, string> = {
    'policy': 'Policy Document',
    'certificate': 'Certificate',
    'invoice': 'Invoice',
    'claim': 'Claim Document',
    'report': 'Report',
    'contract': 'Contract',
    'amendment': 'Amendment',
    'correspondence': 'Correspondence',
    'other': 'Other'
  };
  
  return documentTypes[documentType] || documentType;
};

export const getDocumentDownloadUrl = async (filePath: string): Promise<string> => {
  try {
    const { data, error } = await fetch(`/api/documents/signed-url?path=${encodeURIComponent(filePath)}`)
      .then(response => response.json());
      
    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting document download URL:", error);
    throw error;
  }
};

export const getEntityTableName = (entityType: EntityType): string => {
  switch (entityType) {
    case 'policy':
      return 'policy_documents';
    case 'claim':
      return 'claim_documents';
    case 'client':
      return 'client_documents';
    case 'sales_process':
      return 'sales_documents';
    case 'agent':
      return 'agent_documents';
    case 'insurer':
      return 'insurer_documents';
    case 'invoice':
      return 'invoice_documents';
    case 'addendum':
      return 'addendum_documents';
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
};

export const supportedDocumentTypes = [
  { value: 'policy', label: 'Policy Document' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'claim', label: 'Claim Document' },
  { value: 'report', label: 'Report' },
  { value: 'contract', label: 'Contract' },
  { value: 'amendment', label: 'Amendment' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'other', label: 'Other' }
];

export const documentCategories = [
  { value: 'policy', label: 'Policy' },
  { value: 'claim', label: 'Claim' },
  { value: 'client', label: 'Client' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'quote', label: 'Quote' },
  { value: 'other', label: 'Other' }
];

export const getApprovalStatusBadgeVariant = (status: DocumentApprovalStatus) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'destructive';
    case 'needs_review':
      return 'warning';
    case 'pending':
    default:
      return 'outline';
  }
};
