
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Policy } from "@/types/policies";
import { PolicyService } from "@/services/PolicyService";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const usePoliciesWorkflow = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
        workflowStatus = activeTab;
      } else if (statusFilter !== 'all') {
        workflowStatus = statusFilter;
      }
      
      const response = await PolicyService.getPolicies({
        page: currentPage - 1,
        pageSize,
        search: searchTerm,
        workflowStatus,
        orderBy: 'created_at',
        orderDirection: 'desc'
      });
      
      if (!response.success) {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || "Failed to fetch policies";
        throw new Error(errorMessage);
      }
      
      return response.data;
    }
  });

  // Update policy status
  const updatePolicyStatusMutation = useMutation({
    mutationFn: (params: { policyId: string, status: string }) => {
      return PolicyService.updatePolicyStatus(params.policyId, params.status);
    },
    onSuccess: () => {
      toast({
        title: t("policyStatusUpdatedSuccessfully"),
        description: t("policyWorkflowUpdated"),
      });
      queryClient.invalidateQueries({ queryKey: ['policies-workflow'] });
    },
    onError: (error: any) => {
      toast({
        title: t("errorUpdatingPolicyStatus"),
        description: error?.message || t("unknownError"),
        variant: "destructive",
      });
    }
  });

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
    updatePolicyStatus: (policyId: string, status: string) => 
      updatePolicyStatusMutation.mutate({ policyId, status }),
    isUpdatingStatus: updatePolicyStatusMutation.isPending
  };
};
