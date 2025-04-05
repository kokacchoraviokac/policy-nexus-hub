
export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  searchTerm: string;
  startDate: string;
  endDate: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  description: string;
  reference: string;
  category: string;
  currency: string;
  entity_id?: string;
  entity_type?: string;
  status?: string;
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
  category: string;
  transactions: FinancialTransaction[];
}

export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  transactionType: 'all',
  category: 'all',
  status: 'all',
  searchTerm: '',
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
};

export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    amount: 1500,
    date: '2023-04-01',
    type: 'commission',
    description: 'Commission for policy P-12345',
    reference: 'P-12345',
    category: 'income',
    currency: 'EUR',
  },
  {
    id: '2',
    amount: 2300,
    date: '2023-04-05',
    type: 'invoice',
    description: 'Invoice for services',
    reference: 'INV-001',
    category: 'income',
    currency: 'EUR',
  },
  {
    id: '3',
    amount: -450,
    date: '2023-04-10',
    type: 'expense',
    description: 'Office supplies',
    reference: 'EXP-001',
    category: 'expense',
    currency: 'EUR',
  }
];

export const financialReportMockData: FinancialReportData[] = [
  {
    id: '1',
    date: '2023-04-01',
    type: 'commission',
    description: 'Commission for policy P-12345',
    reference: 'P-12345',
    amount: 1500,
    currency: 'EUR',
    status: 'completed',
    category: 'income',
    transactions: [mockFinancialTransactions[0]]
  },
  {
    id: '2',
    date: '2023-04-05',
    type: 'invoice',
    description: 'Invoice for services',
    reference: 'INV-001',
    amount: 2300,
    currency: 'EUR',
    status: 'pending',
    category: 'income',
    transactions: [mockFinancialTransactions[1]]
  },
  {
    id: '3',
    date: '2023-04-10',
    type: 'expense',
    description: 'Office supplies',
    reference: 'EXP-001',
    amount: -450,
    currency: 'EUR',
    status: 'completed',
    category: 'expense',
    transactions: [mockFinancialTransactions[2]]
  }
];

export const formatCurrency = (value: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};
