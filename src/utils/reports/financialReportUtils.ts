
import { FinancialReportData, FinancialReportFilters } from '@/types/reports';

// Default financial filters
export const defaultFinancialFilters: FinancialReportFilters = {
  searchTerm: '',
  dateFrom: '',
  dateTo: '',
  transactionType: 'all',
  category: 'all',
  status: 'all',
  entityType: 'all'
};

// Format currency based on locale and currency code
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Extract unique values for a specific field in the data
export const getUniqueValues = (data: FinancialReportData[], field: keyof FinancialReportData): string[] => {
  const values = data.map(item => item[field]);
  return [...new Set(values)].filter(Boolean) as string[];
};

// Calculate total amount of transactions
export const calculateTotalAmount = (data: FinancialReportData[]): number => {
  return data.reduce((total, item) => total + item.amount, 0);
};

// Fetch financial reports from API or service
export const fetchFinancialReports = async (filters: FinancialReportFilters): Promise<FinancialReportData[]> => {
  // This would typically be an API call
  // For now, return empty array as placeholder
  console.log('Fetching financial reports with filters:', filters);
  return [];
};

// Group financial data by a specific field
export const groupFinancialData = (
  data: FinancialReportData[], 
  groupBy: keyof FinancialReportData
): Record<string, FinancialReportData[]> => {
  return data.reduce((groups, item) => {
    const key = String(item[groupBy] || 'unknown');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, FinancialReportData[]>);
};

// Filter financial data based on filters
export const filterFinancialData = (
  data: FinancialReportData[],
  filters: FinancialReportFilters
): FinancialReportData[] => {
  return data.filter(item => {
    // Apply all filters
    if (filters.searchTerm && 
        !item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !item.reference.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) {
      return false;
    }
    
    if (filters.transactionType !== 'all' && item.type !== filters.transactionType) {
      return false;
    }
    
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }
    
    if (filters.entityType !== 'all' && item.entity_type !== filters.entityType) {
      return false;
    }
    
    return true;
  });
};
