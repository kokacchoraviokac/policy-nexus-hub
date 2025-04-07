
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { EntityType } from "@/types/common";
import { useActivityLogger } from "@/utils/activityLogger";

interface PolicyReviewActionsProps {
  policy: Policy;
  isComplete: boolean;
}

const PolicyReviewActions: React.FC<PolicyReviewActionsProps> = ({
  policy,
  isComplete,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  // Mutation to approve the policy
  const approveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('policies')
        .update({ workflow_status: 'approved' })
        .eq('id', policy.id);
      
      if (error) throw error;

      // Log the activity
      logActivity({
        entity_type: EntityType.POLICY,
        entity_id: policy.id,
        action: "update",
        details: {
          status: "approved",
          timestamp: new Date().toISOString()
        }
      });
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate policies queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      queryClient.invalidateQueries({ queryKey: ['workflow-policies'] });
      
      // Show success toast
      toast({
        title: t("policyApproved"),
        description: t("policyHasBeenApproved"),
      });
      
      // Navigate back to workflow list
      navigate('/policies/workflow');
    },
    onError: (error: any) => {
      toast({
        title: t("errorApprovingPolicy"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  // Mutation to reject the policy
  const rejectMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('policies')
        .update({ workflow_status: 'rejected' })
        .eq('id', policy.id);
      
      if (error) throw error;

      // Log the activity
      logActivity({
        entity_type: EntityType.POLICY,
        entity_id: policy.id,
        action: "update",
        details: {
          status: "rejected",
          timestamp: new Date().toISOString()
        }
      });
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate policies queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      queryClient.invalidateQueries({ queryKey: ['workflow-policies'] });
      
      // Show success toast
      toast({
        title: t("policyRejected"),
        description: t("policyHasBeenRejected"),
      });
      
      // Navigate back to workflow list
      navigate('/policies/workflow');
    },
    onError: (error: any) => {
      toast({
        title: t("errorRejectingPolicy"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  return (
    <div className="space-y-3">
      <Button
        className="w-full flex items-center gap-2"
        onClick={() => approveMutation.mutate()}
        disabled={!isComplete || approveMutation.isPending || rejectMutation.isPending}
      >
        {approveMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        {t("approvePolicy")}
      </Button>
      
      <Button
        variant="destructive"
        className="w-full flex items-center gap-2"
        onClick={() => rejectMutation.mutate()}
        disabled={approveMutation.isPending || rejectMutation.isPending}
      >
        {rejectMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        {t("rejectPolicy")}
      </Button>
    </div>
  );
};

export default PolicyReviewActions;
