
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, User, FileCheck, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PolicyReviewSummaryProps {
  policy: Policy;
}

const PolicyReviewSummary: React.FC<PolicyReviewSummaryProps> = ({ policy }) => {
  const { t, formatDate } = useLanguage();
  
  const getWorkflowStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'complete':
        return "default";
      case 'in_review':
      case 'ready':
        return "secondary";
      case 'draft':
        return "outline";
      default:
        return "outline";
    }
  };
  
  const getPolicyStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'active':
        return "default";
      case 'pending':
        return "secondary";
      case 'expired':
      case 'cancelled':
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const getWorkflowIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return <FileCheck className="h-4 w-4" />;
      case 'in_review':
        return <FileText className="h-4 w-4" />;
      case 'ready':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">{policy.policy_number}</h2>
        <div className="flex items-center gap-2">
          <Badge variant={getPolicyStatusVariant(policy.status)}>
            {policy.status}
          </Badge>
          <Badge variant={getWorkflowStatusVariant(policy.workflow_status)} className="flex items-center gap-1">
            {getWorkflowIcon(policy.workflow_status)}
            <span>{t(policy.workflow_status.replace('_', ''))}</span>
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("basicInformation")}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("policyholder")}: </span>
              <span className="text-sm font-medium">{policy.policyholder_name}</span>
            </div>
            
            {policy.insured_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("insured")}: </span>
                <span className="text-sm font-medium">{policy.insured_name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("policyType")}: </span>
              <span className="text-sm font-medium">{policy.policy_type}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("insurer")}: </span>
              <span className="text-sm font-medium">{policy.insurer_name}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("policyDates")}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("startDate")}: </span>
              <span className="text-sm font-medium">{formatDate(policy.start_date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("expiryDate")}: </span>
              <span className="text-sm font-medium">{formatDate(policy.expiry_date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("lastUpdated")}: </span>
              <span className="text-sm font-medium">{formatDate(policy.updated_at)} ({formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })})</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("financialDetails")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-muted-foreground">{t("premium")}</div>
            <div className="text-lg font-semibold">{policy.premium} {policy.currency}</div>
          </div>
          
          {policy.commission_percentage && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-muted-foreground">{t("commissionPercentage")}</div>
              <div className="text-lg font-semibold">{policy.commission_percentage}%</div>
            </div>
          )}
          
          {policy.payment_frequency && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-muted-foreground">{t("paymentFrequency")}</div>
              <div className="text-lg font-semibold">{t(policy.payment_frequency)}</div>
            </div>
          )}
        </div>
      </div>
      
      {policy.notes && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h3>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm">{policy.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyReviewSummary;
