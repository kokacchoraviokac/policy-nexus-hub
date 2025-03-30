
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StatusHistoryEntry } from "@/hooks/claims/useClaimDetail";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";
import { Clock } from "lucide-react";

interface ClaimStatusHistoryProps {
  statusHistory: StatusHistoryEntry[];
}

const ClaimStatusHistory: React.FC<ClaimStatusHistoryProps> = ({ statusHistory }) => {
  const { t, formatDate } = useLanguage();
  
  // Sort history by timestamp, newest first
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedHistory.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/30">
        <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <h3 className="text-lg font-medium">{t("noStatusHistoryYet")}</h3>
        <p className="text-muted-foreground mt-1">
          {t("claimHistoryComingSoon")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {sortedHistory.map((entry, index) => (
            <li key={index}>
              <div className="relative pb-8">
                {index !== sortedHistory.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-muted"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("statusChangedFrom")} <ClaimStatusBadge status={entry.from} className="mx-1" /> {t("to")} <ClaimStatusBadge status={entry.to} />
                      </p>
                      {entry.note && (
                        <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                          {entry.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClaimStatusHistory;
