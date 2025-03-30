
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PolicyOverviewTabProps {
  policy: any;
}

const PolicyOverviewTab: React.FC<PolicyOverviewTabProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  // This is a placeholder component - will be implemented fully later
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("policyDetails")}</CardTitle>
          <CardDescription>{t("policyDetailsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("policyNumber")}:</span>
              <span className="text-sm font-medium">{policy.policy_number}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("policyType")}:</span>
              <span className="text-sm font-medium">{policy.policy_type}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("startDate")}:</span>
              <span className="text-sm font-medium">{new Date(policy.start_date).toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("expiryDate")}:</span>
              <span className="text-sm font-medium">{new Date(policy.expiry_date).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("policyParties")}</CardTitle>
          <CardDescription>{t("policyPartiesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("policyholder")}:</span>
              <span className="text-sm font-medium">{policy.policyholder_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("insured")}:</span>
              <span className="text-sm font-medium">{policy.insured_name || policy.policyholder_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("insurer")}:</span>
              <span className="text-sm font-medium">{policy.insurer_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">{t("product")}:</span>
              <span className="text-sm font-medium">{policy.product_name || "-"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyOverviewTab;
