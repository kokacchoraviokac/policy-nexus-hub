
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const usePoliciesWorkflow = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("draft");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;

  useEffect(() => {
    fetchPolicies();
  }, [activeTab, searchTerm, currentPage, statusFilter]);

  const fetchPolicies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Determine which workflow statuses to fetch based on active tab
      let workflowStatuses: string[] = [];
      
      if (activeTab === "draft") {
        workflowStatuses = ["draft", "in_review"];
      } else if (activeTab === "ready") {
        workflowStatuses = ["ready"];
      } else if (activeTab === "complete") {
        workflowStatuses = ["complete"];
      }
      
      // If statusFilter is not 'all', override with the specific filter
      if (statusFilter !== "all") {
        workflowStatuses = [statusFilter];
      }
      
      // Calculate pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Build query
      let query = supabase
        .from("policies")
        .select("*", { count: "exact" });
      
      // Apply workflow status filter
      if (workflowStatuses.length > 0) {
        query = query.in("workflow_status", workflowStatuses);
      }
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`
        );
      }
      
      // Apply pagination
      query = query.range(from, to).order("created_at", { ascending: false });
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setPolicies(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError(err instanceof Error ? err : new Error("Unknown error fetching policies"));
      
      toast({
        title: t("error"),
        description: t("errorLoadingPolicies"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPolicies();
    
    toast({
      title: t("refreshing"),
      description: t("refreshingPolicies"),
    });
  };

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    policies,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalCount,
    pageSize,
    statusFilter,
    setStatusFilter,
    handleRefresh,
    fetchPolicies
  };
};
