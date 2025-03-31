
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface WorkflowPolicyFilters {
  search: string;
  status: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const useWorkflowPolicies = (workflowType: "pending" | "reviewed" | "all" = "pending") => {
  const { t } = useLanguage();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<WorkflowPolicyFilters>({
    search: "",
    status: "all",
  });
  
  const fetchPolicies = async () => {
    setIsLoading(true);
    
    try {
      // Calculate pagination values
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Start building the query
      let query = supabase
        .from("policies")
        .select("*", { count: "exact" });
      
      // Apply workflow type filter
      if (workflowType === "pending") {
        query = query.in("workflow_status", ["draft", "review"]);
      } else if (workflowType === "reviewed") {
        query = query.in("workflow_status", ["approved", "finalized"]);
      }
      
      // Apply search filter
      if (filters.search) {
        query = query.ilike("policy_number", `%${filters.search}%`);
      }
      
      // Apply status filter
      if (filters.status && filters.status !== "all") {
        query = query.eq("workflow_status", filters.status);
      }
      
      // Apply date range filters
      if (filters.dateFrom) {
        query = query.gte("start_date", filters.dateFrom.toISOString().split('T')[0]);
      }
      
      if (filters.dateTo) {
        query = query.lte("expiry_date", filters.dateTo.toISOString().split('T')[0]);
      }
      
      // Add pagination
      query = query.range(from, to).order('created_at', { ascending: false });
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      setPolicies(data as Policy[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error(t("errorFetchingPolicies"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPolicies();
  }, [page, pageSize, filters, workflowType]);
  
  const refreshPolicies = () => {
    fetchPolicies();
  };
  
  return {
    policies,
    isLoading,
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
