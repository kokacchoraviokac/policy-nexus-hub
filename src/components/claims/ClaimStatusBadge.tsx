
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClaimStatusBadgeProps {
  status: string;
  className?: string;
}

const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status, className }) => {
  const { t } = useLanguage();
  
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return "success";
      case 'rejected':
        return "destructive";
      case 'in processing':
        return "secondary";
      case 'appealed':
        return "warning";
      case 'reported':
        return "default";
      case 'partially accepted':
        return "outline";
      case 'withdrawn':
        return "destructive";
      case 'paid':
        return "success";
      default:
        return "default";
    }
  };
  
  const getLabel = () => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return t("accepted");
      case 'rejected':
        return t("rejected");
      case 'in processing':
        return t("inProcessing");
      case 'appealed':
        return t("appealed");
      case 'reported':
        return t("reported");
      case 'partially accepted':
        return t("partiallyAccepted");
      case 'withdrawn':
        return t("withdrawn");
      case 'paid':
        return t("paid");
      default:
        return status;
    }
  };
  
  return (
    <Badge variant={getVariant() as any} className={className}>
      {getLabel()}
    </Badge>
  );
};

export default ClaimStatusBadge;
