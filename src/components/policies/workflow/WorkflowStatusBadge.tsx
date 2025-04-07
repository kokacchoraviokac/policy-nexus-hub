
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolicyWorkflowStatus } from "@/types/policies";

interface WorkflowStatusBadgeProps {
  status: string;
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (status) {
      case PolicyWorkflowStatus.DRAFT:
        return "outline";
      case PolicyWorkflowStatus.IN_REVIEW:
      case PolicyWorkflowStatus.REVIEW:
        return "warning";
      case PolicyWorkflowStatus.READY:
        return "default";
      case PolicyWorkflowStatus.COMPLETE:
      case PolicyWorkflowStatus.FINALIZED:
        return "success";
      case PolicyWorkflowStatus.REJECTED:
      case PolicyWorkflowStatus.NEEDS_REVIEW:
        return "destructive";
      case PolicyWorkflowStatus.PENDING:
        return "secondary";
      case PolicyWorkflowStatus.PROCESSING:
        return "warning";
      default:
        return "outline";
    }
  };
  
  return (
    <Badge variant={getStatusVariant(status)}>
      {t(status.replace('_', ''))}
    </Badge>
  );
};

export default WorkflowStatusBadge;
