
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Card, CardContent } from "@/components/ui/card";

interface SelectedPolicyDisplayProps {
  policy: Policy;
}

const SelectedPolicyDisplay: React.FC<SelectedPolicyDisplayProps> = ({ policy }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm">{t("policyNumber")}</h4>
          <p>{policy.policy_number}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">{t("policyholder")}</h4>
          <p>{policy.policyholder_name}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">{t("insurer")}</h4>
          <p>{policy.insurer_name}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">{t("product")}</h4>
          <p>{policy.product_name || "-"}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">{t("period")}</h4>
          <p>{formatDate(policy.start_date)} - {formatDate(policy.expiry_date)}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">{t("premium")}</h4>
          <p>{formatCurrency(policy.premium)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedPolicyDisplay;
