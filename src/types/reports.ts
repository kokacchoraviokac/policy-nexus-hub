
import { ProposalStatus } from "./sales";

export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_id?: string;
  insurer_id?: string;
  insurer_name?: string;
  sales_process_id?: string;
  description?: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: ProposalStatus;
  expiry_date?: string;
  valid_until?: string;
  version?: number;
  is_latest?: boolean;
}

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  categoryFilter?: string;
  statusFilter?: string;
  entityFilter?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
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
