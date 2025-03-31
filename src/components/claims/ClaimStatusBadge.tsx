
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface ClaimStatusBadgeProps {
  status: string;
  className?: string;
}

const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status, className }) => {
  const { t } = useLanguage();
  
  const getStatusVariant = () => {
    switch (status.toLowerCase()) {
      case 'in processing':
        return "default";
      case 'reported':
        return "secondary";
      case 'accepted':
        return "success" as const;
      case 'rejected':
        return "destructive";
      case 'appealed':
        return "warning" as const;
      case 'partially accepted':
        return "warning" as const;
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
    <Badge variant={getStatusVariant()} className={className}>{statusDisplay}</Badge>
  );
};

export default ClaimStatusBadge;
