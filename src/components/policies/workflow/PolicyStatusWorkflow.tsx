
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { Policy } from "@/types/policies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PolicyService } from "@/services/PolicyService";
import { useToast } from "@/hooks/use-toast";

interface PolicyStatusWorkflowProps {
  policy: Policy;
  onStatusUpdated: () => void;
}

const PolicyStatusWorkflow: React.FC<PolicyStatusWorkflowProps> = ({
  policy,
  onStatusUpdated
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Mutation to update policy status
  const updatePolicyStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await PolicyService.updatePolicyStatus(policy.id, newStatus);
      if (!response.success) {
        throw new Error(response.error?.toString() || "Failed to update policy status");
      }
      return response.data;
    },
    onMutate: () => {
      setIsUpdating(true);
    },
    onSuccess: () => {
      toast({
        title: t("success"),
        description: t("policyStatusUpdated")
      });
      queryClient.invalidateQueries({ queryKey: ["policy", policy.id] });
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      onStatusUpdated();
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("errorUpdatingPolicyStatus"),
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });
  
  const getNextStatus = () => {
    switch (policy.workflow_status) {
      case "draft":
        return "in_review";
      case "in_review":
        return "ready";
      case "ready":
        return "complete";
      default:
        return null;
    }
  };
  
  const getButtonText = () => {
    switch (policy.workflow_status) {
      case "draft":
        return t("moveToReview");
      case "in_review":
        return t("markAsReady");
      case "ready":
        return t("finalizePolicy");
      case "complete":
        return t("alreadyComplete");
      default:
        return t("updateStatus");
    }
  };
  
  const handleUpdateStatus = () => {
    const nextStatus = getNextStatus();
    if (nextStatus && !isUpdating) {
      updatePolicyStatusMutation.mutate(nextStatus);
    }
  };
  
  // Don't show the workflow controls if policy is complete
  if (policy.workflow_status === "complete") {
    return null;
  }
  
  return (
    <div className="flex items-center">
      <Button
        variant="default"
        size="sm"
        className="w-full"
        disabled={isUpdating || policy.workflow_status === "complete"}
        onClick={handleUpdateStatus}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2" />
        )}
        {getButtonText()}
      </Button>
    </div>
  );
};

export default PolicyStatusWorkflow;
