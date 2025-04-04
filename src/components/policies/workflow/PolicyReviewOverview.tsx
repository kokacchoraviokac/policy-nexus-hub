
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Policy } from "@/types/policies";
import { Separator } from "@/components/ui/separator";

interface PolicyReviewOverviewProps {
  policy: Policy;
}

interface PolicyDetail {
  label: string;
  value: string | number;
  valueClass?: string;
}

const PolicyReviewOverview: React.FC<PolicyReviewOverviewProps> = ({ policy }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  
  const getPolicyStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="default">{t("active")}</Badge>;
      case 'pending':
        return <Badge variant="warning">{t("pending")}</Badge>;
      case 'expired':
        return <Badge variant="destructive">{t("expired")}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">{t("cancelled")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getWorkflowStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline">{t("draft")}</Badge>;
      case 'in_review':
        return <Badge variant="secondary">{t("inReview")}</Badge>;
      case 'ready':
        return <Badge variant="warning">{t("ready")}</Badge>;
      case 'complete':
        return <Badge variant="default">{t("complete")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const mainDetails: PolicyDetail[] = [
    { label: t("policyNumber"), value: policy.policy_number },
    { label: t("policyType"), value: policy.policy_type },
    { label: t("status"), value: getPolicyStatusBadge(policy.status) },
    { label: t("workflowStatus"), value: getWorkflowStatusBadge(policy.workflow_status) }
  ];
  
  const partyDetails: PolicyDetail[] = [
    { label: t("insurer"), value: policy.insurer_name },
    { label: t("policyholder"), value: policy.policyholder_name },
    { label: t("insured"), value: policy.insured_name || policy.policyholder_name }
  ];
  
  const coverageDetails: PolicyDetail[] = [
    { label: t("startDate"), value: formatDate(policy.start_date) },
    { label: t("expiryDate"), value: formatDate(policy.expiry_date) }
  ];
  
  const financialDetails: PolicyDetail[] = [
    { 
      label: t("premium"), 
      value: formatCurrency(policy.premium, policy.currency), 
      valueClass: "font-semibold text-primary" 
    },
    { label: t("currency"), value: policy.currency }
  ];
  
  // Add product name and product_id instead of product_code if available
  const productDetails: PolicyDetail[] = [];
  
  if (policy.product_name) {
    productDetails.push({ label: t("productName"), value: policy.product_name });
  }
  
  if (policy.product_id) {
    productDetails.push({ label: t("productId"), value: policy.product_id });
  }
  
  if (policy.commission_percentage) {
    financialDetails.push({ 
      label: t("commissionPercentage"), 
      value: `${policy.commission_percentage}%` 
    });
  }
  
  if (policy.commission_amount) {
    financialDetails.push({ 
      label: t("commissionAmount"), 
      value: formatCurrency(policy.commission_amount, policy.currency) 
    });
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Main Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("policyDetails")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainDetails.map((detail, index) => (
                <div key={`main-${index}`} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <span className={detail.valueClass || ""}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Party Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("parties")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partyDetails.map((detail, index) => (
                <div key={`party-${index}`} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <span className={detail.valueClass || ""}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Product Details (if available) */}
          {productDetails.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("product")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productDetails.map((detail, index) => (
                    <div key={`product-${index}`} className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{detail.label}</span>
                      <span className={detail.valueClass || ""}>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}
          
          {/* Coverage Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("coverage")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coverageDetails.map((detail, index) => (
                <div key={`coverage-${index}`} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <span className={detail.valueClass || ""}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Financial Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("financial")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialDetails.map((detail, index) => (
                <div key={`financial-${index}`} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <span className={detail.valueClass || ""}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyReviewOverview;
