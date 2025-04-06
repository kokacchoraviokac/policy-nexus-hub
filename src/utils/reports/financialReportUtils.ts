
import { FinancialReportData, FinancialReportFilters } from '@/types/reports';

// Export the FinancialTransaction type for components
export type { FinancialReportData as FinancialTransaction };

// Set of default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  searchTerm: '',
  dateFrom: '',
  dateTo: '',
  transactionType: 'all',
  category: 'all',
  status: 'all',
  entityType: 'all',
  // Aliases
  startDate: '',
  endDate: ''
};

// Mock function for fetching financial reports - replace with actual API call
export const fetchFinancialReports = async (filters: FinancialReportFilters): Promise<FinancialReportData[]> => {
  console.log('Fetching financial reports with filters:', filters);
  // This would be replaced with an actual API call in a real implementation
  return mockFinancialData;
};

// Format currency values for display
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Mock data for testing
const mockFinancialData: FinancialReportData[] = [
  {
    id: '1',
    date: '2023-01-15',
    type: 'income',
    description: 'Policy Premium Payment',
    reference: 'POL-123456',
    amount: 1200.00,
    currency: 'EUR',
    entity_id: 'client-001',
    entity_type: 'client',
    status: 'completed',
    category: 'policy'
  },
  {
    id: '2',
    date: '2023-02-01',
    type: 'expense',
    description: 'Claim Payment',
    reference: 'CLM-789012',
    amount: 800.00,
    currency: 'EUR',
    entity_id: 'claim-001',
    entity_type: 'claim',
    status: 'completed',
    category: 'claim'
  },
  {
    id: '3',
    date: '2023-02-15',
    type: 'commission',
    description: 'Agent Commission',
    reference: 'COM-345678',
    amount: 150.00,
    currency: 'EUR',
    entity_id: 'agent-001',
    entity_type: 'agent',
    status: 'pending',
    category: 'commission'
  }
];
