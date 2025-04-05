
// Define financial report data structure
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
  status?: string;
  category?: string;
}

// Define filters for financial reports
export interface FinancialReportFilters {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  entityType: string;
  // Aliases for compatibility
  startDate?: string;
  endDate?: string;
}

// Report type options
export type ReportType = 
  | 'financial'
  | 'production'
  | 'claims'
  | 'agents'
  | 'clients';

// Financial report types
export type FinancialTransactionType =
  | 'income'
  | 'expense'
  | 'payment'
  | 'commission'
  | 'all';

// Financial category types
export type FinancialCategory =
  | 'policy'
  | 'claim'
  | 'operational'
  | 'tax'
  | 'commission'
  | 'all';

// Financial status types
export type FinancialStatus =
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'all';
  
// Define props for financial report filters component
export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  onFiltersChange: (filters: FinancialReportFilters) => void;
  onApply: () => void;
}
