
import { FinancialReportData, FinancialReportFilters, FinancialTransaction } from "@/types/reports";
import { supabase } from "@/integrations/supabase/client";

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

/**
 * Fetch financial report data based on filters
 */
export async function fetchFinancialReportData(filters: FinancialReportFilters): Promise<{ data: FinancialReportData[] }> {
  try {
    // Simulate fetching data from API or database
    // In a real application, this would call your backend API
    
    // For now, return mock data
    const mockData: FinancialReportData[] = [
      {
        id: '1',
        date: '2023-01-01',
        amount: 1500,
        type: 'income',
        category: 'commission',
        status: 'completed',
        reference: 'INV-001',
        entityId: 'policy-123',
        entityType: 'policy',
        entityName: 'Auto Insurance Policy',
        description: 'Commission for policy renewal',
        currency: 'EUR'
      },
      {
        id: '2',
        date: '2023-01-15',
        amount: -200,
        type: 'expense',
        category: 'operational',
        status: 'completed',
        reference: 'EXP-001',
        entityId: '',
        entityType: '',
        entityName: '',
        description: 'Office supplies',
        currency: 'EUR'
      }
    ];
    
    return { data: mockData };
  } catch (error) {
    console.error("Error fetching financial report data:", error);
    throw error;
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(amount);
}

// Export the types - use 'export type' with isolatedModules enabled
export type { FinancialTransaction, FinancialReportFilters };
