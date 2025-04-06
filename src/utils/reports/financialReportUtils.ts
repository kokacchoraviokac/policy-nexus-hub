
import { FinancialReportData, FinancialReportFilters, FinancialTransaction, FinancialReportSummary } from "@/types/reports";

// Default financial report filters
export const defaultFinancialFilters: FinancialReportFilters = {
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

// Fetch financial report data
export const fetchFinancialReportData = async (filters: FinancialReportFilters): Promise<FinancialReportData[]> => {
  // This is a mock implementation - in real world scenario, this would call an API
  // or query a database to get financial data based on the filters
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate some mock data
  const mockData: FinancialReportData[] = Array.from({ length: 20 }, (_, i) => {
    const isIncome = Math.random() > 0.3;
    return {
      id: `trans-${i}`,
      date: new Date(
        new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))
      ).toISOString(),
      amount: Math.floor(Math.random() * 10000) / 100,
      description: isIncome ? `Income payment #${i}` : `Expense payment #${i}`,
      type: isIncome ? 'income' : 'expense',
      category: isIncome ? 'commission' : 'service',
      reference: `REF-${Math.floor(Math.random() * 1000)}`,
      status: Math.random() > 0.2 ? 'completed' : 'pending'
    };
  });
  
  // Apply filters (basic filtering for demonstration)
  return mockData.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    
    // Date range filter
    if (transactionDate < startDate || transactionDate > endDate) {
      return false;
    }
    
    // Type filter
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Category filter
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    // Amount range filter
    if (filters.minAmount && transaction.amount < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount && transaction.amount > filters.maxAmount) {
      return false;
    }
    
    // Search term filter (checks description and reference)
    if (filters.searchTerm && 
        !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !transaction.reference?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Transaction type filter
    if (filters.transactionType && transaction.type !== filters.transactionType) {
      return false;
    }
    
    // Status filter
    if (filters.status && transaction.status !== filters.status) {
      return false;
    }
    
    return true;
  });
};

// Calculate financial report summary
export const calculateFinancialSummary = (data: FinancialReportData[]): FinancialReportSummary => {
  const totalIncome = data
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = data
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  return {
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses
  };
};
