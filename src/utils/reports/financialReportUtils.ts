import { FinancialReportData, FinancialTransaction, FinancialReportFilters } from '@/types/reports';

// Default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  dateTo: new Date(),
  entityType: ['all'],
  transactionType: ['all'],
  category: ['all'],
  searchTerm: '',
};

// Mock data for financial reports (will be replaced with real API calls)
export const financialReportMockData: FinancialReportData[] = [
  {
    id: '1',
    date: '2023-01-15',
    type: 'payment',
    description: 'Policy payment received',
    reference: 'PAY-001',
    amount: 1250.00,
    currency: 'USD',
    entity_id: 'policy-123',
    entity_type: 'policy',
    status: 'completed',
    category: 'income',
    transactions: [
      {
        id: '1-1',
        date: '2023-01-15',
        type: 'payment',
        description: 'Initial premium payment',
        reference: 'TRANS-001',
        amount: 1000.00,
        currency: 'USD',
        status: 'completed',
        category: 'premium'
      },
      {
        id: '1-2',
        date: '2023-01-15',
        type: 'fee',
        description: 'Processing fee',
        reference: 'FEE-001',
        amount: 250.00,
        currency: 'USD',
        status: 'completed',
        category: 'fee'
      }
    ]
  },
  {
    id: '2',
    date: '2023-02-20',
    type: 'payout',
    description: 'Claim settlement',
    reference: 'CLM-001',
    amount: -3500.00,
    currency: 'USD',
    entity_id: 'claim-456',
    entity_type: 'claim',
    status: 'completed',
    category: 'expense',
    transactions: [
      {
        id: '2-1',
        date: '2023-02-20',
        type: 'payout',
        description: 'Claim payout',
        reference: 'PAYOUT-001',
        amount: -3500.00,
        currency: 'USD',
        status: 'completed',
        category: 'payout'
      }
    ]
  }
];

// Fetch financial reports from API (will be implemented)
export async function fetchFinancialReports(filters: FinancialReportFilters): Promise<FinancialReportData[]> {
  // This is a placeholder - will be replaced with actual API calls
  console.log('Fetching financial reports with filters:', filters);
  
  // For now, return mock data
  return Promise.resolve(financialReportMockData);
}

// Format currency with proper locale
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

// Format date for display
export function formatReportDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate totals for a report
export function calculateReportTotals(reports: FinancialReportData[]): { 
  income: number; 
  expense: number; 
  net: number 
} {
  const income = reports
    .filter(report => report.amount > 0)
    .reduce((sum, report) => sum + report.amount, 0);
  
  const expense = reports
    .filter(report => report.amount < 0)
    .reduce((sum, report) => sum + report.amount, 0);
  
  return {
    income,
    expense,
    net: income + expense
  };
}
