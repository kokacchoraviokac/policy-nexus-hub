
import { FinancialReportData, FinancialReportFilters, FinancialTransaction } from "@/types/reports";
import { supabase } from "@/integrations/supabase/client";

// Default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  dateTo: new Date(),
  entityType: "all",
  transactionType: "all",
  category: "all",
  searchTerm: "",
  status: "all"
};

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = "EUR") {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Fetch financial report data based on filters
 */
export async function fetchFinancialReports(filters: FinancialReportFilters): Promise<FinancialReportData[]> {
  try {
    // Base query to get financial transactions
    const query = supabase.from("financial_transactions")
      .select("*")
      .gte("date", filters.dateFrom.toString())
      .lte("date", filters.dateTo.toString());
    
    // Apply filters
    if (filters.entityType && filters.entityType !== "all") {
      query.eq("entity_type", filters.entityType);
    }
    
    if (filters.transactionType && filters.transactionType !== "all") {
      query.eq("type", filters.transactionType);
    }
    
    if (filters.category && filters.category !== "all") {
      query.eq("category", filters.category);
    }
    
    if (filters.status && filters.status !== "all") {
      query.eq("status", filters.status);
    }
    
    if (filters.searchTerm) {
      query.or(`description.ilike.%${filters.searchTerm}%,reference.ilike.%${filters.searchTerm}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Format the data for the report
    const reportData = data.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      type: transaction.type,
      description: transaction.description,
      reference: transaction.reference,
      amount: transaction.amount,
      currency: transaction.currency,
      entity_id: transaction.entity_id,
      entity_type: transaction.entity_type,
      status: transaction.status,
      category: transaction.category,
      transactions: [] // This would be populated if needed
    }));
    
    return reportData;
  } catch (error) {
    console.error("Error fetching financial reports:", error);
    throw error;
  }
}

// Export the type for use in other files
export type { FinancialReportData, FinancialTransaction };
