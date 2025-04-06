
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

export interface FinancialReportFilters {
  dateFrom: Date;
  dateTo: Date;
  type?: string;
  category?: string;
  status?: string;
}

export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  dateTo: new Date(),
};

export async function fetchFinancialReportData(filters: FinancialReportFilters): Promise<{
  data: FinancialTransaction[];
  summary: FinancialReportSummary;
}> {
  // This would typically be an API call
  const mockData: FinancialTransaction[] = [
    {
      id: '1',
      date: '2023-01-15',
      amount: 1000,
      description: 'Commission from Policy #12345',
      type: 'income',
      category: 'commission',
      reference: 'POL-12345',
      status: 'completed',
      currency: 'EUR'
    },
    {
      id: '2',
      date: '2023-01-20',
      amount: -250,
      description: 'Agent payout for Policy #12345',
      type: 'expense',
      category: 'payout',
      reference: 'PAY-789',
      status: 'completed',
      currency: 'EUR'
    }
  ];

  // Calculate summary
  const summary: FinancialReportSummary = {
    totalIncome: mockData.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: Math.abs(mockData.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
    netAmount: mockData.reduce((sum, t) => sum + t.amount, 0)
  };

  return { data: mockData, summary };
}
