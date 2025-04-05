
import { formatDateToLocal } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatters";

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  type: string;
  category: string;
  status: string;
  entity_id?: string;
  entity_type?: string;
}

export interface FinancialReportData {
  id: string;
  date: string;
  description: string;
  type: string;
  category: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  entity_id?: string;
  entity_type?: string;
  transactions: FinancialTransaction[];
}

export const defaultFinancialReportFilters: FinancialReportFilters = {
  dateFrom: formatDateToLocal(new Date(new Date().setMonth(new Date().getMonth() - 1))),
  dateTo: formatDateToLocal(new Date()),
  transactionType: '',
  category: '',
  status: ''
};

export const financialReportMockData: FinancialReportData[] = [
  {
    id: '1',
    date: '2023-07-15',
    description: 'Commission payment',
    type: 'income',
    category: 'commission',
    reference: 'COMM-001',
    amount: 1250.50,
    currency: 'EUR',
    status: 'completed',
    entity_id: 'policy-1',
    entity_type: 'policy',
    transactions: [
      {
        id: '1-1',
        date: '2023-07-15',
        description: 'Commission - Auto Insurance',
        reference: 'COMM-001-1',
        amount: 750.50,
        currency: 'EUR',
        type: 'income',
        category: 'commission',
        status: 'completed'
      },
      {
        id: '1-2',
        date: '2023-07-15',
        description: 'Commission - Home Insurance',
        reference: 'COMM-001-2',
        amount: 500.00,
        currency: 'EUR',
        type: 'income',
        category: 'commission',
        status: 'completed'
      }
    ]
  },
  {
    id: '2',
    date: '2023-07-20',
    description: 'Agent payout',
    type: 'expense',
    category: 'agent-payout',
    reference: 'PAY-001',
    amount: 500.00,
    currency: 'EUR',
    status: 'completed',
    entity_id: 'agent-1',
    entity_type: 'agent',
    transactions: [
      {
        id: '2-1',
        date: '2023-07-20',
        description: 'Agent commission - John Doe',
        reference: 'PAY-001-1',
        amount: 500.00,
        currency: 'EUR',
        type: 'expense',
        category: 'agent-payout',
        status: 'completed'
      }
    ]
  },
  {
    id: '3',
    date: '2023-07-25',
    description: 'Operating expense',
    type: 'expense',
    category: 'operating',
    reference: 'EXP-001',
    amount: 350.75,
    currency: 'EUR',
    status: 'completed',
    transactions: [
      {
        id: '3-1',
        date: '2023-07-25',
        description: 'Office supplies',
        reference: 'EXP-001-1',
        amount: 150.75,
        currency: 'EUR',
        type: 'expense',
        category: 'operating',
        status: 'completed'
      },
      {
        id: '3-2',
        date: '2023-07-25',
        description: 'Software subscription',
        reference: 'EXP-001-2',
        amount: 200.00,
        currency: 'EUR',
        type: 'expense',
        category: 'operating',
        status: 'completed'
      }
    ]
  }
];

export const calculateFinancialSummary = (data: FinancialReportData[]) => {
  const totalIncome = data
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpense = data
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netAmount = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    netAmount
  };
};

export const formatFinancialAmount = (amount: number, currency = 'EUR') => {
  return formatCurrency(amount, currency);
};
