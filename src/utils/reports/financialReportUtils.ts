
export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  entity_id?: string;
  entity_type?: string;
  currency?: string;
  status?: string;
  reference?: string;
}

export interface FinancialReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  periodStart?: string;
  periodEnd?: string;
  currency?: string;
}

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  category?: string;
  entityType?: string;
  entityId?: string;
}

export const calculateSummary = (transactions: FinancialTransaction[]): FinancialReportSummary => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses
  };
};
