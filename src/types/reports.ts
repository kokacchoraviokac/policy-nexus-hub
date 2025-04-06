
// Reports module type definitions

export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  expiry_date: string;
  estimated_value: number;
  currency: string;
}

export interface FinancialReportFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  type: string | null;
  category: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  setFilters: (filters: FinancialReportFilters) => void;
  onApply: () => void;
}

export interface FinancialReportData {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  currency: string;
  related_entity?: string;
  related_entity_id?: string;
  payment_method?: string;
}

export interface FinancialReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export interface FinancialReportSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export interface FinancialReportTableProps {
  data: FinancialReportData[];
  isLoading: boolean;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  currency: string;
  category: string;
}

export interface FinancialTransactionsProps {
  data: FinancialTransaction[];
  isLoading: boolean;
  onExport: () => void;
  isExporting: boolean;
}

export interface RevenueByMonthData {
  month: string;
  income: number;
  expenses: number;
}

export interface ExpensesByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface ClientReportFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  status: string | null;
  minPolicies: number | null;
  maxPolicies: number | null;
}

export interface ClientReportData {
  id: string;
  client_name: string;
  total_policies: number;
  active_policies: number;
  total_premium: number;
  total_commission: number;
  client_since: string;
  last_policy_date: string;
}

export interface AgentReportFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  minSales: number | null;
  maxSales: number | null;
}

export interface AgentReportData {
  id: string;
  agent_name: string;
  total_sales: number;
  total_commission: number;
  conversion_rate: number;
  avg_deal_size: number;
}

export interface ClaimReportFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  status: string | null;
  insurerIds: string[];
  clientIds: string[];
}

export interface ClaimReportData {
  id: string;
  claim_number: string;
  policy_number: string;
  client_name: string;
  insurer_name: string;
  incident_date: string;
  claim_date: string;
  status: string;
  claimed_amount: number;
  approved_amount: number | null;
  currency: string;
}

export interface ProductionReportFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  insurerIds: string[];
  productIds: string[];
  status: string | null;
}

export interface ProductionReportData {
  id: string;
  policy_number: string;
  client_name: string;
  insurer_name: string;
  product_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  commission: number;
  currency: string;
  status: string;
}

export interface ReportExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  includeHeaderRow: boolean;
  fileName: string;
}
