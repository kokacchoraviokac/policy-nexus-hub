
export type ProposalStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired';

export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  sales_process_id: string;
  created_at: string;
  status: ProposalStatus;
  insurer_name?: string;
  coverage_details?: string;
  premium?: string;
  notes?: string;
  document_ids?: string[];
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
}

export interface SalesProcess {
  id: string;
  title: string;
  stage: string;
  company_id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  current_step: string;
  company?: string;
  client_name?: string;
  responsible_person?: string;
  responsible_person_id?: string;
}
