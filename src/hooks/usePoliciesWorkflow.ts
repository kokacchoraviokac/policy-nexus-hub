
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PolicyService } from "@/services/PolicyService";
import { Policy, PolicyFilterParams } from "@/types/policies";

interface UsePoliciesWorkflowProps {
  filters: Omit<PolicyFilterParams, 'page' | 'pageSize'>;
  initialPageSize?: number;
}

export const usePoliciesWorkflow = ({ filters, initialPageSize = 10 }: UsePoliciesWorkflowProps) => {
  const loadPolicies = async ({ pageParam = 1 }) => {
    const params: PolicyFilterParams = {
      page: pageParam,
      pageSize: initialPageSize,
      clientId: filters.clientId,
      insurerId: filters.insurerId,
      productId: filters.productId,
      status: filters.status,
      workflowStatus: filters.workflowStatus,
      assignedTo: filters.assignedTo,
      startDateFrom: filters.startDateFrom,
      startDateTo: filters.startDateTo,
      expiryDateFrom: filters.expiryDateFrom,
      expiryDateTo: filters.expiryDateTo,
      searchTerm: filters.searchTerm,
    };

    try {
      const response = await PolicyService.getPolicies(params);
      if (!response.success) {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : (response.error as any)?.message || 'Unknown error';
        throw new Error(errorMessage);
      }

      return {
        data: response.data,
        total: response.totalCount,
        currentPage: pageParam,
      };
    } catch (error) {
      console.error("Failed to load policies:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error loading policies';
      throw new Error(`Failed to load policies: ${errorMessage}`);
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['policies-workflow', filters],
    queryFn: loadPolicies,
    initialPageParam: 1,
    getNextPageParam: (lastGroup) => {
      const totalPages = Math.ceil(lastGroup.total / initialPageSize);
      const nextPage = lastGroup.currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 60000, // 60 seconds
  });

  // Extract all policies from pages
  const policies: Policy[] = data?.pages?.flatMap((page) => page.data) || [];
  
  // Get the total count from the first page (all pages should have the same total)
  const total = data?.pages?.[0]?.total || 0;

  return {
    policies,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
    error,
    refetch,
  };
};
