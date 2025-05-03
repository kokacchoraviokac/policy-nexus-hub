
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface InsuranceTypeBadgeProps {
  type: string;
}

const InsuranceTypeBadge: React.FC<InsuranceTypeBadgeProps> = ({ type }) => {
  const { t } = useLanguage();

  switch (type) {
    case 'life':
      return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">{t("life")}</Badge>;
    case 'nonLife':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("nonLife")}</Badge>;
    case 'health':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("health")}</Badge>;
    case 'property':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{t("property")}</Badge>;
    case 'auto':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{t("auto")}</Badge>;
    case 'travel':
      return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">{t("travel")}</Badge>;
    case 'business':
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">{t("business")}</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export default InsuranceTypeBadge;
