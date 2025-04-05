
import { FinancialReportData, FinancialReportFilters, FinancialTransaction } from '@/types/reports';

export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  dateTo: new Date(),
  entityType: [],
  transactionType: [],
  category: [],
  searchTerm: '',
  startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  endDate: new Date()
};

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Helper to filter financial report data based on filters
export function filterFinancialData(
  data: FinancialReportData[],
  filters: FinancialReportFilters
): FinancialReportData[] {
  return data.filter(item => {
    // Date filtering
    const itemDate = new Date(item.date);
    const fromDate = filters.dateFrom instanceof Date 
      ? filters.dateFrom 
      : new Date(filters.dateFrom);
    const toDate = filters.dateTo instanceof Date 
      ? filters.dateTo 
      : new Date(filters.dateTo);
    
    if (itemDate < fromDate || itemDate > toDate) {
      return false;
    }
    
    // Entity type filtering
    if (filters.entityType.length > 0 && !filters.entityType.includes(item.entity_type || '')) {
      return false;
    }
    
    // Transaction type filtering
    if (filters.transactionType.length > 0 && !filters.transactionType.includes(item.type)) {
      return false;
    }
    
    // Category filtering
    if (filters.category.length > 0 && !filters.category.includes(item.category)) {
      return false;
    }
    
    // Search term filtering
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        item.description.toLowerCase().includes(searchLower) ||
        item.reference.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });
}

// Generate mock financial data for development/testing
export function generateMockFinancialData(count: number = 20): FinancialReportData[] {
  const types = ['payment', 'refund', 'commission', 'adjustment'];
  const categories = ['policy', 'claim', 'administrative', 'other'];
  const statuses = ['completed', 'pending', 'cancelled'];
  
  const result: FinancialReportData[] = [];
  
  for (let i = 0; i < count; i++) {
    const transactions: FinancialTransaction[] = [];
    
    // Add 1-3 transactions per report
    const transactionCount = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < transactionCount; j++) {
      transactions.push({
        id: `transaction-${i}-${j}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        description: `Transaction ${j} for item ${i}`,
        reference: `REF-${Math.floor(Math.random() * 10000)}`,
        amount: Math.round(Math.random() * 10000) / 100,
        currency: 'USD',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    }
    
    result.push({
      id: `financial-item-${i}`,
      date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      description: `Financial item ${i}`,
      reference: `REF-${Math.floor(Math.random() * 10000)}`,
      amount: Math.round(Math.random() * 20000) / 100,
      currency: 'USD',
      entity_id: Math.random() > 0.2 ? `entity-${Math.floor(Math.random() * 100)}` : undefined,
      entity_type: Math.random() > 0.2 ? categories[Math.floor(Math.random() * categories.length)] : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      transactions
    });
  }
  
  return result;
}

// Export for reuse
export const financialReportMockData = generateMockFinancialData(30);
