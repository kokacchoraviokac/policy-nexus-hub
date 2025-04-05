
import { FinancialReportData, FinancialTransaction } from '@/types/reports';

// Helper functions for financial reports
export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const groupTransactionsByDate = (
  transactions: FinancialTransaction[]
): Record<string, FinancialTransaction[]> => {
  return transactions.reduce((acc, transaction) => {
    const date = transaction.date.split('T')[0]; // Get just the date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, FinancialTransaction[]>);
};

export const calculateTotals = (
  data: FinancialReportData[]
): { income: number; expenses: number; balance: number } => {
  let income = 0;
  let expenses = 0;

  data.forEach((item) => {
    const amount = item.amount;
    if (amount > 0) {
      income += amount;
    } else {
      expenses += Math.abs(amount);
    }
  });

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

export const categorizeTransactions = (
  data: FinancialReportData[]
): Record<string, number> => {
  return data.reduce((acc, item) => {
    const type = item.type || 'Other';
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += Math.abs(item.amount);
    return acc;
  }, {} as Record<string, number>);
};
