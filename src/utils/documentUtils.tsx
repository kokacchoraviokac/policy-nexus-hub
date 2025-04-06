
import { FileText, FileImage, FileSpreadsheet, FileArchive, File } from 'lucide-react';
import { Document, DocumentCategory } from '@/types/documents';

export const supportedDocumentTypes = [
  { value: 'policy', label: 'policyDocument' },
  { value: 'invoice', label: 'invoice' },
  { value: 'proposal', label: 'proposal' },
  { value: 'quote', label: 'quote' },
  { value: 'contract', label: 'contract' },
  { value: 'identification', label: 'identification' },
  { value: 'letter', label: 'letter' },
  { value: 'email', label: 'email' },
  { value: 'amendment', label: 'amendment' },
  { value: 'claim', label: 'claim' },
  { value: 'report', label: 'report' },
  { value: 'form', label: 'form' },
  { value: 'miscellaneous', label: 'miscellaneous' },
  { value: 'other', label: 'other' }
];

export const documentCategories = [
  { value: 'policy', label: 'policy' },
  { value: 'claim', label: 'claim' },
  { value: 'client', label: 'client' },
  { value: 'invoice', label: 'invoice' },
  { value: 'proposal', label: 'proposal' },
  { value: 'quote', label: 'quote' },
  { value: 'identification', label: 'identification' },
  { value: 'other', label: 'other' }
];

export const getDocumentIcon = (document: Document) => {
  const fileType = document.mime_type || document.file_path.split('.').pop()?.toLowerCase();
  
  if (fileType?.includes('pdf')) {
    return <FileText className="h-5 w-5" />;
  } else if (fileType?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType || '')) {
    return <FileImage className="h-5 w-5" />;
  } else if (fileType?.includes('excel') || fileType?.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(fileType || '')) {
    return <FileSpreadsheet className="h-5 w-5" />;
  } else if (fileType?.includes('zip') || fileType?.includes('archive') || ['zip', 'rar', '7z'].includes(fileType || '')) {
    return <FileArchive className="h-5 w-5" />;
  } else {
    return <File className="h-5 w-5" />;
  }
};

export const getDocumentTypeLabel = (documentType: string): string => {
  const found = supportedDocumentTypes.find(type => type.value === documentType);
  return found ? found.label : documentType;
};

export const getCategoryLabel = (category: DocumentCategory): string => {
  const found = documentCategories.find(cat => cat.value === category);
  return found ? found.label : category;
};

// Table mapping entity types to their document tables
export const entityToDocumentTable: Record<string, string> = {
  'policy': 'policy_documents',
  'claim': 'claim_documents',
  'sales_process': 'sales_documents',
  'sale': 'sales_documents',
  'client': 'client_documents',
  'insurer': 'insurer_documents',
  'agent': 'agent_documents',
  'invoice': 'invoice_documents',
  'addendum': 'addendum_documents'
};

// Helper for determining if a document should be previewed in a specific tab
export const isDocumentInCategory = (document: Document, category: DocumentCategory): boolean => {
  return document.category === category;
};
