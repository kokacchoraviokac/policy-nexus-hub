
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { CommissionType } from "@/types/finances";
import { CheckCircle, Clock, RefreshCcw, CircleDollarSign } from "lucide-react";

interface CommissionStatusBadgeProps {
  status: CommissionType["status"];
}

const CommissionStatusBadge: React.FC<CommissionStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case "due":
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-50">
          <Clock className="h-3 w-3 mr-1" />
          {t("due")}
        </Badge>
      );
    case "partially_paid":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500 bg-blue-50">
          <CircleDollarSign className="h-3 w-3 mr-1" />
          {t("partially_paid")}
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("paid")}
        </Badge>
      );
    case "calculating":
      return (
        <Badge variant="outline" className="border-purple-500 text-purple-500 bg-purple-50">
          <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
          {t("calculating")}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default CommissionStatusBadge;
