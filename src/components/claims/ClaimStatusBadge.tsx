
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface ClaimStatusBadgeProps {
  status: string;
  className?: string;
}

const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status, className }) => {
  const { t } = useLanguage();
  
  // Define a VariantType for the badge
  type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  
  const getStatusVariant = (): BadgeVariant => {
    switch (status.toLowerCase()) {
      case 'in processing':
        return "default";
      case 'reported':
        return "secondary";
      case 'accepted':
        return "default"; // Change from success to default as a workaround
      case 'rejected':
        return "destructive";
      case 'appealed':
        return "secondary"; // Change from warning to secondary as a workaround
      case 'partially accepted':
        return "secondary"; // Change from warning to secondary as a workaround
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
