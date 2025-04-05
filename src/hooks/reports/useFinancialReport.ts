
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FinancialReportData, FinancialReportFilters } from "@/types/reports";
import { financialReportData, defaultFinancialFilters, fetchFinancialReports } from "@/utils/reports/financialReportUtils";

export function useFinancialReport(initialFilters?: Partial<FinancialReportFilters>) {
  const [filters, setFilters] = useState<FinancialReportFilters>({
    ...defaultFinancialFilters,
    ...initialFilters
  });
  
  const [viewMode, setViewMode] = useState<"summary" | "detail">("summary");
  
  // Query for financial report data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["financial-report", filters],
    queryFn: () => fetchFinancialReports(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FinancialReportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Calculate totals
  const calculateTotals = (reports: FinancialReportData[] = []) => {
    return reports.reduce((acc, report) => {
      return {
        totalAmount: acc.totalAmount + report.amount,
        incomeAmount: report.type === "income" ? acc.incomeAmount + report.amount : acc.incomeAmount,
        expenseAmount: report.type === "expense" ? acc.expenseAmount + report.amount : acc.expenseAmount,
        transactionsCount: acc.transactionsCount + (report.transactions?.length || 0)
      };
    }, {
      totalAmount: 0,
      incomeAmount: 0,
      expenseAmount: 0,
      transactionsCount: 0
    });
  };
  
  const totals = calculateTotals(data);
  
  // Apply date filtering
  const applyDateFilter = (reports: FinancialReportData[] = [], dateFrom?: Date | string, dateTo?: Date | string) => {
    if (!dateFrom && !dateTo) return reports;
    
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      
      if (dateFrom && dateTo) {
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        return reportDate >= fromDate && reportDate <= toDate;
      }
      
      if (dateFrom) {
        return reportDate >= new Date(dateFrom);
      }
      
      if (dateTo) {
        return reportDate <= new Date(dateTo);
      }
      
      return true;
    });
  };
  
  // Generate date range options
  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "thisQuarter", label: "This Quarter" },
    { value: "lastQuarter", label: "Last Quarter" },
    { value: "thisYear", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
    { value: "custom", label: "Custom Range" }
  ];
  
  return {
    reports: data || [],
    isLoading,
    error,
    filters,
    setFilters,
    handleFilterChange,
    viewMode,
    setViewMode,
    totals,
    refetch,
    dateRangeOptions,
    defaultFilters: defaultFinancialFilters
  };
}
