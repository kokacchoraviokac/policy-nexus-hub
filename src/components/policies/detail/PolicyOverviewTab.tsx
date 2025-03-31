
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import PolicyClaimsCard from "./PolicyClaimsCard";
import PolicyAddendaCard from "./PolicyAddendaCard";
import PolicyPaymentsCard from "./PolicyPaymentsCard";

interface PolicyOverviewTabProps {
  policy: any;
}

const PolicyOverviewTab: React.FC<PolicyOverviewTabProps> = ({ policy }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  const detailSections = [
    {
      title: t("policyDetails"),
      fields: [
        { label: t("policyNumber"), value: policy.policy_number },
        { label: t("policyType"), value: policy.policy_type },
        { label: t("status"), value: policy.status },
        { label: t("workflowStatus"), value: policy.workflow_status },
        { label: t("startDate"), value: formatDate(policy.start_date) },
        { label: t("expiryDate"), value: formatDate(policy.expiry_date) },
      ],
    },
    {
      title: t("insuranceDetails"),
      fields: [
        { label: t("insurer"), value: policy.insurer_name },
        { label: t("product"), value: policy.product_name || t("notProvided") },
        { label: t("productCode"), value: policy.product_code || t("notProvided") },
      ],
    },
    {
      title: t("clientDetails"),
      fields: [
        { label: t("policyholder"), value: policy.policyholder_name },
        { label: t("insured"), value: policy.insured_name || policy.policyholder_name },
      ],
    },
    {
      title: t("financialDetails"),
      fields: [
        { label: t("premium"), value: formatCurrency(policy.premium, policy.currency) },
        { label: t("currency"), value: policy.currency },
        { label: t("paymentFrequency"), value: policy.payment_frequency || t("notProvided") },
      ],
    },
    {
      title: t("commissionDetails"),
      fields: [
        { label: t("commissionType"), value: policy.commission_type || t("notProvided") },
        { 
          label: t("commissionPercentage"), 
          value: policy.commission_percentage ? `${policy.commission_percentage}%` : t("notProvided") 
        },
        { 
          label: t("commissionAmount"), 
          value: policy.commission_amount ? formatCurrency(policy.commission_amount, policy.currency) : t("notProvided") 
        },
      ],
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {detailSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{field.label}</p>
                    <p className="font-medium">{field.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {policy.notes && (
          <Card>
            <CardHeader>
              <CardTitle>{t("notes")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{policy.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="space-y-6">
        <PolicyClaimsCard policyId={policy.id} />
        <PolicyAddendaCard policyId={policy.id} />
        <PolicyPaymentsCard policyId={policy.id} />
      </div>
    </div>
  );
};

export default PolicyOverviewTab;
