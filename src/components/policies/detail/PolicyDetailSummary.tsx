
import React from "react";
import { format } from "date-fns";
import { Calendar, Users, Building, CreditCard, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import PolicyWorkflowCard from "./PolicyWorkflowCard";

interface PolicyDetailSummaryProps {
  policy: any; // Will be properly typed when we have the full schema
}

const PolicyDetailSummary: React.FC<PolicyDetailSummaryProps> = ({ policy }) => {
  const { t, formatDate, formatCurrency } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start mb-4">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <h3 className="font-semibold">{t("policyDates")}</h3>
          </div>
          <InfoGrid>
            <InfoItem 
              label={t("startDate")} 
              value={policy.start_date} 
              formatter={(date) => formatDate(date)} 
            />
            <InfoItem 
              label={t("expiryDate")} 
              value={policy.expiry_date} 
              formatter={(date) => formatDate(date)} 
            />
            <InfoItem 
              label={t("policyType")} 
              value={policy.policy_type} 
            />
          </InfoGrid>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start mb-4">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <h3 className="font-semibold">{t("parties")}</h3>
          </div>
          <InfoGrid>
            <InfoItem 
              label={t("policyholder")} 
              value={policy.policyholder_name} 
            />
            <InfoItem 
              label={t("insured")} 
              value={policy.insured_name} 
            />
            <InfoItem 
              label={t("insurer")} 
              value={policy.insurer_name} 
            />
          </InfoGrid>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start mb-4">
            <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
            <h3 className="font-semibold">{t("financialDetails")}</h3>
          </div>
          <InfoGrid>
            <InfoItem 
              label={t("premium")} 
              value={policy.premium} 
              formatter={(amount) => formatCurrency(amount, policy.currency)} 
            />
            <InfoItem 
              label={t("paymentFrequency")} 
              value={policy.payment_frequency} 
            />
            <InfoItem 
              label={t("commissionPercentage")} 
              value={policy.commission_percentage} 
              formatter={(val) => `${val}%`} 
            />
          </InfoGrid>
        </CardContent>
      </Card>
      
      {/* Add the Policy Workflow Card */}
      <div className="md:col-span-3">
        <PolicyWorkflowCard policy={policy} />
      </div>
    </div>
  );
};

export default PolicyDetailSummary;
