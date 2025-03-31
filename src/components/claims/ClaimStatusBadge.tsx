
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClaimStatusBadgeProps {
  status: string;
  className?: string;
}

const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status, className }) => {
  const { t } = useLanguage();
  
  const getStatusColor = (): string => {
    switch (status.toLowerCase()) {
      case 'in processing':
        return "bg-primary/10 text-primary border-primary/20";
      case 'reported':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'accepted':
        return "bg-success/10 text-success border-success/20";
      case 'rejected':
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 'appealed':
        return "bg-warning/10 text-warning border-warning/20";
      case 'partially accepted':
        return "bg-warning/10 text-warning border-warning/20";
      case 'withdrawn':
        return "bg-muted/50 text-muted-foreground border-muted/30";
      default:
        return "bg-secondary/50 text-secondary-foreground border-secondary/20";
    }
  };
  
  // Fixed: We'll use only one consistent approach - the custom color classes
  const statusDisplay = (() => {
    // Normalize status by removing spaces
    const normalizedStatus = status.toLowerCase().replace(/ /g, "");
    return t(normalizedStatus);
  })();
  
  return (
    <Badge 
      variant="outline" 
      className={cn(getStatusColor(), "font-medium capitalize", className)}
    >
      {statusDisplay}
    </Badge>
  );
};

export default ClaimStatusBadge;
