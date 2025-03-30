
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import PolicyFinancialCard from "./PolicyFinancialCard";
import PolicyDocumentsCard from "./PolicyDocumentsCard";
import PolicyClaimsCard from "./PolicyClaimsCard";
import PolicyWorkflowCard from "./PolicyWorkflowCard";

interface PolicyOverviewTabProps {
  policy: any;
}

const PolicyOverviewTab: React.FC<PolicyOverviewTabProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-2 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">{t("policyDetails")}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm text-muted-foreground">{t("policyNumber")}</p>
                <p className="font-medium">{policy.policy_number}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t("policyType")}</p>
                <p className="font-medium">{policy.policy_type}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t("insurer")}</p>
                <p className="font-medium">{policy.insurer_name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t("product")}</p>
                <p className="font-medium">{policy.product_name || "-"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t("policyholder")}</p>
                <p className="font-medium">{policy.policyholder_name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t("insured")}</p>
                <p className="font-medium">{policy.insured_name || policy.policyholder_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PolicyWorkflowCard policy={policy} />
      </div>
      
      <div className="col-span-1 space-y-4">
        <PolicyFinancialCard
          premium={policy.premium}
          currency={policy.currency}
          startDate={policy.start_date}
          expiryDate={policy.expiry_date}
          paymentFrequency={policy.payment_frequency || "annual"}
        />
        
        <PolicyDocumentsCard
          policyId={policy.id}
          documentsCount={policy.documents_count || 0}
        />
        
        <PolicyClaimsCard
          policyId={policy.id}
        />
      </div>
    </div>
  );
};

export default PolicyOverviewTab;
