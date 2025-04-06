
export interface FinancialReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  dateFrom?: Date | string | null; // Adding dateFrom for backward compatibility
  dateTo?: Date | string | null; // Adding dateTo for backward compatibility
  type?: string;
  category?: string;
  status?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  setFilters: (filters: FinancialReportFilters) => void;
  onApply: () => void;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: string;
  category: string;
  reference: string;
  status: string;
  currency: string;
}

export interface FinancialReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export interface FinancialReportSummaryProps {
  summary: FinancialReportSummary;
}

export interface FinancialReportTableProps {
  data: FinancialTransaction[];
  isLoading: boolean;
}

export interface FinancialTransactionsProps {
  data: FinancialTransaction[];
  isLoading: boolean;
  onExport?: () => void;
  isExporting?: boolean;
}

// Added missing types for useFinancialReport
export interface FinancialReportData {
  transactions: FinancialTransaction[];
  summary: FinancialReportSummary;
}

export interface UseFinancialReportReturn {
  data: FinancialReportData;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  filters: FinancialReportFilters;
  setFilters: (filters: FinancialReportFilters) => void;
  applyFilters: () => void;
  summary: FinancialReportSummary;
  reports?: any;
  resetFilters?: () => void;
  defaultFilters?: FinancialReportFilters;
}

// Proposals related types
export type ProposalStatus = 
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'expired';

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  client_id: string;
  client_name: string;
  amount: number;
  currency: string;
  valid_until: string;
  sales_process_id: string;
  created_by?: string;
  company_id?: string;
  insurer_name?: string;
  coverage_details?: string;
  premium?: number;
  notes?: string;
  document_ids?: string[];
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
}

export interface ProposalsListProps {
  proposals: Proposal[];
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus) => Promise<boolean>;
}

export interface UpdateProposalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: ProposalStatus;
  onUpdate: (status: ProposalStatus) => Promise<void>;
}

export interface DocumentsTabProps {
  process: any;
}
