
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Policy } from "@/types/policies";
import { 
  CalendarIcon, 
  CreditCard, 
  Building2, 
  User, 
  ShieldCheck,
  Banknote,
  FileCheck
} from "lucide-react";

interface PolicyReviewDetailsProps {
  policy: Policy;
}

const PolicyReviewDetails: React.FC<PolicyReviewDetailsProps> = ({ policy }) => {
  const { t, formatCurrency, formatDate } = useLanguage();

  const details = [
    {
      icon: <FileCheck className="h-5 w-5 text-primary" />,
      label: t("policyNumber"),
      value: policy.policy_number,
    },
    {
      icon: <Building2 className="h-5 w-5 text-primary" />,
      label: t("insurer"),
      value: policy.insurer_name,
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      label: t("policyType"),
      value: policy.policy_type,
    },
    {
      icon: <User className="h-5 w-5 text-primary" />,
      label: t("policyholder"),
      value: policy.policyholder_name,
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-primary" />,
      label: t("startDate"),
      value: formatDate(policy.start_date),
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-primary" />,
      label: t("expiryDate"),
      value: formatDate(policy.expiry_date),
    },
    {
      icon: <Banknote className="h-5 w-5 text-primary" />,
      label: t("premium"),
      value: formatCurrency(policy.premium, policy.currency),
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      label: t("currency"),
      value: policy.currency,
    },
  ];

  // Add product information if available
  if (policy.product_name) {
    details.splice(3, 0, {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      label: t("product"),
      value: policy.product_name,
    });
  }

  // Add product_id instead of product_code if available
  if (policy.product_id) {
    details.splice(4, 0, {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      label: t("productId"),
      value: policy.product_id,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("policyDetails")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-0.5">{detail.icon}</div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{detail.label}</div>
                <div className="font-medium">{detail.value || "-"}</div>
              </div>
            </div>
          ))}
          {policy.insured_name && policy.insured_name !== policy.policyholder_name && (
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t("insured")}</div>
                <div className="font-medium">{policy.insured_name}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyReviewDetails;
