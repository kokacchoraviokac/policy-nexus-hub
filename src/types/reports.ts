
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
  type: 'income' | 'expense';
  category: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  onApply: () => void;
  onChange?: (filters: FinancialReportFilters) => void;
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
