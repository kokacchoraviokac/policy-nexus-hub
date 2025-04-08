
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, User, Building, CreditCard } from "lucide-react";

interface PolicyReviewOverviewProps {
  policy: Policy;
}

const PolicyReviewOverview: React.FC<PolicyReviewOverviewProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          {t("basicInformation")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("policyNumber")}</p>
            <p className="font-medium">{policy.policy_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("policyType")}</p>
            <p className="font-medium">{policy.policy_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("startDate")}</p>
            <p className="font-medium">{formatDate(policy.start_date)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("expiryDate")}</p>
            <p className="font-medium">{formatDate(policy.expiry_date)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("status")}</p>
            <Badge variant={policy.status === "active" ? "secondary" : "outline"}>
              {t(policy.status)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("workflowStatus")}</p>
            <Badge variant="outline">{t(policy.workflow_status.replace('_', ''))}</Badge>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          {t("parties")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("policyholder")}</p>
            <p className="font-medium">{policy.policyholder_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("insured")}</p>
            <p className="font-medium">{policy.insured_name || policy.policyholder_name}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          {t("insurer")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("insurerName")}</p>
            <p className="font-medium">{policy.insurer_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("product")}</p>
            <p className="font-medium">{policy.product_name || t("notSpecified")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("productCode")}</p>
            <p className="font-medium">{policy.product_code || t("notSpecified")}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          {t("financialDetails")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("premium")}</p>
            <p className="font-medium">{formatCurrency(policy.premium, policy.currency)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("currency")}</p>
            <p className="font-medium">{policy.currency}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("paymentFrequency")}</p>
            <p className="font-medium">{t(policy.payment_frequency || "notSpecified")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("commissionPercentage")}</p>
            <p className="font-medium">
              {policy.commission_percentage ? `${policy.commission_percentage}%` : t("notSpecified")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("commissionAmount")}</p>
            <p className="font-medium">
              {policy.commission_amount 
                ? formatCurrency(policy.commission_amount, policy.currency) 
                : t("notSpecified")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("commissionType")}</p>
            <p className="font-medium">{t(policy.commission_type || "notSpecified")}</p>
          </div>
        </div>
      </div>
      
      {policy.notes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{t("notes")}</h3>
            <p className="text-sm">{policy.notes}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PolicyReviewOverview;
