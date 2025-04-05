
import { EntityType } from "@/types/documents";

// Maps entity types to their corresponding tables
export const entityTablesMap: Record<EntityType, string> = {
  'policy': 'policy_documents',
  'claim': 'claim_documents',
  'sales_process': 'sales_documents',
  'client': 'client_documents',
  'insurer': 'insurer_documents',
  'agent': 'agent_documents',
  'invoice': 'invoice_documents',
  'addendum': 'addendum_documents'
};

// Get the document type options for a specific entity type
export const getDocumentTypeOptions = (entityType: EntityType) => {
  const typeOptionsMap: Record<EntityType, Array<{ label: string; value: string }>> = {
    'policy': [
      { label: 'Policy Document', value: 'policy' },
      { label: 'Certificate', value: 'certificate' },
      { label: 'Terms and Conditions', value: 'terms' },
      { label: 'Invoice', value: 'invoice' },
      { label: 'Other', value: 'other' }
    ],
    'claim': [
      { label: 'Claim Form', value: 'claim_form' },
      { label: 'Damage Report', value: 'damage_report' },
      { label: 'Evidence Photos', value: 'evidence' },
      { label: 'Medical Report', value: 'medical_report' },
      { label: 'Other', value: 'other' }
    ],
    'sales_process': [
      { label: 'Quote', value: 'quote' },
      { label: 'Proposal', value: 'proposal' },
      { label: 'Client Authorization', value: 'authorization' },
      { label: 'Requirements', value: 'requirements' },
      { label: 'Other', value: 'other' }
    ],
    'client': [
      { label: 'Identification', value: 'identification' },
      { label: 'Financial Records', value: 'financial' },
      { label: 'Company Documents', value: 'company' },
      { label: 'Authorization', value: 'authorization' },
      { label: 'Other', value: 'other' }
    ],
    'insurer': [
      { label: 'Agreement', value: 'agreement' },
      { label: 'Commission Schedule', value: 'commission' },
      { label: 'Contact List', value: 'contacts' },
      { label: 'Product Catalog', value: 'products' },
      { label: 'Other', value: 'other' }
    ],
    'agent': [
      { label: 'Contract', value: 'contract' },
      { label: 'License', value: 'license' },
      { label: 'Commission Agreement', value: 'commission' },
      { label: 'Training Certificate', value: 'training' },
      { label: 'Other', value: 'other' }
    ],
    'invoice': [
      { label: 'Invoice', value: 'invoice' },
      { label: 'Receipt', value: 'receipt' },
      { label: 'Payment Confirmation', value: 'payment' },
      { label: 'Other', value: 'other' }
    ],
    'addendum': [
      { label: 'Addendum', value: 'addendum' },
      { label: 'Amendment', value: 'amendment' },
      { label: 'Supplement', value: 'supplement' },
      { label: 'Other', value: 'other' }
    ]
  };
  
  return typeOptionsMap[entityType] || typeOptionsMap['policy'];
};

// Utility function to check if a document type is valid for an entity type
export const isValidDocumentType = (type: string, entityType: EntityType): boolean => {
  const validTypes = getDocumentTypeOptions(entityType).map(option => option.value);
  return validTypes.includes(type);
};
