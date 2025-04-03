
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Policy } from "@/types/policies";
import { PolicyService } from "@/services/PolicyService";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApiService } from "./useApiService";

export const usePoliciesWorkflow = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { executeService } = useApiService();
  
  const [activeTab, setActiveTab] = useState("draft");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;

  // Fetch policies using the PolicyService
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['policies-workflow', activeTab, searchTerm, currentPage, statusFilter],
    queryFn: async () => {
      // Determine workflow status based on active tab
      let workflowStatus = undefined;
      
      if (activeTab !== 'all' && statusFilter === 'all') {
        workflowStatus = activeTab as any;
      } else if (statusFilter !== 'all') {
        workflowStatus = statusFilter as any;
      }
      
      const response = await PolicyService.getPolicies({
        page: currentPage,
        pageSize,
        search: searchTerm,
        workflowStatus,
        orderBy: 'created_at',
        orderDirection: 'desc'
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch policies");
      }
      
      return response.data;
    }
  });

  // Update policy status
  const updatePolicyStatus = async (policyId: string, status: string) => {
    return executeService(
      () => PolicyService.updatePolicyStatus(policyId, status as any),
      {
        successMessage: t("policyStatusUpdatedSuccessfully"),
        errorMessage: t("errorUpdatingPolicyStatus"),
        invalidateQueryKeys: [['policies-workflow'], ['policy', policyId]]
      }
    );
  };

  const handleRefresh = () => {
    refetch();
    
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
    policies: data?.policies || [],
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalCount: data?.totalCount || 0,
    pageSize,
    statusFilter,
    setStatusFilter,
    handleRefresh,
    updatePolicyStatus
  };
};
