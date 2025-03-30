
export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  reference?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed' | 'paid';
  amount: number;
  currency: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}

export interface FinancialReportFilters {
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
  transactionType?: string;
  category?: string;
}

export interface FinancialReportData {
  transactions: FinancialTransaction[];
  totalCount: number;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    commissionEarned: number;
    invoicesPaid: number;
    outstandingInvoices: number;
  };
}

export const calculateFinancialSummary = (transactions: FinancialTransaction[]): FinancialSummary => {
  const summary: FinancialSummary = {
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
    incomeByCategory: {},
    expenseByCategory: {}
  };
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
      
      // Add to category summary
      if (!summary.incomeByCategory[transaction.category]) {
        summary.incomeByCategory[transaction.category] = 0;
      }
      summary.incomeByCategory[transaction.category] += transaction.amount;
    } else if (transaction.type === 'expense') {
      summary.totalExpense += transaction.amount;
      
      // Add to category summary
      if (!summary.expenseByCategory[transaction.category]) {
        summary.expenseByCategory[transaction.category] = 0;
      }
      summary.expenseByCategory[transaction.category] += transaction.amount;
    }
  });
  
  summary.netAmount = summary.totalIncome - summary.totalExpense;
  
  return summary;
};

export const filterTransactions = (
  transactions: FinancialTransaction[],
  filters: {
    dateRange?: [Date | null, Date | null];
    type?: string | null;
    categories?: string[];
    statuses?: string[];
  }
): FinancialTransaction[] => {
  return transactions.filter(transaction => {
    // Date range filter
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate < filters.dateRange[0] ||
        transactionDate > filters.dateRange[1]
      ) {
        return false;
      }
    }
    
    // Transaction type filter
    if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Categories filter
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
      return false;
    }
    
    // Status filter
    if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(transaction.status)) {
      return false;
    }
    
    return true;
  });
};

export const exportToCSV = (transactions: FinancialTransaction[], filename = 'financial_report'): void => {
  // Convert transactions to CSV format
  const headers = ['Date', 'Description', 'Type', 'Category', 'Reference', 'Status', 'Amount', 'Currency'];
  
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.description,
    t.type,
    t.category,
    t.reference || '',
    t.status,
    t.amount.toFixed(2),
    t.currency
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Add the missing export function
export const exportFinancialReportToCsv = (transactions: FinancialTransaction[], filename = 'financial_report'): void => {
  exportToCSV(transactions, filename);
};
