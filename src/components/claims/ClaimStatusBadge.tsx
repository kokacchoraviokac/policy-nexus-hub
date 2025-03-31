
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface ClaimStatusBadgeProps {
  status: string;
}

const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusVariant = () => {
    switch (status.toLowerCase()) {
      case 'in processing':
        return "default";
      case 'reported':
        return "secondary";
      case 'accepted':
        return "success";
      case 'rejected':
        return "destructive";
      case 'appealed':
        return "warning";
      case 'partially accepted':
        return "warning";
      case 'withdrawn':
        return "outline";
      default:
        return "default";
    }
  };
  
  const statusDisplay = (() => {
    // Normalize status by removing spaces
    const normalizedStatus = status.toLowerCase().replace(/ /g, "");
    return t(normalizedStatus);
  })();
  
  return (
    <Badge variant={getStatusVariant()}>{statusDisplay}</Badge>
  );
};

export default ClaimStatusBadge;
