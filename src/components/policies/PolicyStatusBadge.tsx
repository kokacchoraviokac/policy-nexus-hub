
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolicyStatus } from "@/types/policies";

interface PolicyStatusBadgeProps {
  status: string;
}

const PolicyStatusBadge: React.FC<PolicyStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" => {
    switch (status.toLowerCase()) {
      case PolicyStatus.ACTIVE:
        return "success";
      case PolicyStatus.PENDING:
        return "secondary";
      case PolicyStatus.EXPIRED:
      case PolicyStatus.CANCELLED:
        return "destructive";
      case PolicyStatus.RENEWED:
        return "default";
      default:
        return "outline";
    }
  };
  
  return (
    <Badge variant={getStatusVariant(status)}>
      {t(status.toLowerCase()) || status}
    </Badge>
  );
};

export default PolicyStatusBadge;
