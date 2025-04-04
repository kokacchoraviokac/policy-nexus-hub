
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Building, CreditCard, FileText } from "lucide-react";

interface PolicyReviewDetailsProps {
  policy: Policy;
}

const PolicyReviewDetails: React.FC<PolicyReviewDetailsProps> = ({ policy }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            {t("basicInformation")}
          </CardTitle>
          <CardDescription>{t("basicInformationAboutPolicy")}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("policyDetails")}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t("policyNumber")}</span>
                <span className="text-sm font-medium">{policy.policy_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("policyType")}</span>
                <span className="text-sm font-medium">{policy.policy_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("startDate")}</span>
                <span className="text-sm font-medium">{formatDate(policy.start_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("expiryDate")}</span>
                <span className="text-sm font-medium">{formatDate(policy.expiry_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("status")}</span>
                <span className="text-sm font-medium">{policy.status}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("workflowInformation")}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t("workflowStatus")}</span>
                <span className="text-sm font-medium">{policy.workflow_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("createdAt")}</span>
                <span className="text-sm font-medium">{formatDate(policy.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("updatedAt")}</span>
                <span className="text-sm font-medium">{formatDate(policy.updated_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            {t("parties")}
          </CardTitle>
          <CardDescription>{t("partiesInvolved")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("policyholder")}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t("name")}</span>
                <span className="text-sm font-medium">{policy.policyholder_name}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("insured")}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t("name")}</span>
                <span className="text-sm font-medium">{policy.insured_name || t("notProvided")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary" />
            {t("insurer")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">{t("name")}</span>
              <span className="text-sm font-medium">{policy.insurer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("product")}</span>
              <span className="text-sm font-medium">{policy.product_name || t("notProvided")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("productCode")}</span>
              <span className="text-sm font-medium">{policy.product_code || t("notProvided")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            {t("financialDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("premium")}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t("amount")}</span>
                <span className="text-sm font-medium">{formatCurrency(policy.premium, policy.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("currency")}</span>
                <span className="text-sm font-medium">{policy.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("paymentFrequency")}</span>
                <span className="text-sm font-medium">{policy.payment_frequency || t("notProvided")}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("commission")}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t("commissionType")}</span>
                <span className="text-sm font-medium">{policy.commission_type || t("notProvided")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("commissionPercentage")}</span>
                <span className="text-sm font-medium">
                  {policy.commission_percentage !== undefined ? `${policy.commission_percentage}%` : t("notProvided")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("commissionAmount")}</span>
                <span className="text-sm font-medium">
                  {policy.commission_amount !== undefined 
                    ? formatCurrency(policy.commission_amount, policy.currency) 
                    : t("notProvided")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {policy.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              {t("additionalInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("notes")}</h4>
                <p className="text-sm whitespace-pre-wrap">{policy.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PolicyReviewDetails;
