
import { formatDateToLocal } from "../dateUtils";

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  date: string;
  source: string;
  status: string;
  details: string;
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
  transactions?: FinancialTransaction[];
}

export const defaultFinancialReportFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  transactionType: 'all',
  category: 'all',
  status: 'all'
};

export const transactionTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'commission', label: 'Commission' },
  { value: 'policy_payment', label: 'Policy Payment' }
];

export const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'policy', label: 'Policies' },
  { value: 'claim', label: 'Claims' },
  { value: 'commission', label: 'Commissions' },
  { value: 'operating', label: 'Operating' }
];

export const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' }
];

export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  onChange: (newFilters: Partial<FinancialReportFilters>) => void;
  onApply: () => Promise<void>;
}

export const financialReportMockData: FinancialReportData[] = [
  {
    id: '1',
    date: '2023-04-01',
    description: 'Policy Premium',
    type: 'income',
    reference: 'P-123456',
    amount: 1250.00,
    currency: 'EUR',
    status: 'completed',
    entity_id: '123',
    entity_type: 'policy',
    transactions: [
      {
        id: 't1',
        amount: 1250.00,
        date: '2023-04-01',
        source: 'Bank Transfer',
        status: 'completed',
        details: 'Premium payment for policy P-123456'
      }
    ]
  },
  {
    id: '2',
    date: '2023-04-05',
    description: 'Commission Payout',
    type: 'expense',
    reference: 'C-78901',
    amount: 450.00,
    currency: 'EUR',
    status: 'pending',
    entity_id: '456',
    entity_type: 'commission',
    transactions: [
      {
        id: 't2',
        amount: 450.00,
        date: '2023-04-05',
        source: 'Bank Transfer',
        status: 'pending',
        details: 'Commission payout to agent A-001'
      }
    ]
  },
  {
    id: '3',
    date: '2023-04-10',
    description: 'Claim Settlement',
    type: 'expense',
    reference: 'CL-34567',
    amount: 2800.00,
    currency: 'EUR',
    status: 'completed',
    entity_id: '789',
    entity_type: 'claim',
    transactions: [
      {
        id: 't3',
        amount: 2800.00,
        date: '2023-04-10',
        source: 'Bank Transfer',
        status: 'completed',
        details: 'Claim settlement for policy P-987654'
      }
    ]
  }
];
