
import React from "react";
import { DocumentCategory, EntityType } from "@/types/documents";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  FileImage, 
  FilePdf, 
  FileBox,
  FileSpreadsheet,
  FileCode
} from "lucide-react";

// Get icon based on file extension or mime type
export const getDocumentIcon = (fileName: string, mimeType?: string, size: number = 20) => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  if (mimeType?.includes('pdf') || fileExtension === 'pdf') {
    return <FilePdf size={size} className="text-red-500" />;
  } else if (
    mimeType?.includes('image') || 
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '')
  ) {
    return <FileImage size={size} className="text-blue-500" />;
  } else if (
    ['xls', 'xlsx', 'csv'].includes(fileExtension || '') || 
    mimeType?.includes('spreadsheet')
  ) {
    return <FileSpreadsheet size={size} className="text-green-500" />;
  } else if (
    ['html', 'js', 'css', 'ts', 'jsx', 'tsx'].includes(fileExtension || '') || 
    mimeType?.includes('code')
  ) {
    return <FileCode size={size} className="text-yellow-500" />;
  } else if (
    ['doc', 'docx', 'txt', 'rtf'].includes(fileExtension || '') || 
    mimeType?.includes('text')
  ) {
    return <FileText size={size} className="text-blue-400" />;
  } else {
    return <FileBox size={size} className="text-gray-500" />;
  }
};

// Get document type options based on entity type
export const getDocumentTypeOptions = (entityType: EntityType) => {
  const typeOptionsMap: Record<string, Array<{ label: string; value: string }>> = {
    [EntityType.POLICY]: [
      { label: 'Policy Document', value: 'policy' },
      { label: 'Certificate', value: 'certificate' },
      { label: 'Terms and Conditions', value: 'terms' },
      { label: 'Invoice', value: 'invoice' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.CLAIM]: [
      { label: 'Claim Form', value: 'claim_form' },
      { label: 'Damage Report', value: 'damage_report' },
      { label: 'Evidence Photos', value: 'evidence' },
      { label: 'Medical Report', value: 'medical_report' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.SALES_PROCESS]: [
      { label: 'Quote', value: 'quote' },
      { label: 'Proposal', value: 'proposal' },
      { label: 'Client Authorization', value: 'authorization' },
      { label: 'Requirements', value: 'requirements' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.SALE]: [  // Include options for 'sale' alias
      { label: 'Quote', value: 'quote' },
      { label: 'Proposal', value: 'proposal' },
      { label: 'Client Authorization', value: 'authorization' },
      { label: 'Requirements', value: 'requirements' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.CLIENT]: [
      { label: 'Identification', value: 'identification' },
      { label: 'Financial Records', value: 'financial' },
      { label: 'Company Documents', value: 'company' },
      { label: 'Authorization', value: 'authorization' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.INSURER]: [
      { label: 'Agreement', value: 'agreement' },
      { label: 'Commission Schedule', value: 'commission' },
      { label: 'Contact List', value: 'contacts' },
      { label: 'Product Catalog', value: 'products' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.AGENT]: [
      { label: 'Contract', value: 'contract' },
      { label: 'License', value: 'license' },
      { label: 'Commission Agreement', value: 'commission' },
      { label: 'Training Certificate', value: 'training' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.INVOICE]: [
      { label: 'Invoice', value: 'invoice' },
      { label: 'Receipt', value: 'receipt' },
      { label: 'Payment Confirmation', value: 'payment' },
      { label: 'Other', value: 'other' }
    ],
    [EntityType.POLICY_ADDENDUM]: [
      { label: 'Addendum', value: 'addendum' },
      { label: 'Amendment', value: 'amendment' },
      { label: 'Supplement', value: 'supplement' },
      { label: 'Other', value: 'other' }
    ]
  };
  
  return typeOptionsMap[entityType] || typeOptionsMap[EntityType.POLICY];
};

export const documentCategories = [
  { label: "Policy", value: DocumentCategory.POLICY },
  { label: "Claim", value: DocumentCategory.CLAIM },
  { label: "Invoice", value: DocumentCategory.INVOICE },
  { label: "Contract", value: DocumentCategory.CONTRACT },
  { label: "Sales", value: DocumentCategory.SALES },
  { label: "Legal", value: DocumentCategory.LEGAL },
  { label: "Authorization", value: DocumentCategory.AUTHORIZATION },
  { label: "General", value: DocumentCategory.GENERAL },
  { label: "Proposal", value: DocumentCategory.PROPOSAL },
  { label: "Miscellaneous", value: DocumentCategory.MISCELLANEOUS }
];

export const supportedDocumentTypes = [
  { label: "policy", value: "policy" },
  { label: "certificate", value: "certificate" },
  { label: "invoice", value: "invoice" },
  { label: "contract", value: "contract" },
  { label: "report", value: "report" },
  { label: "letter", value: "letter" },
  { label: "form", value: "form" },
  { label: "agreement", value: "agreement" },
  { label: "proposal", value: "proposal" },
  { label: "quote", value: "quote" },
  { label: "other", value: "other" }
];

export const getCategoryBadge = (category: string) => {
  const categoryColors: Record<string, { bg: string; text: string }> = {
    [DocumentCategory.POLICY]: { bg: "bg-blue-100", text: "text-blue-800" },
    [DocumentCategory.CLAIM]: { bg: "bg-red-100", text: "text-red-800" },
    [DocumentCategory.INVOICE]: { bg: "bg-green-100", text: "text-green-800" },
    [DocumentCategory.CONTRACT]: { bg: "bg-purple-100", text: "text-purple-800" },
    [DocumentCategory.SALES]: { bg: "bg-yellow-100", text: "text-yellow-800" },
    [DocumentCategory.MISCELLANEOUS]: { bg: "bg-gray-100", text: "text-gray-800" },
    [DocumentCategory.AUTHORIZATION]: { bg: "bg-orange-100", text: "text-orange-800" },
    [DocumentCategory.GENERAL]: { bg: "bg-teal-100", text: "text-teal-800" },
    [DocumentCategory.PROPOSAL]: { bg: "bg-indigo-100", text: "text-indigo-800" },
    [DocumentCategory.LEGAL]: { bg: "bg-pink-100", text: "text-pink-800" }
  };

  const style = categoryColors[category as DocumentCategory] || { bg: "bg-gray-100", text: "text-gray-800" };
  
  return (
    <Badge variant="outline" className={`${style.bg} ${style.text} border-transparent`}>
      {category}
    </Badge>
  );
};
