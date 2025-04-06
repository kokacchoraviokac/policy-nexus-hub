
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FinancialReportData, FinancialReportFilters, fetchFinancialReportData, defaultFinancialFilters } from "@/utils/reports/financialReportUtils";

export const useFinancialReport = (initialFilters?: Partial<FinancialReportFilters>) => {
  // Merge initial filters with defaults
  const mergedFilters = {
    ...defaultFinancialFilters,
    ...initialFilters
  };
  
  const [filters, setFilters] = useState<FinancialReportFilters>(mergedFilters);
  
  // Query for financial report data
  const { 
    data: reports, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['financial-reports', filters],
    queryFn: () => fetchFinancialReportData(filters),
    enabled: false, // Don't run automatically, we'll trigger it manually
  });
  
  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!reports?.data?.length) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0
      };
    }
    
    const income = reports.data
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const expenses = reports.data
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netAmount: income - expenses
    };
  }, [reports]);
  
  // Apply filters and run the report
  const applyFilters = () => {
    refetch();
  };
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters(defaultFinancialFilters);
  };
  
  return {
    reports,
    isLoading,
    error,
    filters,
    setFilters,
    applyFilters,
    resetFilters,
    refetch,
    summary,
    defaultFilters: defaultFinancialFilters
  };
};
