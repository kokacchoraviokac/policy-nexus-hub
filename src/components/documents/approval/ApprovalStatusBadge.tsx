
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ShieldX, 
  ShieldQuestion,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus } from "@/types/common";

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus | string;
}

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  switch (status) {
    case ApprovalStatus.APPROVED:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("approved")}</Badge>
      );
    case ApprovalStatus.REJECTED:
      return (
        <Badge variant="destructive">{t("rejected")}</Badge>
      );
    case ApprovalStatus.NEEDS_REVIEW:
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t("needsReview")}</Badge>
      );
    case ApprovalStatus.PENDING:
    default:
      return (
        <Badge variant="outline" className="bg-slate-100">{t("pending")}</Badge>
      );
  }
};

export const getStatusIcon = (status: ApprovalStatus | string) => {
  switch (status) {
    case ApprovalStatus.APPROVED:
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case ApprovalStatus.REJECTED:
      return <ShieldX className="h-5 w-5 text-red-500" />;
    case ApprovalStatus.NEEDS_REVIEW:
      return <ShieldQuestion className="h-5 w-5 text-amber-500" />;
    case ApprovalStatus.PENDING:
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};
