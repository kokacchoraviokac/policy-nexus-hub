
export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  reference?: string;
}

export interface FinancialReportFilters {
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
  transactionType?: 'all' | 'income' | 'expense';
  category?: string;
}

export const calculateTotals = (transactions: FinancialTransaction[]) => {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "income") {
        totals.income += transaction.amount;
      } else {
        totals.expenses += transaction.amount;
      }
      totals.net = totals.income - totals.expenses;
      return totals;
    },
    { income: 0, expenses: 0, net: 0 }
  );
};

export const filterTransactions = (
  transactions: FinancialTransaction[],
  filters: FinancialReportFilters
): FinancialTransaction[] => {
  let filtered = [...transactions];
  
  if (filters.startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= filters.startDate!);
  }
  
  if (filters.endDate) {
    // Add 1 day to include the end date
    const endDate = new Date(filters.endDate);
    endDate.setDate(endDate.getDate() + 1);
    filtered = filtered.filter(t => new Date(t.date) < endDate);
  }
  
  if (filters.transactionType && filters.transactionType !== 'all') {
    filtered = filtered.filter(t => t.type === filters.transactionType);
  }
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }
  
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      t => t.description.toLowerCase().includes(searchLower) || 
           t.reference?.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

export const exportFinancialReportToCsv = async (
  data: FinancialTransaction[],
  filename: string
): Promise<void> => {
  try {
    // Transform data to CSV format
    let csvContent = "ID,Date,Type,Category,Description,Amount,Currency,Status,Reference\n";
    
    data.forEach(item => {
      const row = [
        item.id,
        item.date,
        item.type,
        item.category,
        `"${item.description.replace(/"/g, '""')}"`, // Handle quotes in description
        item.amount,
        item.currency,
        item.status,
        item.reference || ''
      ].join(',');
      
      csvContent += row + '\n';
    });
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting report to CSV:', error);
    return Promise.reject(error);
  }
};
