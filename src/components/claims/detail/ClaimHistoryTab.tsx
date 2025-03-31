
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface ClaimHistoryTabProps {
  claim: any;
}

const ClaimHistoryTab: React.FC<ClaimHistoryTabProps> = ({ claim }) => {
  const { t, formatDateTime } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("claimHistory")}</CardTitle>
        <CardDescription>{t("historyOfActivityForClaim")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Creation event */}
          <div className="flex items-start space-x-4">
            <div className="rounded-full p-2 bg-muted">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{t("claimCreated")}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(claim.created_at)}
              </p>
            </div>
          </div>
          
          {/* Status change events */}
          {Array.isArray(claim.status_history) && claim.status_history.map((entry: any, index: number) => (
            <div className="flex items-start space-x-4" key={index}>
              <div className="rounded-full p-2 bg-muted">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("statusChanged", { from: t(entry.from), to: t(entry.to) })}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(entry.timestamp)}
                </p>
                {entry.note && (
                  <p className="text-sm border-l-2 pl-2 border-muted-foreground/20 mt-1">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {/* If no history available */}
          {(!Array.isArray(claim.status_history) || claim.status_history.length === 0) && (
            <div className="text-center py-6 text-muted-foreground">
              <p>{t("noHistoryAvailable")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimHistoryTab;
