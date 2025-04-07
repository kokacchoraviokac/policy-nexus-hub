
export enum RelationName {
  POLICIES = "policies",
  CLIENTS = "clients", 
  CLAIMS = "claims",
  POLICY_DOCUMENTS = "policy_documents",
  CLAIM_DOCUMENTS = "claim_documents",
  SALES_DOCUMENTS = "sales_documents",
  CLIENT_DOCUMENTS = "client_documents",
  AGENT_DOCUMENTS = "agent_documents",
  INSURER_DOCUMENTS = "insurer_documents"
}

export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  CLIENT = 'client',
  AGENT = 'agent',
  INSURER = 'insurer'
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
  OTHER = 'other'
}
