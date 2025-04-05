
import { useState, useCallback } from 'react';
import { 
  financialReportMockData, 
  FinancialReportFilters, 
  defaultFinancialReportFilters,
  FinancialReportData
} from '@/utils/reports/financialReportUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { downloadToExcel } from '@/utils/excel';

export const useFinancialReport = () => {
  const [filters, setFilters] = useState<FinancialReportFilters>(defaultFinancialReportFilters);
  const [data, setData] = useState<FinancialReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  
  const updateFilters = useCallback((newFilters: Partial<FinancialReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const runReport = useCallback(async () => {
    setLoading(true);
    
    try {
      // In a real application, this would make an API call to fetch the data
      // based on the filters. For this example, we'll use mock data with some filtering.
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter the mock data based on date range and other filters
      const filteredData = financialReportMockData.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        
        const dateInRange = itemDate >= fromDate && itemDate <= toDate;
        const typeMatches = !filters.transactionType || item.type === filters.transactionType;
        const categoryMatches = !filters.category || item.category === filters.category;
        const statusMatches = !filters.status || item.status === filters.status;
        
        return dateInRange && typeMatches && categoryMatches && statusMatches;
      });
      
      setData(filteredData);
    } catch (error) {
      console.error('Error running financial report:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  const exportToExcel = useCallback(() => {
    if (data.length === 0) return;
    
    // Prepare data for Excel export
    const exportData = data.flatMap(item => {
      return item.transactions.map(transaction => ({
        Date: transaction.date,
        Type: transaction.type,
        Category: transaction.category,
        Description: transaction.description,
        Reference: transaction.reference,
        Amount: transaction.amount,
        Currency: transaction.currency,
        Status: transaction.status
      }));
    });
    
    downloadToExcel(exportData, 'financial-report');
  }, [data]);
  
  return {
    filters,
    updateFilters,
    runReport,
    data,
    loading,
    exportToExcel
  };
};
