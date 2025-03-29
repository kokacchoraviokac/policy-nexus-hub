
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActivityLogger } from "@/utils/activityLogger";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Policy } from "@/types/policies";
import { 
  CheckCircle, 
  ClipboardList, 
  FileCheck, 
  ArrowLeft,
  AlertTriangle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicyReviewActionsProps {
  policy: Policy;
  isComplete: boolean;
}

const PolicyReviewActions: React.FC<PolicyReviewActionsProps> = ({ 
  policy, 
  isComplete 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  const { toast } = useToast();

  const updateWorkflowStatus = useMutation({
    mutationFn: async (newStatus: string) => {
      const { data, error } = await supabase
        .from('policies')
        .update({ 
          workflow_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', policy.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      
      logActivity({
        entityType: "policy",
        entityId: policy.id,
        action: "update",
        details: {
          changes: { 
            workflow_status: { 
              old: policy.workflow_status, 
              new: newStatus 
            }
          }
        }
      });
      
      toast({
        title: t("statusUpdated"),
        description: t("policyWorkflowStatusUpdated", { status: t(newStatus.replace('_', '')) }),
      });
      
      if (newStatus === 'complete') {
        // Navigate back to workflow page after finalization
        setTimeout(() => {
          navigate('/policies/workflow');
        }, 1500);
      }
    },
    onError: (error) => {
      console.error("Error updating workflow status:", error);
      toast({
        title: t("errorUpdatingStatus"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  const handleUpdateStatus = (newStatus: string) => {
    updateWorkflowStatus.mutate(newStatus);
  };

  const getActionButton = () => {
    switch (policy.workflow_status) {
      case 'draft':
        return (
          <Button 
            onClick={() => handleUpdateStatus('in_review')} 
            className="w-full"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            {t("moveToReview")}
          </Button>
        );
      case 'in_review':
        return (
          <Button 
            onClick={() => handleUpdateStatus('ready')} 
            className="w-full"
            disabled={!isComplete}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            {t("markAsReady")}
          </Button>
        );
      case 'ready':
        return (
          <Button 
            onClick={() => handleUpdateStatus('complete')} 
            className="w-full"
            disabled={!isComplete}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("finalizePolicy")}
          </Button>
        );
      case 'complete':
        // Policy is already complete
        return (
          <Button 
            disabled
            variant="outline" 
            className="w-full bg-green-50"
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            {t("complete")}
          </Button>
        );
      default:
        return null;
    }
  };

  const getStatusExplanation = () => {
    switch (policy.workflow_status) {
      case 'draft':
        return <p className="text-sm text-muted-foreground">
          {t("draftStageDescription")}. {t("moveToReview")} {t("toBeginTheProcess")}.
        </p>;
      case 'in_review':
        return <p className="text-sm text-muted-foreground">
          {t("inReviewStageDescription")}. {isComplete ? t("readyForFinalization") : t("missingInformation")}.
        </p>;
      case 'ready':
        return <p className="text-sm text-muted-foreground">
          {t("readyStageDescription")}. {isComplete ? t("readyForFinalization") : t("missingInformation")}.
        </p>;
      case 'complete':
        return <p className="text-sm text-green-600">
          {t("completeStageDescription")}.
        </p>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t("workflowActions")}</h3>
      <p className="text-sm text-muted-foreground">{t("manageWorkflowStatusOfPolicy")}</p>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800 text-sm">
          {t("policyImportInfo")}
        </AlertDescription>
      </Alert>
      
      {getStatusExplanation()}
      
      <div className="flex flex-col gap-3">
        {getActionButton()}
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/policies/workflow')}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
      </div>
      
      {!isComplete && policy.workflow_status !== 'draft' && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm ml-2">
            {t("completeAllRequiredFieldsToProgress")}
          </AlertDescription>
        </Alert>
      )}
      
      {updateWorkflowStatus.isPending && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {t("updatingStatus")}...
        </p>
      )}
    </div>
  );
};

export default PolicyReviewActions;
