
import React from "react";
import { Policy } from "@/types/policies";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface PolicyReviewDetailsProps {
  policy: Policy;
}

const PolicyReviewDetails: React.FC<PolicyReviewDetailsProps> = ({ policy }) => {
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
    <div className="space-y-8">
      {detailSections.map((section, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-lg font-medium">{section.title}</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-1">
                <p className="text-sm text-muted-foreground">{field.label}</p>
                <p className="font-medium">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {policy.notes && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("notes")}</h3>
          <Separator />
          <div className="p-4 bg-muted rounded-md">
            <p className="whitespace-pre-line">{policy.notes}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">{t("systemDetails")}</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t("createdAt")}</p>
            <p className="font-medium">{formatDate(policy.created_at)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t("updatedAt")}</p>
            <p className="font-medium">{formatDate(policy.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyReviewDetails;
