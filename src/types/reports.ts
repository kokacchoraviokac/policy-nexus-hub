
export interface FinancialReportFilters {
  dateFrom?: string;
  dateTo?: string;
  insurerId?: string;
  clientId?: string;
  agentId?: string;
  type?: string;
  status?: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  description: string;
  type: string;
  reference: string;
  amount: number;
  status: string;
  transactions?: FinancialTransaction[];
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference: string;
  status: string;
}
