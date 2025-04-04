
export interface FinancialReportFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  insurerId?: string;
  clientId?: string;
  policyType?: string;
  status?: string; // Add status property
}

export interface FinancialReportItem {
  id: string;
  policyId: string;
  policyNumber: string;
  clientName: string;
  insurerName: string;
  premium: number;
  commission: number;
  status: string;
  date: string;
  policyType: string;
}

export interface FinancialSummary {
  totalPremium: number;
  totalCommission: number;
  avgCommissionRate: number;
  itemCount: number;
}
