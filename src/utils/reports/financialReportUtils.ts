
import { FinancialReportData, FinancialReportFilters, FinancialTransaction } from "@/types/reports";

// Default filter state
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: "",
  dateTo: "",
  transactionType: "all",
  category: "all",
  status: "all",
  searchTerm: "",
  startDate: "",
  endDate: ""
};

// Mock data for development
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: "1",
    amount: 1200.00,
    date: "2023-06-01",
    type: "income",
    description: "Policy Premium Payment",
    reference: "POL-2023-001",
    category: "premium",
    currency: "EUR",
    status: "completed"
  },
  {
    id: "2",
    amount: 500.00,
    date: "2023-06-05",
    type: "expense",
    description: "Agent Commission",
    reference: "AGT-2023-001",
    category: "commission",
    currency: "EUR",
    status: "completed"
  },
  {
    id: "3",
    amount: 2300.00,
    date: "2023-06-10",
    type: "income",
    description: "Policy Premium Payment",
    reference: "POL-2023-002",
    category: "premium",
    currency: "EUR",
    status: "pending"
  },
  {
    id: "4",
    amount: 800.00,
    date: "2023-06-15",
    type: "expense",
    description: "Office Supplies",
    reference: "EXP-2023-001",
    category: "operational",
    currency: "EUR",
    status: "completed"
  },
  {
    id: "5",
    amount: 3500.00,
    date: "2023-06-20",
    type: "income",
    description: "Premium Payment",
    reference: "POL-2023-003",
    category: "premium",
    currency: "EUR",
    status: "completed"
  }
];

// Create mock data object with the transactions
export const mockFinancialData: FinancialReportData = {
  id: "financial-report-2023-06",
  date: "2023-06-30",
  type: "monthly",
  description: "Monthly Financial Report - June 2023",
  reference: "FIN-2023-06",
  amount: 5700.00, // Total income - expenses
  currency: "EUR",
  status: "completed",
  category: "financial",
  transactions: mockFinancialTransactions
};

// Apply filters to data
export function applyFilters(
  data: FinancialTransaction[],
  filters: FinancialReportFilters
): FinancialTransaction[] {
  return data.filter(item => {
    // Filter by date range
    const itemDate = new Date(item.date);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    if (fromDate && itemDate < fromDate) return false;
    if (toDate) {
      // Make toDate inclusive by setting it to end of day
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (itemDate > endOfDay) return false;
    }
    
    // Filter by transaction type
    if (filters.transactionType !== 'all' && item.type !== filters.transactionType) return false;
    
    // Filter by category
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    
    // Filter by status
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    
    // Filter by search term (case insensitive)
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
      const referenceMatch = item.reference.toLowerCase().includes(searchTerm);
      
      if (!descriptionMatch && !referenceMatch) return false;
    }
    
    return true;
  });
}

// Helper to get summary statistics
export function getFinancialSummary(transactions: FinancialTransaction[]) {
  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    totalNetAmount: 0,
    totalPremium: 0,
    totalCommission: 0,
    totalOperational: 0,
    transactionCount: transactions.length
  };
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
    } else if (transaction.type === 'expense') {
      summary.totalExpense += transaction.amount;
    }
    
    if (transaction.category === 'premium') {
      summary.totalPremium += transaction.amount;
    } else if (transaction.category === 'commission') {
      summary.totalCommission += transaction.amount;
    } else if (transaction.category === 'operational') {
      summary.totalOperational += transaction.amount;
    }
  });
  
  summary.totalNetAmount = summary.totalIncome - summary.totalExpense;
  
  return summary;
}
