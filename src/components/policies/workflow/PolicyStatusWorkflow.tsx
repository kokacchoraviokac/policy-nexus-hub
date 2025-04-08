
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { useActivityLogger } from "@/utils/activityLogger";

interface PolicyStatusWorkflowProps {
  policy: Policy;
  onStatusUpdated?: () => void;
}

// Define valid workflow status values
type WorkflowStatus = 'imported' | 'in_progress' | 'pending_review' | 'approved' | 'rejected';

const PolicyStatusWorkflow: React.FC<PolicyStatusWorkflowProps> = ({ policy, onStatusUpdated }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const updateStatus = useMutation({
    mutationFn: async (status: WorkflowStatus) => {
      const { error } = await supabase
        .from('policies')
        .update({ workflow_status: status })
        .eq('id', policy.id);
      
      if (error) throw error;

      // Log the activity
      logActivity({
        entity_type: "policy",
        entity_id: policy.id,
        action: "update",
        details: {
          previous_status: policy.workflow_status,
          new_status: status,
          timestamp: new Date().toISOString()
        }
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      toast({
        title: t("statusUpdated"),
        description: t("policyStatusHasBeenUpdated"),
      });
      
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    },
    onError: (error: any) => {
      toast({
        title: t("errorUpdatingStatus"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Select 
            value={policy.workflow_status}
            onValueChange={(value) => updateStatus.mutate(value as WorkflowStatus)}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imported">{t("imported")}</SelectItem>
              <SelectItem value="in_progress">{t("inProgress")}</SelectItem>
              <SelectItem value="pending_review">{t("pendingReview")}</SelectItem>
              <SelectItem value="approved">{t("approved")}</SelectItem>
              <SelectItem value="rejected">{t("rejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          disabled
          className="col-span-1"
        >
          {updateStatus.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("history")
          )}
        </Button>
      </div>
    </div>
  );
};

export default PolicyStatusWorkflow;
