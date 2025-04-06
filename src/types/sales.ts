
export type ProposalStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'all'  // Added 'all' for filtering
  | 'pending'
  | 'approved'; // Added for compatibility

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
  
  // Added aliased properties for compatibility
  clientName?: string;
  coverageDetails?: string;
  createdAt?: string;
  insurerName?: string;
}

export interface SalesProcess {
  id: string;
  company_id: string;
  client_id: string;
  title?: string;
  stage?: string;
  created_at: string;
  updated_at: string;
  current_step: string;
  company?: string;
  client_name?: string;
  responsible_person?: string;
  responsible_person_id?: string;
  
  // Add other required fields for compatibility
  status?: string;
  expected_close_date?: string;
  sales_number?: string;
  lead_id?: string;
}

export interface UseProposalsDataProps {
  sales_process_id?: string;
  status?: ProposalStatus;
  salesProcessId?: string; // Alias for sales_process_id
  searchQuery?: string;    // Added for search functionality
  statusFilter?: string;   // Added for filtering by status
}

export interface ProposalStats {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  
  // Legacy properties for backward compatibility 
  total?: number;
  accepted?: number;
  rejected?: number;
  draft?: number;
  pending?: number;
  sent?: number;
  viewed?: number;
  approved: number; // Added to fix the error
}

export interface SalesProcessDocumentsProps {
  salesProcess: SalesProcess;
  salesStage: string;
}
