
import React from "react";
import { cn } from "@/utils/cn";
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
      case 'in processing':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
      case 'reported':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case 'accepted':
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
      case 'rejected':
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      case 'appealed':
        return "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200";
      case 'partially accepted':
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
      case 'paid':
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200";
      case 'withdrawn':
        return "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn(getVariant(), "font-medium", className)}
    >
      {t(status.toLowerCase().replace(/ /g, ""))}
    </Badge>
  );
};

export default ClaimStatusBadge;
