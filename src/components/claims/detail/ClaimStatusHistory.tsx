
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowRight } from "lucide-react";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface StatusHistoryEntry {
  from: string;
  to: string;
  timestamp: string;
  note?: string;
}

interface ClaimStatusHistoryProps {
  statusHistory: StatusHistoryEntry[];
}

const ClaimStatusHistory: React.FC<ClaimStatusHistoryProps> = ({ statusHistory = [] }) => {
  const { t, formatDate } = useLanguage();

  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {t("noStatusHistoryAvailable")}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("statusHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory.map((entry, index) => (
            <div 
              key={index} 
              className="flex flex-col border rounded-md p-3 bg-background"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                <Badge variant="outline">
                  {t("statusChange")}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <ClaimStatusBadge status={entry.from} />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <ClaimStatusBadge status={entry.to} />
              </div>
              
              {entry.note && (
                <div className="mt-2 text-sm border-t pt-2">
                  <p className="font-medium">{t("note")}:</p>
                  <p className="whitespace-pre-wrap">{entry.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimStatusHistory;
