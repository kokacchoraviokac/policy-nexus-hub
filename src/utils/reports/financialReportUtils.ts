
import { formatCurrency as formatCurrencyHelper } from "@/utils/formatters";

// Type definitions
export interface FinancialTransaction {
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

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  type: string[];
  status: string[];
  minAmount?: number;
  maxAmount?: number;
  reference?: string;
  description?: string;
}

// Default filters
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  type: [],
  status: [],
  minAmount: undefined,
  maxAmount: undefined,
  reference: undefined,
  description: undefined
};

// Helper functions
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return formatCurrencyHelper(amount, currency);
};

// Mock data for development
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    date: '2023-10-01',
    type: 'invoice',
    description: 'Invoice #INV-001',
    reference: 'INV-001',
    amount: 1500,
    currency: 'EUR',
    entity_id: 'inv-001',
    entity_type: 'invoice',
    status: 'paid',
    category: 'income'
  },
  {
    id: '2',
    date: '2023-10-05',
    type: 'payment',
    description: 'Premium payment for policy P-001',
    reference: 'PAY-001',
    amount: 750,
    currency: 'EUR',
    entity_id: 'pol-001',
    entity_type: 'policy',
    status: 'completed',
    category: 'income'
  },
  // Add more mock transactions as needed
];

// Mock financial report data
export const mockFinancialReportData: FinancialReportData[] = [
  {
    id: 'rep-001',
    date: '2023-10',
    type: 'monthly',
    description: 'October 2023 Financial Report',
    reference: 'REP-OCT-2023',
    amount: 2250,
    currency: 'EUR',
    status: 'completed',
    category: 'monthly_report',
    transactions: mockFinancialTransactions
  }
];

// Filter functions
export const filterTransactionsByDate = (
  transactions: FinancialTransaction[],
  dateFrom: string,
  dateTo: string
): FinancialTransaction[] => {
  return transactions.filter(
    transaction => transaction.date >= dateFrom && transaction.date <= dateTo
  );
};

// More filter functions as needed
