
import { supabase } from "@/integrations/supabase/client";

// Define the interfaces for financial reports
export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  searchTerm: string;
  startDate: string;
  endDate: string;
  entityType: string; // Required by the component
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
  category: string;
  reference: string;
  type: string; // Required by the component
  currency: string; // Required by the component
}

export interface FinancialReportData {
  id?: string;
  title?: string;
  filters?: FinancialReportFilters;
  summary?: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
  };
  data: FinancialTransaction[];
  description?: string; // Required by some components
}

// Default filters for financial reports
export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: "",
  dateTo: "",
  transactionType: "all",
  category: "all",
  status: "all",
  searchTerm: "",
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  entityType: "transaction" // Default entity type
};

// Fetch financial report data based on filters
export const fetchFinancialReportData = async (
  filters: FinancialReportFilters
): Promise<FinancialReportData> => {
  try {
    // Start building the query
    let query = supabase
      .from('bank_transactions')
      .select('*');
    
    // Apply date filters
    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    
    // Apply transaction type filter
    if (filters.transactionType && filters.transactionType !== 'all') {
      query = query.eq('type', filters.transactionType);
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    // Apply search term
    if (filters.searchTerm) {
      query = query.ilike('description', `%${filters.searchTerm}%`);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching financial data:', error);
      throw new Error(`Failed to fetch financial data: ${error.message}`);
    }
    
    // Transform the data to match our FinancialTransaction interface
    const transactions: FinancialTransaction[] = data.map(item => ({
      id: item.id,
      date: item.transaction_date,
      description: item.description,
      amount: item.amount,
      status: item.status,
      category: item.category || 'Uncategorized',
      reference: item.reference || '',
      type: item.matched_invoice_id ? 'invoice' : (item.matched_policy_id ? 'policy' : 'other'),
      currency: 'EUR' // Default currency
    }));
    
    // Calculate summary
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netAmount = totalIncome - totalExpenses;
    
    // Return the formatted report data
    return {
      id: `report-${Date.now()}`,
      title: 'Financial Report',
      filters,
      summary: {
        totalIncome,
        totalExpenses,
        netAmount
      },
      data: transactions,
      description: `Financial report for period ${filters.startDate} to ${filters.endDate}`
    };
  } catch (error) {
    console.error('Error in fetchFinancialReportData:', error);
    throw error;
  }
};

// Format currency values for display
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
};
