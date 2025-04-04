
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { useActivityLogger } from "@/utils/activityLogger";
import { useApiService } from "@/hooks/useApiService";
import { PolicyService } from "@/services/PolicyService";

interface PolicyStatusWorkflowProps {
  policy: Policy;
  onStatusUpdated?: () => void;
}

// Define valid workflow status values
type WorkflowStatus = 'draft' | 'in_review' | 'ready' | 'complete';

const PolicyStatusWorkflow: React.FC<PolicyStatusWorkflowProps> = ({ policy, onStatusUpdated }) => {
  const { t } = useLanguage();
  const { logActivity } = useActivityLogger();
  const { isLoading, executeService } = useApiService();
  
  const handleStatusChange = async (status: string) => {
    if (status === policy.workflow_status) return;
    
    const result = await executeService(
      () => PolicyService.updatePolicyStatus(policy.id, status as WorkflowStatus),
      {
        successMessage: t("statusUpdated"),
        errorMessage: t("errorUpdatingStatus"),
        invalidateQueryKeys: [['policy', policy.id], ['policies-workflow']]
      }
    );
    
    if (result) {
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
      
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Select 
            value={policy.workflow_status}
            onValueChange={handleStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t("draft")}</SelectItem>
              <SelectItem value="in_review">{t("inReview")}</SelectItem>
              <SelectItem value="ready">{t("ready")}</SelectItem>
              <SelectItem value="complete">{t("complete")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          disabled
          className="col-span-1"
        >
          {isLoading ? (
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
