
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FileSpreadsheet, 
  FileEdit, 
  Clock, 
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface PolicyStatusWorkflowProps {
  policyId: string;
  currentStatus: string;
  currentWorkflowStatus: string;
  onStatusUpdated: () => void;
}

const PolicyStatusWorkflow: React.FC<PolicyStatusWorkflowProps> = ({
  policyId,
  currentStatus,
  currentWorkflowStatus,
  onStatusUpdated
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateWorkflowStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { data, error } = await supabase
        .from('policies')
        .update({ workflow_status: newStatus })
        .eq('id', policyId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      onStatusUpdated();
      toast({
        title: t("statusUpdated"),
        description: t("policyWorkflowStatusUpdated"),
      });
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
  
  const workflowStages = [
    {
      id: "draft",
      name: t("draft"),
      icon: FileSpreadsheet,
      color: "text-blue-500",
    },
    {
      id: "in_review",
      name: t("inReview"),
      icon: FileEdit,
      color: "text-orange-500",
    },
    {
      id: "ready",
      name: t("ready"),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      id: "complete",
      name: t("complete"),
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ];
  
  const getStepStatus = (stepId: string) => {
    const statusIndex = workflowStages.findIndex(stage => stage.id === currentWorkflowStatus);
    const stepIndex = workflowStages.findIndex(stage => stage.id === stepId);
    
    if (stepId === currentWorkflowStatus) return "current";
    if (stepIndex < statusIndex) return "complete";
    return "upcoming";
  };

  return (
    <div className="flex items-center justify-center w-full py-4">
      <div className="flex items-center w-full max-w-3xl">
        {workflowStages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center
                  ${getStepStatus(stage.id) === "current" ? "bg-blue-100 border-2 border-blue-500" : 
                  getStepStatus(stage.id) === "complete" ? "bg-green-100" : "bg-gray-100"}`}
              >
                <stage.icon 
                  className={`h-5 w-5 
                    ${getStepStatus(stage.id) === "current" ? stage.color : 
                    getStepStatus(stage.id) === "complete" ? "text-green-500" : "text-gray-400"}`} 
                />
              </div>
              <span 
                className={`mt-2 text-xs font-medium
                  ${getStepStatus(stage.id) === "current" ? "text-blue-700" : 
                  getStepStatus(stage.id) === "complete" ? "text-green-700" : "text-gray-500"}`}
              >
                {stage.name}
              </span>
            </div>
            
            {index < workflowStages.length - 1 && (
              <div 
                className={`flex-1 h-0.5 
                  ${getStepStatus(workflowStages[index + 1].id) === "complete" ? 
                  "bg-green-500" : getStepStatus(stage.id) === "complete" ? 
                  "bg-green-300" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PolicyStatusWorkflow;
