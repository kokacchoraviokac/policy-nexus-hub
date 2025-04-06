
import { ProposalStatus } from "./sales";

export interface FinancialReportFilters {
  dateFrom: string | Date;
  dateTo: string | Date;
  categoryFilter?: string;
  statusFilter?: string;
  entityFilter?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string; // Added currency field
  description: string;
  type: string;
  category: string;
  reference: string;
  status: string;
}

export interface FinancialReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export interface UseFinancialReportReturn {
  data: FinancialTransaction[];
  summary: FinancialReportSummary;
  loading: boolean;
  error: Error | null;
  filters: FinancialReportFilters;
  setFilters: (filters: FinancialReportFilters) => void;
  fetchData: () => void;
  exportData: () => void;
  isExporting: boolean;
  defaultFilters: FinancialReportFilters;
  isLoading: boolean;
  isError: boolean;
}

export interface FinancialReportData {
  transactions: FinancialTransaction[];
  summary: FinancialReportSummary;
}

// Exporting types from sales.ts to avoid circular dependencies
export type { Proposal } from './sales';
export { ProposalStatus } from './sales';
