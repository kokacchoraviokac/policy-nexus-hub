
// Financial report types
export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
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
  category?: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  date: string;
  type?: string;
  description?: string;
  reference?: string;
  category?: string;
  currency?: string;
  entity_id?: string;
  entity_type?: string;
  status?: string;
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  onChange: (newFilters: Partial<FinancialReportFilters>) => void;
  onApply: () => Promise<void>;
}

export interface ProposalStats {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
  draft?: number;
  sent?: number;
  viewed?: number;
}
