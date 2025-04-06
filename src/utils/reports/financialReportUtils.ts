
// Financial transaction type definition
export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category?: string;
  paymentMethod?: string;
  reference?: string;
  status?: string;
}

// Default financial report filters
export const defaultFinancialFilters = {
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
  endDate: new Date(),
  type: '',
  category: '',
  minAmount: undefined,
  maxAmount: undefined,
  searchTerm: '',
  transactionType: '',
  status: '',
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  dateTo: new Date()
};

// Mock data for financial reports
export const mockFinancialData = [
  {
    id: '1',
    date: '2025-01-15',
    amount: 1500,
    description: 'Client payment',
    type: 'income',
    category: 'Services',
    reference: 'INV-001',
    status: 'completed'
  },
  {
    id: '2',
    date: '2025-01-20',
    amount: 500,
    description: 'Office supplies',
    type: 'expense',
    category: 'Operations',
    reference: 'EXP-001',
    status: 'completed'
  },
  {
    id: '3',
    date: '2025-02-05',
    amount: 2000,
    description: 'Consulting fees',
    type: 'income',
    category: 'Services',
    reference: 'INV-002',
    status: 'pending'
  }
];

// Fetch financial report data (mock implementation)
export const fetchFinancialReportData = async (filters: any) => {
  // This is a mock implementation
  console.log('Fetching financial data with filters:', filters);
  
  // In a real implementation, this would fetch data from your API
  const filteredData = mockFinancialData.filter(item => {
    const itemDate = new Date(item.date);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    // Filter by date range
    if (fromDate && itemDate < fromDate) return false;
    if (toDate && itemDate > toDate) return false;
    
    // Filter by status
    if (filters.status && filters.status !== item.status) return false;
    
    // Filter by transaction type
    if (filters.transactionType && filters.transactionType !== item.type) return false;
    
    // Filter by search term
    if (filters.searchTerm && !item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    
    return true;
  });
  
  return {
    data: filteredData,
    summary: {
      totalIncome: filteredData.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0),
      totalExpenses: filteredData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
      netAmount: filteredData.reduce((sum, item) => item.type === 'income' ? sum + item.amount : sum - item.amount, 0)
    }
  };
};
