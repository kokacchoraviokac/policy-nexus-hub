
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkflowStatusBadgeProps {
  status: string;
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "draft":
        return { label: t("draft"), variant: "outline" as const };
      case "review":
        return { label: t("inReview"), variant: "secondary" as const };
      case "approved":
        return { label: t("approved"), variant: "secondary" as const };
      case "finalized":
        return { label: t("finalized"), variant: "default" as const };
      case "rejected":
        return { label: t("rejected"), variant: "destructive" as const };
      default:
        return { label: status, variant: "outline" as const };
    }
  };
  
  const { label, variant } = getStatusConfig(status);
  
  return <Badge variant={variant}>{label}</Badge>;
};

export default WorkflowStatusBadge;
