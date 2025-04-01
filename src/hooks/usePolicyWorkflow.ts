
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const usePolicyWorkflow = (policyId?: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: policy, isLoading, error, refetch } = useQuery({
    queryKey: ["policy-workflow", policyId],
    queryFn: async () => {
      if (!policyId) return null;
      
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("id", policyId)
        .single();
      
      if (error) throw error;
      return data as Policy;
    },
    enabled: !!policyId,
  });
  
  const updateWorkflowStatus = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!policyId) throw new Error("Policy ID is required");
      
      const { data, error } = await supabase
        .from("policies")
        .update({ 
          workflow_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", policyId)
        .select();
      
      if (error) throw error;
      return data[0] as Policy;
    },
    onSuccess: (updatedPolicy) => {
      queryClient.invalidateQueries({ queryKey: ["policy-workflow", policyId] });
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      
      toast({
        title: t("statusUpdated"),
        description: t("policyWorkflowStatusUpdated"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message || t("errorUpdatingWorkflowStatus"),
        variant: "destructive",
      });
    },
  });
  
  const nextWorkflowState = (currentStatus: string): string => {
    switch (currentStatus) {
      case "draft":
        return "in_review";
      case "in_review":
        return "ready";
      case "ready":
        return "complete";
      default:
        return currentStatus;
    }
  };
  
  const advanceWorkflow = () => {
    if (!policy) return;
    
    const nextStatus = nextWorkflowState(policy.workflow_status);
    if (nextStatus !== policy.workflow_status) {
      updateWorkflowStatus.mutate(nextStatus);
    }
  };
  
  return {
    policy,
    isLoading,
    error,
    updateWorkflowStatus: updateWorkflowStatus.mutate,
    isUpdating: updateWorkflowStatus.isPending,
    advanceWorkflow,
    refetch,
  };
};
