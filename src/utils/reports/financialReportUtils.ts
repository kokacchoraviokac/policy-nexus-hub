
// Financial report types
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

// Mock data for financial reports
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    amount: 1200.50,
    date: '2023-04-01',
    type: 'income',
    description: 'Premium payment',
    reference: 'INV-2023-001',
    category: 'premium',
    currency: 'USD'
  },
  {
    id: '2',
    amount: 500.00,
    date: '2023-04-05',
    type: 'expense',
    description: 'Commission payment',
    reference: 'COM-2023-001',
    category: 'commission',
    currency: 'USD'
  },
  {
    id: '3',
    amount: 2000.00,
    date: '2023-04-10',
    type: 'income',
    description: 'Premium payment',
    reference: 'INV-2023-002',
    category: 'premium',
    currency: 'USD'
  }
];

// Default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: '',
  dateTo: '',
  transactionType: 'all',
  category: 'all',
  status: 'all',
  searchTerm: '',
  startDate: '',
  endDate: ''
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};
