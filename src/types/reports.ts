
// Re-export the Proposal type and ProposalStatus enum from sales.ts
export type { Proposal, ProposalStatus } from '@/types/sales';

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category?: string;
  paymentMethod?: string;
  reference?: string;
  status?: string;
}

export interface FinancialReportFilters {
  startDate: string | Date;
  endDate: string | Date;
  type?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
  transactionType?: string;
  status?: string;
  dateFrom?: string | Date;  // Added to match component usage
  dateTo?: string | Date;    // Added to match component usage
}

export interface FinancialReportData {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: string;
  category?: string;
  reference?: string;
  status?: string;  // Added to match component usage
}

export interface FinancialReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export interface FinancialReportTableProps {
  data: FinancialReportData[];
  isLoading: boolean;
}

export interface FinancialTransactionsProps {
  data: FinancialTransaction[];
  isLoading: boolean;
  onExport: () => void;
  isExporting: boolean;
}

export interface FinancialReportSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  setFilters: (filters: FinancialReportFilters) => void;
  onApply: () => void;
  onChange?: (filters: Partial<FinancialReportFilters>) => void;
}

export interface UseFinancialReportReturn {
  data: FinancialReportData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  summary: FinancialReportSummary;
  filters: FinancialReportFilters;
  setFilters: (filters: FinancialReportFilters) => void;
  applyFilters: () => void;
  exportReport: () => void;
  isExporting: boolean;
  defaultFilters?: FinancialReportFilters;  // Added to match component usage
  resetFilters?: () => void;  // Added to match component usage
  reports?: any[];  // Added to match component usage
}
