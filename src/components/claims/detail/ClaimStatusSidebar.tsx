
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface StatusHistoryEntry {
  from: string;
  to: string;
  timestamp: string;
  note?: string;
}

interface ClaimStatusSidebarProps {
  claim: any;
  onUpdateStatusClick: () => void;
}

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in processing': 
      return { icon: RefreshCw, description: 'claimStatusInProcessingDescription' };
    case 'reported': 
      return { icon: Clock, description: 'claimStatusReportedDescription' };
    case 'accepted': 
      return { icon: CheckCircle, description: 'claimStatusAcceptedDescription' };
    case 'rejected': 
      return { icon: AlertCircle, description: 'claimStatusRejectedDescription' };
    case 'appealed': 
      return { icon: RefreshCw, description: 'claimStatusAppealedDescription' };
    case 'partially accepted': 
      return { icon: CheckCircle, description: 'claimStatusPartiallyAcceptedDescription' };
    case 'paid': 
      return { icon: CheckCircle, description: 'claimStatusPaidDescription' };
    case 'withdrawn': 
      return { icon: AlertCircle, description: 'claimStatusWithdrawnDescription' };
    default: 
      return { icon: Clock, description: 'claimStatusDefaultDescription' };
  }
};

const ClaimStatusSidebar: React.FC<ClaimStatusSidebarProps> = ({
  claim,
  onUpdateStatusClick
}) => {
  const { t, formatDate } = useLanguage();
  const statusInfo = getStatusInfo(claim.status);
  const StatusIcon = statusInfo.icon;
  
  const statusHistory: StatusHistoryEntry[] = claim.status_history || [];
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <>
      <CardHeader>
        <CardTitle>{t("claimStatus")}</CardTitle>
        <CardDescription>{t("claimStatusDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{t("currentStatus")}</h3>
              <ClaimStatusBadge status={claim.status} />
            </div>
            
            <div className="p-3 bg-muted rounded-lg flex items-start gap-2 mt-2">
              <StatusIcon className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm">{t(statusInfo.description)}</p>
            </div>
            
            <div className="space-y-4 mt-4">
              <Button 
                className="w-full" 
                onClick={onUpdateStatusClick}
              >
                {t("updateStatus")}
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">{t("claimTimeline")}</h3>
            <div className="space-y-4">
              {sortedHistory.length > 0 ? (
                sortedHistory.slice(0, 3).map((entry, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <div className="flex items-center gap-1">
                        <ClaimStatusBadge status={entry.to} className="text-xs px-1.5 py-0" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{t("claimCreated")}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(claim.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{t("statusUpdated")}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(claim.updated_at)}</p>
                    </div>
                  </div>
                </>
              )}
              
              {sortedHistory.length > 3 && (
                <p className="text-sm text-center text-muted-foreground">
                  {t("moreHistoryEntries", { count: sortedHistory.length - 3 })}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ClaimStatusSidebar;
