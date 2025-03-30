
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface PolicyStatusBadgeProps {
  status: string;
}

const PolicyStatusBadge: React.FC<PolicyStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'active':
        return "default";
      case 'pending':
        return "secondary";
      case 'expired':
      case 'cancelled':
        return "destructive";
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
