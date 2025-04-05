
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
      client_id: filters.client_id,
      insurer_id: filters.insurer_id,
      product_id: filters.product_id,
      status: filters.status,
      workflow_status: filters.workflow_status,
      assigned_to: filters.assigned_to,
      start_date_from: filters.start_date_from,
      start_date_to: filters.start_date_to,
      expiry_date_from: filters.expiry_date_from,
      expiry_date_to: filters.expiry_date_to,
      search: filters.search,
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
    initialPageParam: 1, // Add this line to fix the type error
    getNextPageParam: (lastGroup) => {
      const totalPages = Math.ceil(lastGroup.total / initialPageSize);
      const nextPage = lastGroup.currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 60000, // 60 seconds
  });

  const policies: Policy[] = data?.pages?.flatMap((page) => page.data) || [];
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
