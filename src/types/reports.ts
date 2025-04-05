
export interface FinancialTransaction {
  id: string;
  date: string;
  type: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  entity_id?: string;
  entity_type?: string;
  status: string;
  category: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  type: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  entity_id?: string;
  entity_type?: string;
  status: string;
  category: string;
  transactions: FinancialTransaction[];
}

export interface FinancialReportFilters {
  dateFrom: string | Date;
  dateTo: string | Date;
  entityType: string;
  transactionType: string;
  category: string;
  searchTerm: string;
  status?: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface PaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalPages?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  className?: string;
  children?: React.ReactNode;
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
}

export interface Proposal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  status: string;
  amount: number;
  currency: string;
  salesProcessId?: string;
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected';
