
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface CommissionStatusBadgeProps {
  status: string;
}

const CommissionStatusBadge: React.FC<CommissionStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  switch (status) {
    case "due":
      return <Badge variant="outline">{t("due")}</Badge>;
      
    case "partially_paid":
      return <Badge variant="secondary">{t("partially_paid")}</Badge>;
      
    case "paid":
      return <Badge variant="default">{t("paid")}</Badge>;
      
    case "calculating":
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">{t("calculating")}</Badge>;
      
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default CommissionStatusBadge;
