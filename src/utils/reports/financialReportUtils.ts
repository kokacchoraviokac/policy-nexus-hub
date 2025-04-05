
import { FinancialReportData, FinancialTransaction } from "@/types/reports";

/**
 * Format a currency amount with the specified currency symbol
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
}

/**
 * Generate mock financial report data for development/testing
 */
export function financialReportMockData(): FinancialReportData[] {
  const mockData: FinancialReportData[] = [
    {
      id: '1',
      date: '2023-11-01',
      type: 'commission',
      description: 'Monthly commission payment',
      reference: 'COM-001',
      amount: 1500,
      currency: 'EUR',
      entity_id: 'policy-123',
      entity_type: 'policy',
      status: 'completed',
      category: 'income',
      transactions: [
        {
          id: 't1',
          date: '2023-11-01',
          type: 'commission',
          description: 'Commission for Policy A',
          reference: 'COM-001-A',
          amount: 800,
          currency: 'EUR',
          entity_id: 'policy-123',
          entity_type: 'policy',
          status: 'completed',
          category: 'income'
        },
        {
          id: 't2',
          date: '2023-11-01',
          type: 'commission',
          description: 'Commission for Policy B',
          reference: 'COM-001-B',
          amount: 700,
          currency: 'EUR',
          entity_id: 'policy-124',
          entity_type: 'policy',
          status: 'completed',
          category: 'income'
        }
      ]
    },
    {
      id: '2',
      date: '2023-11-15',
      type: 'payout',
      description: 'Agent payout',
      reference: 'PAY-001',
      amount: -750,
      currency: 'EUR',
      entity_id: 'agent-123',
      entity_type: 'agent',
      status: 'completed',
      category: 'expense',
      transactions: [
        {
          id: 't3',
          date: '2023-11-15',
          type: 'payout',
          description: 'Commission payout to Agent A',
          reference: 'PAY-001-A',
          amount: -750,
          currency: 'EUR',
          entity_id: 'agent-123',
          entity_type: 'agent',
          status: 'completed',
          category: 'expense'
        }
      ]
    }
  ];
  
  return mockData;
}

/**
 * Filter financial report data based on provided filters
 */
export function filterFinancialReportData(
  data: FinancialReportData[], 
  filters: {
    dateFrom?: string | Date;
    dateTo?: string | Date;
    entityType?: string[];
    transactionType?: string[];
    category?: string[];
    searchTerm?: string;
    status?: string;
  }
): FinancialReportData[] {
  return data.filter(item => {
    // Date range filter
    if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) {
      return false;
    }
    
    // Entity type filter
    if (filters.entityType && filters.entityType.length > 0 && !filters.entityType.includes(item.entity_type || '')) {
      return false;
    }
    
    // Transaction type filter
    if (filters.transactionType && filters.transactionType.length > 0 && !filters.transactionType.includes(item.type)) {
      return false;
    }
    
    // Category filter
    if (filters.category && filters.category.length > 0 && !filters.category.includes(item.category)) {
      return false;
    }
    
    // Status filter
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      return (
        item.description.toLowerCase().includes(term) ||
        item.reference.toLowerCase().includes(term) ||
        (item.entity_id || '').toLowerCase().includes(term)
      );
    }
    
    return true;
  });
}

/**
 * Export financial report data to CSV format
 */
export function exportFinancialReportToCSV(data: FinancialReportData[]): string {
  // Create CSV header
  const header = 'Date,Type,Description,Reference,Amount,Currency,Status,Category\n';
  
  // Create CSV rows
  const rows = data.map(item => {
    return `${item.date},${item.type},"${item.description}",${item.reference},${item.amount},${item.currency},${item.status},${item.category}`;
  }).join('\n');
  
  return header + rows;
}

// Export additional types
export type { FinancialTransaction, FinancialReportData };
