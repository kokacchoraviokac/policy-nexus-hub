
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";
import { StatusHistoryEntry } from "@/hooks/claims/useClaimDetail";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface ClaimStatusSidebarProps {
  claim: any;
  onUpdateStatusClick: () => void;
}

const ClaimStatusSidebar: React.FC<ClaimStatusSidebarProps> = ({
  claim,
  onUpdateStatusClick
}) => {
  const { t, formatDate, formatDateTime } = useLanguage();
  
  const statusHistory: StatusHistoryEntry[] = Array.isArray(claim.status_history) 
    ? claim.status_history 
    : [];
  
  return (
    <>
      <CardHeader>
        <CardTitle>{t("claimStatus")}</CardTitle>
        <CardDescription>{t("claimStatusDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 border rounded-md bg-muted/50">
          <h3 className="font-medium mb-2">{t("currentStatus")}</h3>
          <div className="flex items-center justify-between">
            <ClaimStatusBadge status={claim.status} />
            <Button 
              variant="outline" 
              size="sm"
              onClick={onUpdateStatusClick}
            >
              {t("updateStatus")}
            </Button>
          </div>
        </div>
        
        {/* Status Timeline */}
        <div>
          <h3 className="font-medium mb-3">{t("claimTimeline")}</h3>
          
          <div className="space-y-4">
            {/* Initial creation */}
            <div className="flex">
              <div className="mr-4 flex flex-col items-center">
                <div className="rounded-full w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="h-full w-px bg-border mt-2"></div>
              </div>
              <div>
                <h4 className="font-medium">{t("claimCreated")}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(claim.created_at)}
                </p>
              </div>
            </div>
            
            {/* Status history entries */}
            {statusHistory.map((entry, index) => (
              <div className="flex" key={index}>
                <div className="mr-4 flex flex-col items-center">
                  <div className="rounded-full w-9 h-9 flex items-center justify-center bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {index < statusHistory.length - 1 && (
                    <div className="h-full w-px bg-border mt-2"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{t("statusUpdated")}</h4>
                  <div className="flex items-center text-sm space-x-1">
                    <ClaimStatusBadge status={entry.from} />
                    <span>→</span>
                    <ClaimStatusBadge status={entry.to} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(entry.timestamp)}
                  </p>
                  {entry.note && (
                    <p className="text-sm mt-1 border-l-2 pl-2 border-muted-foreground/20">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ClaimStatusSidebar;
