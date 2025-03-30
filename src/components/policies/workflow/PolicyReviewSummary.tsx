
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, Clock, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface PolicyReviewSummaryProps {
  policy: Policy;
}

const PolicyReviewSummary: React.FC<PolicyReviewSummaryProps> = ({ policy }) => {
  const { t, formatDate } = useLanguage();
  
  // Status indicators for review stages
  const getStatusIcon = (isComplete: boolean, isOptional = false) => {
    if (isComplete) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (isOptional) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };
  
  // Check various policy aspects
  const hasBasicInfo = !!policy.policy_number && !!policy.start_date && !!policy.expiry_date;
  const hasClientInfo = !!policy.policyholder_name;
  const hasInsurerInfo = !!policy.insurer_name;
  const hasFinancialInfo = policy.premium > 0 && !!policy.currency;
  const hasCommission = policy.commission_percentage !== null && policy.commission_percentage !== undefined;
  const hasPaymentFrequency = !!policy.payment_frequency;
  
  // Calculate overall completion percentage
  const requiredChecks = [hasBasicInfo, hasClientInfo, hasInsurerInfo, hasFinancialInfo];
  const completedRequired = requiredChecks.filter(Boolean).length;
  const completionPercentage = Math.round((completedRequired / requiredChecks.length) * 100);
  
  // Determine overall review status
  const getReviewStatus = () => {
    if (policy.workflow_status === 'complete') {
      return {
        label: t("complete"),
        color: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />
      };
    }
    
    if (requiredChecks.every(Boolean)) {
      return {
        label: t("readyForReview"),
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />
      };
    }
    
    if (completedRequired > 0) {
      return {
        label: t("inProgress"),
        color: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <Clock className="h-4 w-4 mr-1" />
      };
    }
    
    return {
      label: t("needsAttention"),
      color: "bg-red-100 text-red-800 border-red-300",
      icon: <AlertTriangle className="h-4 w-4 mr-1" />
    };
  };
  
  const reviewStatus = getReviewStatus();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{t("reviewStatus")}</CardTitle>
          <Badge 
            variant="outline" 
            className={`${reviewStatus.color} flex items-center`}
          >
            {reviewStatus.icon}
            {reviewStatus.label}
          </Badge>
        </div>
        <CardDescription>
          {t("lastUpdated")}: {formatDate(policy.updated_at)} 
          ({formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("basicInformation")}</span>
              {getStatusIcon(hasBasicInfo)}
            </div>
            
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("client")}</span>
              {getStatusIcon(hasClientInfo)}
            </div>
            
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("insurer")}</span>
              {getStatusIcon(hasInsurerInfo)}
            </div>
            
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("financialDetails")}</span>
              {getStatusIcon(hasFinancialInfo)}
            </div>
            
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("commission")} ({t("optional")})</span>
              {getStatusIcon(hasCommission, true)}
            </div>
            
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("paymentFrequency")} ({t("optional")})</span>
              {getStatusIcon(hasPaymentFrequency, true)}
            </div>
            
            <div className="flex justify-between items-center border rounded p-3">
              <span className="font-medium">{t("documents")} ({t("optional")})</span>
              {getStatusIcon(policy.documents_count > 0, true)}
            </div>
          </div>
          
          {policy.workflow_status === 'draft' && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-800 text-sm">
              {t("importedPolicyReviewNote")}
            </div>
          )}
          
          {hasFinancialInfo && !hasCommission && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm flex items-start gap-2">
              <CircleDollarSign className="h-5 w-5 shrink-0 mt-0.5" />
              <span>
                {t("commissionReminderNote")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyReviewSummary;
