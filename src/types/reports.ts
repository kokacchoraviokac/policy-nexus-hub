
export interface FinancialReportData {
  id: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  reference?: string;
  entityId?: string;
  entityType?: string;
  entityName?: string;
}

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

export interface ProposalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
  sent: number;
  viewed: number;
  accepted: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  client_name: string;
  created_at: string;
  status: string;
  amount: number;
  currency: string;
  expiry_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  product_id?: string;
  product_name?: string;
  company_id: string;
  notes?: string;
}

export type ProposalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';

export interface SalesProcess {
  id: string;
  sales_number: string;
  company_id: string;
  client_id: string;
  current_step: string;
  estimated_value: number;
  expected_close_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
  lead_id?: string;
  assigned_to?: string;
}

export interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
  description?: string;
}

export interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  onApply: () => void;
  onChange?: (filters: FinancialReportFilters) => void;
}

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface PolicyImportReviewProps {
  policies: Partial<import('@/types/policies').Policy>[];
  invalidPolicies: any[];
  onSubmit?: () => void;
  isSubmitting?: boolean;
  onBack?: () => void;
  onImport?: () => void;
}

export interface PolicyImportInstructionsProps {
  className?: string;
}
