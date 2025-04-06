
export interface FinancialReportFilters {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  entityType: string;
  // Aliases
  startDate: string;
  endDate: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  reference: string;
  entityId: string;
  entityType: string;
  entityName: string;
  description: string;
  currency: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | string; // Allow string to match FinancialReportData
  category: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'paid' | string; // Allow string
  reference?: string;
  currency?: string; // Add currency field
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  onApply: () => void;
  onChange?: (filters: FinancialReportFilters) => void;
  setFilters: React.Dispatch<React.SetStateAction<FinancialReportFilters>>;
}

export interface FinancialReportSummaryProps {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
  };
}

export interface UseFinancialReportReturn {
  reports: { data: FinancialReportData[] };
  isLoading: boolean;
  error: Error | null;
  filters: FinancialReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<FinancialReportFilters>>;
  applyFilters: () => void;
  resetFilters: () => void;
  refetch: () => void;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
  };
  defaultFilters: FinancialReportFilters;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  
  // Support for alternative naming convention
  totalItems?: number;
  itemsPerPage?: number;
  itemsCount?: number; // Support older implementations
  children?: React.ReactNode; // Support children prop
  
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

// Add missing proposal types
export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: ProposalStatus | string;
  created_at: string;
  updated_at: string;
  client_id?: string;
  client_name?: string;
  amount?: number;
  currency?: string;
  due_date?: string;
  approved?: boolean;
}

export type ProposalStatus = 
  | 'draft' 
  | 'sent' 
  | 'viewed' 
  | 'accepted' 
  | 'rejected'
  | 'approved'
  | 'pending';

export interface ProposalStats {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  draft?: number;
  sent?: number;
  viewed?: number;
  accepted?: number;
  approved?: number;
  total?: number;
  rejected?: number;
  pending?: number;
}
