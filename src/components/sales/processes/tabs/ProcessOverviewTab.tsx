
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { SalesProcess } from "@/types/salesProcess";
import { InsuranceTypeBadge } from "../badges/StatusBadges";

interface ProcessOverviewTabProps {
  process: SalesProcess;
}

const ProcessOverviewTab: React.FC<ProcessOverviewTabProps> = ({ process }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t("clientInformation")}</h4>
          <div className="mt-1 space-y-2">
            <p className="text-sm">
              <span className="font-medium">{t("clientName")}: </span>
              {process.client_name}
            </p>
            <p className="text-sm">
              <span className="font-medium">{t("insuranceType")}: </span>
              <InsuranceTypeBadge type={process.insurance_type} />
            </p>
            {process.estimated_value && (
              <p className="text-sm">
                <span className="font-medium">{t("estimatedValue")}: </span>
                {process.estimated_value}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{t("processDetails")}</h4>
          <div className="mt-1 space-y-2">
            <p className="text-sm">
              <span className="font-medium">{t("createdAt")}: </span>
              {format(new Date(process.created_at), "PPP")}
            </p>
            {process.expected_close_date && (
              <p className="text-sm">
                <span className="font-medium">{t("expectedCloseDate")}: </span>
                {format(new Date(process.expected_close_date), "PPP")}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">{t("responsiblePerson")}: </span>
              {process.responsible_person || t("notAssigned")}
            </p>
            <p className="text-sm">
              <span className="font-medium">{t("status")}: </span>
              <Badge 
                variant={process.status === "active" ? "default" : process.status === "completed" ? "secondary" : "destructive"}
                className={process.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" : "text-xs"}
              >
                {t(process.status)}
              </Badge>
            </p>
          </div>
        </div>
      </div>
      
      {process.notes && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h4>
            <p className="text-sm whitespace-pre-wrap">{process.notes}</p>
          </div>
        </>
      )}
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("salesProcessStages")}</h4>
        <div className="flex items-center space-x-1 text-sm">
          <div className={`px-2 py-1 rounded ${process.stage === 'quote' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700 bg-gray-100'}`}>
            {t("quoteManagement")}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`px-2 py-1 rounded ${process.stage === 'authorization' ? 'bg-blue-100 text-blue-700' : (process.stage === 'proposal' || process.stage === 'signed' || process.stage === 'concluded') ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
            {t("clientAuthorization")}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`px-2 py-1 rounded ${process.stage === 'proposal' ? 'bg-blue-100 text-blue-700' : (process.stage === 'signed' || process.stage === 'concluded') ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
            {t("policyProposal")}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`px-2 py-1 rounded ${process.stage === 'signed' ? 'bg-blue-100 text-blue-700' : process.stage === 'concluded' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
            {t("signedPolicies")}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`px-2 py-1 rounded ${process.stage === 'concluded' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
            {t("concluded")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessOverviewTab;
