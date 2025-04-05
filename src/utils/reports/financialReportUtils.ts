
import { formatDateToLocal } from '@/utils/dateUtils';

// Types for our financial reports
export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  reference: string;
  currency: string;
  status: string;
  entity_id?: string;
  entity_type?: string;
  description?: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  description: string;
  type: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  entity_id?: string;
  entity_type?: string;
  transactions: FinancialTransaction[];
}

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

// Format currency based on the currency code
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Group transactions for summary
export const groupTransactionsByType = (
  transactions: FinancialTransaction[]
): Record<string, { count: number; total: number }> => {
  return transactions.reduce((acc, transaction) => {
    const { type, amount } = transaction;
    
    if (!acc[type]) {
      acc[type] = { count: 0, total: 0 };
    }
    
    acc[type].count += 1;
    acc[type].total += amount;
    
    return acc;
  }, {} as Record<string, { count: number; total: number }>);
};

// Calculate totals for financial report
export const calculateTotals = (transactions: FinancialTransaction[]): { income: number; expense: number; balance: number } => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc.expense += transaction.amount;
      }
      
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
};

// Filter transactions based on financial report filters
export const filterTransactions = (
  transactions: FinancialTransaction[],
  filters: FinancialReportFilters
): FinancialTransaction[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const fromDate = new Date(filters.dateFrom);
    const toDate = new Date(filters.dateTo);
    
    // Date range filter
    if (transactionDate < fromDate || transactionDate > toDate) {
      return false;
    }
    
    // Transaction type filter
    if (filters.transactionType && filters.transactionType !== 'all' && transaction.type !== filters.transactionType) {
      return false;
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesDescription = transaction.description?.toLowerCase().includes(searchTerm);
      const matchesReference = transaction.reference?.toLowerCase().includes(searchTerm);
      
      if (!matchesDescription && !matchesReference) {
        return false;
      }
    }
    
    return true;
  });
};
