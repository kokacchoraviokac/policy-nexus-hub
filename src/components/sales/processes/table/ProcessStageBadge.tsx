
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface ProcessStageBadgeProps {
  stage: string;
}

const ProcessStageBadge: React.FC<ProcessStageBadgeProps> = ({ stage }) => {
  const { t } = useLanguage();
  
  switch (stage) {
    case 'quote':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("quoteManagement")}</Badge>;
    case 'authorization':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{t("clientAuthorization")}</Badge>;
    case 'proposal':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("policyProposal")}</Badge>;
    case 'signed':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{t("signedPolicies")}</Badge>;
    case 'concluded':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("concluded")}</Badge>;
    default:
      return <Badge variant="outline">{stage}</Badge>;
  }
};

export default ProcessStageBadge;
