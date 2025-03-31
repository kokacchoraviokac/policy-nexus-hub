
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

type WorkflowStatus = "draft" | "in_review" | "ready" | "complete" | "rejected" | "approved" | string;

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  // Define variant based on status
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  
  switch (status) {
    case "draft":
      variant = "outline";
      break;
    case "in_review":
      variant = "secondary";
      break;
    case "ready":
      variant = "default";
      break;
    case "complete":
      variant = "default";
      break;
    case "approved":
      variant = "default";
      break;
    case "rejected":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  // Get translated status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return t("draft");
      case "in_review":
        return t("inReview");
      case "ready":
        return t("ready");
      case "complete":
        return t("complete");
      case "approved":
        return t("approved");
      case "rejected":
        return t("rejected");
      default:
        return status;
    }
  };
  
  return (
    <Badge variant={variant}>
      {getStatusText(status)}
    </Badge>
  );
};

export default WorkflowStatusBadge;
