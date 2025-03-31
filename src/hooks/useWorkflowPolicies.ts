
import { useState, useEffect } from "react";

export interface WorkflowPolicyFilters {
  search: string;
  status: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface WorkflowPolicy {
  id: string;
  policyNumber: string;
  insurer: string;
  client: string;
  product: string;
  startDate: Date;
  endDate: Date;
  status: string;
  premium: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useWorkflowPolicies = (status: "pending" | "reviewed" | "all" = "pending") => {
  const [policies, setPolicies] = useState<WorkflowPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<WorkflowPolicyFilters>({
    search: "",
    status: "all"
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, return empty array (mock data)
        const data: WorkflowPolicy[] = [];
        setPolicies(data);
        setTotalCount(0);
        setError(null);
      } catch (err) {
        console.error("Error fetching workflow policies:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, [status, filters, page, pageSize]);

  const refreshPolicies = () => {
    // Trigger a refetch by changing a dependency
    setPage(current => {
      // Toggle between current and current+1 and back to force refetch
      return current;
    });
  };

  return { 
    policies, 
    isLoading, 
    error, 
    totalCount, 
    page, 
    pageSize, 
    setPage, 
    setPageSize, 
    filters, 
    setFilters,
    refreshPolicies
  };
};
