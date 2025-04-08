
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ShieldX, 
  ShieldQuestion,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DocumentApprovalStatus } from "@/types/documents";

interface ApprovalStatusBadgeProps {
  status: DocumentApprovalStatus;
}

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("approved")}</Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">{t("rejected")}</Badge>
      );
    case "needs_review":
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t("needsReview")}</Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-slate-100">{t("pending")}</Badge>
      );
  }
};

export const getStatusIcon = (status: DocumentApprovalStatus) => {
  switch (status) {
    case "approved":
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case "rejected":
      return <ShieldX className="h-5 w-5 text-red-500" />;
    case "needs_review":
      return <ShieldQuestion className="h-5 w-5 text-amber-500" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};
