
import { supabase } from "@/integrations/supabase/client";
import { FinancialReportData, FinancialReportFilters } from "@/types/reports";

// Default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  searchTerm: "",
  dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  transactionType: "all",
  category: "all",
  status: "all",
  entityType: "all",
  // Aliases for compatibility
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
};

/**
 * Fetch financial reports based on filters
 */
export const fetchFinancialReports = async (filters: FinancialReportFilters): Promise<FinancialReportData[]> => {
  try {
    // This is a simplified implementation - in a real app, this would query specific tables
    // For now, we'll just simulate fetching financial data
    
    // In a real implementation, you would query your financial_transactions table
    // const { data, error } = await supabase
    //   .from('financial_transactions')
    //   .select('*')
    //   .gte('date', filters.dateFrom)
    //   .lt('date', filters.dateTo);
    
    // Since we don't know the exact table structure, let's return mock data
    const mockData: FinancialReportData[] = [
      {
        id: "1",
        date: "2023-09-15",
        type: "income",
        description: "Policy premium payment",
        reference: "POL-123456",
        amount: 1250.00,
        currency: "EUR",
        entity_id: "policy-123",
        entity_type: "policy",
        status: "completed",
        category: "policy"
      },
      {
        id: "2",
        date: "2023-09-20",
        type: "expense",
        description: "Claim payout",
        reference: "CLM-789012",
        amount: 850.00,
        currency: "EUR",
        entity_id: "claim-456",
        entity_type: "claim",
        status: "completed",
        category: "claim"
      },
      {
        id: "3",
        date: "2023-09-25",
        type: "commission",
        description: "Agent commission",
        reference: "COM-345678",
        amount: 125.00,
        currency: "EUR",
        entity_id: "agent-789",
        entity_type: "agent",
        status: "pending",
        category: "commission"
      }
    ];
    
    // Apply filters to mock data
    let filteredData = mockData;
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.description.toLowerCase().includes(searchLower) || 
        item.reference.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.transactionType && filters.transactionType !== 'all') {
      filteredData = filteredData.filter(item => item.type === filters.transactionType);
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item => item.category === filters.category);
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }
    
    if (filters.entityType && filters.entityType !== 'all') {
      filteredData = filteredData.filter(item => item.entity_type === filters.entityType);
    }
    
    return filteredData;
  } catch (error) {
    console.error("Error fetching financial reports:", error);
    return [];
  }
};

// Format currency values
export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Export the type alias to match import expectations
export type { FinancialReportData };
export type { FinancialTransaction } from "@/types/reports";
