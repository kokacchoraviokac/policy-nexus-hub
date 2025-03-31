
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import ClaimStatusBadge from "../ClaimStatusBadge";

interface StatusHistoryEntry {
  from: string;
  to: string;
  timestamp: string;
  note?: string;
}

interface ClaimStatusHistoryProps {
  statusHistory: StatusHistoryEntry[];
}

const ClaimStatusHistory: React.FC<ClaimStatusHistoryProps> = ({ statusHistory }) => {
  const { t, formatDate } = useLanguage();
  
  // Add the formatTime function since it's not provided by the language context
  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting time:", error);
      return '';
    }
  };
  
  // Sort history by timestamp, newest first
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (sortedHistory.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{t("claimHistoryComingSoon")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{t("claimTimeline")}</h3>
      
      <div className="space-y-4">
        {sortedHistory.map((entry, index) => (
          <div key={index} className="relative pl-6 pb-4">
            {/* Timeline line */}
            {index !== sortedHistory.length - 1 && (
              <div className="absolute top-2 left-2 bottom-0 w-0.5 bg-border" />
            )}
            
            {/* Timeline dot */}
            <div className="absolute top-2 left-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-background" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatDate(entry.timestamp)} {formatTime(entry.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t("changed from")}:</span>
                <ClaimStatusBadge status={entry.from} className="text-xs px-1.5 py-0" />
                <span className="text-muted-foreground">{t("to")}:</span>
                <ClaimStatusBadge status={entry.to} className="text-xs px-1.5 py-0" />
              </div>
              
              {entry.note && (
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="text-sm">{entry.note}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimStatusHistory;
