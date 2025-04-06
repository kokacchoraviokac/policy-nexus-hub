
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardCheck, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { WorkflowStatus } from "@/types/policies";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import PolicyService from "@/services/PolicyService";
import { mapPolicyStatusToBadgeVariant, mapPolicyStatusToText } from "@/utils/policies/policyMappers";

interface PolicyStatusWorkflowProps {
  status: string;
  id: string;
  onStatusChange?: (newStatus: string) => void;
}

const PolicyStatusWorkflow: React.FC<PolicyStatusWorkflowProps> = ({ status, id, onStatusChange }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      await PolicyService.updatePolicy(id, { workflow_status: newStatus });
      
      toast({
        title: t("statusUpdated"),
        description: t("policyStatusUpdatedSuccessfully"),
      });
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err: any) {
      console.error("Error updating policy status:", err);
      setError(err.message || t("errorUpdatingPolicyStatus"));
      
      toast({
        variant: "destructive",
        title: t("updateFailed"),
        description: err.message || t("errorUpdatingPolicyStatus"),
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const statusBadgeVariant = mapPolicyStatusToBadgeVariant(status);
  const statusText = mapPolicyStatusToText(status);
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{t("workflowStatus")}</h3>
            <Badge variant={statusBadgeVariant}>{statusText}</Badge>
          </div>
          
          <Separator />
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col space-y-2">
            {status === WorkflowStatus.DRAFT && (
              <Button 
                onClick={() => updateStatus(WorkflowStatus.IN_REVIEW)}
                className="w-full"
                variant="outline"
                disabled={isUpdating}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                {t("sendForReview")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {status === WorkflowStatus.IN_REVIEW && (
              <>
                <Button 
                  onClick={() => updateStatus(WorkflowStatus.READY)}
                  className="w-full"
                  variant="outline"
                  disabled={isUpdating}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t("markAsReady")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => updateStatus(WorkflowStatus.REJECTED)}
                  className="w-full"
                  variant="outline"
                  disabled={isUpdating}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("reject")}
                </Button>
              </>
            )}
            
            {status === WorkflowStatus.READY && (
              <Button 
                onClick={() => updateStatus(WorkflowStatus.COMPLETE)}
                className="w-full"
                variant="outline"
                disabled={isUpdating}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("markAsComplete")}
              </Button>
            )}
            
            {(status === WorkflowStatus.COMPLETE || status === WorkflowStatus.REJECTED) && (
              <Button 
                onClick={() => updateStatus(WorkflowStatus.IN_REVIEW)}
                className="w-full"
                variant="outline"
                disabled={isUpdating}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                {t("reopenForReview")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyStatusWorkflow;
