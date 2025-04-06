
import { FinancialReportData, FinancialReportFilters, FinancialReportSummary } from "@/types/reports";
import { formatCurrency } from "@/utils/formatUtils";

export function initializeFilters(): FinancialReportFilters {
  return {
    startDate: new Date(new Date().setDate(1)), // First day of current month
    endDate: new Date(), // Today
    searchTerm: '',
    transactionType: 'all',
    status: 'all',
    category: 'all',
  };
}

export function mockFinancialData(): FinancialReportData[] {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  
  return [
    {
      id: "1",
      date: new Date(thisYear, thisMonth, 5).toISOString(),
      amount: 2500,
      description: "Policy Premium - Auto Insurance",
      type: "income",
      category: "sales",
      reference: "POL-1234",
      status: "completed"
    },
    {
      id: "2",
      date: new Date(thisYear, thisMonth, 8).toISOString(),
      amount: 1800,
      description: "Commission - Home Insurance",
      type: "income",
      category: "commissions",
      reference: "COM-5678",
      status: "completed"
    },
    {
      id: "3",
      date: new Date(thisYear, thisMonth, 12).toISOString(),
      amount: -450,
      description: "Office Supplies",
      type: "expense",
      category: "operational",
      reference: "EXP-91011",
      status: "completed"
    },
    {
      id: "4",
      date: new Date(thisYear, thisMonth, 15).toISOString(),
      amount: 3200,
      description: "Policy Premium - Life Insurance",
      type: "income",
      category: "sales",
      reference: "POL-1235",
      status: "completed"
    },
    {
      id: "5",
      date: new Date(thisYear, thisMonth, 18).toISOString(),
      amount: -750,
      description: "Rent Payment",
      type: "expense",
      category: "operational",
      reference: "EXP-91012",
      status: "completed"
    },
    {
      id: "6",
      date: new Date(thisYear, thisMonth, 20).toISOString(),
      amount: 950,
      description: "Commission - Travel Insurance",
      type: "income",
      category: "commissions",
      reference: "COM-5679",
      status: "pending"
    },
    {
      id: "7",
      date: new Date(thisYear, thisMonth, 22).toISOString(),
      amount: -380,
      description: "Utilities",
      type: "expense",
      category: "operational",
      reference: "EXP-91013",
      status: "pending"
    },
    {
      id: "8",
      date: new Date(thisYear, thisMonth, 25).toISOString(),
      amount: -1200,
      description: "Tax Payment",
      type: "expense",
      category: "taxes",
      reference: "TAX-2023",
      status: "completed"
    }
  ];
}

export function generateFinancialSummary(data: FinancialReportData[]): FinancialReportSummary {
  const totalIncome = data
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = data
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
    
  const netAmount = totalIncome - totalExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    netAmount
  };
}

export function filterFinancialData(data: FinancialReportData[], filters: FinancialReportFilters): FinancialReportData[] {
  return data.filter(item => {
    const itemDate = new Date(item.date);
    const startDate = filters.startDate instanceof Date ? filters.startDate : new Date(filters.startDate);
    const endDate = filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
    
    // Date range filter
    if (itemDate < startDate || itemDate > endDate) {
      return false;
    }
    
    // Transaction type filter
    if (filters.transactionType && filters.transactionType !== 'all') {
      if (item.type !== filters.transactionType) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (item.category !== filters.category) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (item.status !== filters.status) {
        return false;
      }
    }
    
    // Min amount filter
    if (filters.minAmount && Math.abs(item.amount) < filters.minAmount) {
      return false;
    }
    
    // Max amount filter
    if (filters.maxAmount && Math.abs(item.amount) > filters.maxAmount) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        item.description.toLowerCase().includes(searchLower) ||
        (item.reference && item.reference.toLowerCase().includes(searchLower)) ||
        formatCurrency(item.amount).toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
}
