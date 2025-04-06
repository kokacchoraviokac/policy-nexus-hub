
import { supabase } from "@/integrations/supabase/client";

export interface FinancialReportFilters {
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  category: string;
  status: string;
  searchTerm: string;
  startDate: string;
  endDate: string;
  entityType: string; // Required field
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: string;
  category: string;
  status: string;
  reference?: string;
  entity_id?: string;
  entity_type?: string;
}

export interface FinancialReportData {
  data: FinancialTransaction[];
  meta: {
    total: number;
    filtered: number;
    dateRange: {
      from: string;
      to: string;
    }
  };
  description?: string;
}

export const defaultFinancialFilters: FinancialReportFilters = {
  dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  transactionType: 'all',
  category: 'all',
  status: 'all',
  searchTerm: '',
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  entityType: 'all'
};

export const fetchFinancialReportData = async (
  filters: FinancialReportFilters
): Promise<FinancialReportData> => {
  try {
    // Mock implementation - replace with actual API call
    // This would typically query bank_transactions, commissions, payments, etc.
    
    const { data: transactions, error } = await supabase
      .from('bank_transactions')
      .select('*')
      .gte('transaction_date', filters.dateFrom)
      .lte('transaction_date', filters.dateTo)
      .order('transaction_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching financial data:', error);
      throw new Error(`Failed to fetch financial report: ${error.message}`);
    }
    
    // Transform the data
    const formattedData = (transactions || []).map(tx => ({
      id: tx.id,
      amount: tx.amount || 0,
      date: tx.transaction_date,
      description: tx.description || '',
      type: tx.amount > 0 ? 'income' : 'expense',
      category: 'default', // Add your categories here
      status: tx.status || 'completed',
      reference: tx.reference || '',
      entity_id: tx.matched_policy_id || tx.matched_invoice_id,
      entity_type: tx.matched_policy_id ? 'policy' : tx.matched_invoice_id ? 'invoice' : ''
    }));

    return {
      data: formattedData,
      meta: {
        total: formattedData.length,
        filtered: formattedData.length,
        dateRange: {
          from: filters.dateFrom,
          to: filters.dateTo
        }
      }
    };
  } catch (error) {
    console.error('Error in fetchFinancialReportData:', error);
    // Return empty report on error
    return {
      data: [],
      meta: {
        total: 0,
        filtered: 0,
        dateRange: {
          from: filters.dateFrom,
          to: filters.dateTo
        }
      }
    };
  }
};

export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};
