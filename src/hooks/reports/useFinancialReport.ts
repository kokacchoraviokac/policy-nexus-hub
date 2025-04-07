
import { useState, useCallback, useEffect } from 'react';
import { 
  FinancialReportFilters, 
  FinancialTransaction,
  FinancialReportSummary, 
  UseFinancialReportReturn 
} from '@/types/reports';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data function - replace with actual API call when ready
const fetchFinancialData = async (filters: FinancialReportFilters): Promise<{
  data: FinancialTransaction[];
  summary: FinancialReportSummary;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock transactions
  const mockTransactions: FinancialTransaction[] = Array.from({ length: 20 }, (_, i) => ({
    id: `tx-${i}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: Math.round(Math.random() * 10000) / 100,
    currency: 'EUR',
    description: `Transaction ${i}`,
    type: Math.random() > 0.5 ? 'income' : 'expense',
    category: ['premium', 'commission', 'fee', 'refund'][Math.floor(Math.random() * 4)],
    reference: `REF-${Math.floor(Math.random() * 10000)}`,
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)]
  }));
  
  // Mock summary
  const incomeTransactions = mockTransactions.filter(t => t.type === 'income');
  const expenseTransactions = mockTransactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    data: mockTransactions,
    summary: {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses
    }
  };
};

export const useFinancialReport = (): UseFinancialReportReturn => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const defaultFilters: FinancialReportFilters = {
    dateFrom: new Date(new Date().setDate(1)), // First day of current month
    dateTo: new Date(),
    categoryFilter: '',
    statusFilter: '',
    entityFilter: '',
  };
  
  const [filters, setFilters] = useState<FinancialReportFilters>(defaultFilters);
  const [data, setData] = useState<FinancialTransaction[]>([]);
  const [summary, setSummary] = useState<FinancialReportSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Create a reports object to match the expected structure
  const reports = {
    data,
    summary
  };
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFinancialData(filters);
      setData(result.data);
      setSummary(result.summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch financial data';
      setError(new Error(errorMessage));
      toast({
        title: t('errorFetchingData'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast, t]);
  
  const exportData = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast({
        title: t('exportSuccessful'),
        description: t('dataExportedSuccessfully'),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export data';
      toast({
        title: t('exportFailed'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast, t]);
  
  // Implement additional helper methods for interface compatibility
  const applyFilters = () => {
    fetchData();
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    data,
    summary,
    loading,
    error,
    filters,
    setFilters,
    fetchData,
    exportData,
    isExporting,
    defaultFilters,
    isLoading: loading,
    isError: !!error,
    reports,
    applyFilters,
    resetFilters
  };
};

export default useFinancialReport;
