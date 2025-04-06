
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PolicyService from "@/services/PolicyService";
import { Policy, PolicyFilterParams } from "@/types/policies";
import { usePolicyFilters } from "./usePolicyFilters";

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
    clientId: filters.clientId,
    insurerId: filters.insurerId,
    productId: filters.productId,
    assignedTo: filters.assignedTo,
    startDateFrom: filters.startDateFrom,
    startDateTo: filters.startDateTo,
    expiryDateFrom: filters.expiryDateFrom,
    expiryDateTo: filters.expiryDateTo
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
