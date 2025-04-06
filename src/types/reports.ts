
export interface FinancialReportFilters {
  startDate: Date | null;
  endDate: Date | null;
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
