
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PolicyWorkflowStatus } from "@/types/policies";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkflowStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ status, size = "md" }) => {
  const { t } = useLanguage();
  
  const getVariant = (status: string) => {
    switch (status) {
      case PolicyWorkflowStatus.DRAFT:
        return "secondary";
      case PolicyWorkflowStatus.PENDING:
      case PolicyWorkflowStatus.PROCESSING:
      case PolicyWorkflowStatus.IN_REVIEW:
      case PolicyWorkflowStatus.REVIEW:
        return "warning";
      case PolicyWorkflowStatus.READY:
        return "info";
      case PolicyWorkflowStatus.COMPLETE:
      case PolicyWorkflowStatus.FINALIZED:
        return "success";
      case PolicyWorkflowStatus.REJECTED:
      case PolicyWorkflowStatus.NEEDS_REVIEW:
        return "destructive";
      default:
        return "default";
    }
  };
  
  const getLabel = (status: string) => {
    switch (status) {
      case PolicyWorkflowStatus.DRAFT:
        return t("draft");
      case PolicyWorkflowStatus.IN_REVIEW:
      case PolicyWorkflowStatus.REVIEW:
        return t("inReview");
      case PolicyWorkflowStatus.READY:
        return t("ready");
      case PolicyWorkflowStatus.COMPLETE:
        return t("complete");
      case PolicyWorkflowStatus.FINALIZED:
        return t("finalized");
      case PolicyWorkflowStatus.REJECTED:
        return t("rejected");
      case PolicyWorkflowStatus.NEEDS_REVIEW:
        return t("needsReview");
      case PolicyWorkflowStatus.PENDING:
        return t("pending");
      case PolicyWorkflowStatus.PROCESSING:
        return t("processing");
      default:
        return status ? t(status) : t("unknown");
    }
  };
  
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2.5 py-0.5", 
    lg: "px-3 py-1"
  };
  
  const variant = getVariant(status);
  const label = getLabel(status);
  
  return (
    <Badge variant={variant as any} className={sizeClasses[size]}>
      {label}
    </Badge>
  );
};

export default WorkflowStatusBadge;
