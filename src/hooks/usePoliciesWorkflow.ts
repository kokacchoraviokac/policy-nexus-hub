
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PolicyService from "@/services/PolicyService";
import { Policy, PolicyFilterParams } from "@/types/policies";

// Create a basic usePolicyFilters hook since the import is missing
const usePolicyFilters = (initialFilters: Partial<PolicyFilterParams>) => {
  const [filters, setFiltersState] = useState<Partial<PolicyFilterParams>>(initialFilters);
  
  const setFilter = (key: keyof PolicyFilterParams, value: any) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFiltersState(initialFilters);
  };
  
  return { filters, setFilter, resetFilters };
};

export function usePoliciesWorkflow() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { filters, setFilter, resetFilters } = usePolicyFilters({});
  
  // Use combined filter state
  const allFilters: PolicyFilterParams = {
    page: currentPage,
    pageSize,
    searchTerm: filters.searchTerm,
    status: filters.status,
    workflowStatus: filters.workflowStatus,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection as 'asc' | 'desc',
    // Optional filters that might be missing from type, but we'll include them anyway
    clientId: filters.clientId as any,
    insurerId: filters.insurerId as any,
    productId: filters.productId as any,
    assignedTo: filters.assignedTo as any,
    startDateFrom: filters.startDateFrom as any,
    startDateTo: filters.startDateTo as any,
    expiryDateFrom: filters.expiryDateFrom as any,
    expiryDateTo: filters.expiryDateTo as any
  };
  
  const {
    data: policiesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["policies-workflow", allFilters],
    queryFn: () => PolicyService.fetchPolicies(allFilters),
  });
  
  const policies = policiesData || [];
  const totalCount = policies.length; // Replace with API response count when available
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  return {
    policies,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    filters,
    setFilter,
    resetFilters,
  };
}
