
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkflowStatusBadgeProps {
  status: string;
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'draft':
        return "outline";
      case 'in_review':
        return "secondary";
      case 'ready':
        return "default";
      case 'complete':
        return "default";
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
