
export enum RelationName {
  POLICIES = "policies",
  CLIENTS = "clients", 
  CLAIMS = "claims",
  POLICY_DOCUMENTS = "policy_documents",
  CLAIM_DOCUMENTS = "claim_documents",
  SALES_DOCUMENTS = "sales_documents",
  CLIENT_DOCUMENTS = "client_documents",
  AGENT_DOCUMENTS = "agent_documents",
  INSURER_DOCUMENTS = "insurer_documents",
  ADDENDUM_DOCUMENTS = "addendum_documents",
  INVOICE_DOCUMENTS = "invoice_documents"
}

export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  CLIENT = 'client',
  AGENT = 'agent',
  INSURER = 'insurer',
  ADDENDUM = 'addendum',
  INVOICE = 'invoice',
  SALE = 'sale'
}

export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  INVOICE = 'invoice',
  CONTRACT = 'contract',
  LIEN = 'lien',
  PROPOSAL = 'proposal',
  QUOTE = 'quote',
  NOTIFICATION = 'notification',
  OTHER = 'other',
  MISCELLANEOUS = 'miscellaneous'
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
  READY = 'ready',
  REVIEW = 'review',
  COMPLETE = 'complete'
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
