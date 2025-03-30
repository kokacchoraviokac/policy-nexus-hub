
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, Building, FileText, AlertCircle, Activity, CreditCard } from "lucide-react";
import PolicyStatusBadge from "./PolicyStatusBadge";
import PolicyQuickInfo from "./PolicyQuickInfo";
import PolicyClaimsCard from "./PolicyClaimsCard";
import PolicyAssignmentCard from "./PolicyAssignmentCard";

interface PolicyDetailSummaryProps {
  policy: any;
}

const PolicyDetailSummary: React.FC<PolicyDetailSummaryProps> = ({ policy }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-9">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div>
              <PolicyQuickInfo
                icon={<Building className="h-5 w-5 text-slate-700" />}
                label={t("insurerInsuredParty")}
                value={policy.insurer_name}
                subvalue={policy.insured_name || policy.policyholder_name}
              />
            </div>
            
            <div>
              <PolicyQuickInfo
                icon={<CalendarDays className="h-5 w-5 text-slate-700" />}
                label={t("validityPeriod")}
                value={formatDate(policy.start_date)}
                subvalue={formatDate(policy.expiry_date)}
                sublabel={t("expiry")}
              />
            </div>
            
            <div>
              <PolicyQuickInfo
                icon={<FileText className="h-5 w-5 text-slate-700" />}
                label={t("premiumPayments")}
                value={formatCurrency(policy.premium)}
                subvalue={t(policy.payment_frequency || "unknown")}
                sublabel={t("frequency")}
              />
            </div>
            
            <div>
              <PolicyQuickInfo
                icon={<Activity className="h-5 w-5 text-slate-700" />}
                label={t("statusWorkflow")}
                value={<PolicyStatusBadge status={policy.status} />}
                subvalue={policy.workflow_status}
                isTag={true}
              />
            </div>
          </div>
          
          {policy.notes && (
            <div className="mt-6 p-3 bg-muted/50 rounded-md">
              <h4 className="text-sm font-medium mb-1">{t("notes")}</h4>
              <p className="text-sm whitespace-pre-wrap">{policy.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <PolicyAssignmentCard
          policy={policy}
        />
        
        <PolicyClaimsCard
          policyId={policy.id}
        />
      </div>
    </div>
  );
};

export default PolicyDetailSummary;
