
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { History, User, Calendar, Code } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  userEmail?: string;
  details?: string;
}

interface ActivityLogProps {
  items: ActivityItem[];
  isLoading?: boolean;
  maxItems?: number;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ 
  items, 
  isLoading = false,
  maxItems
}) => {
  const { t } = useLanguage();
  
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>{t("noActivityRecorded")}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayItems.map((item) => (
        <div key={item.id} className="border rounded-md p-3 space-y-1 relative overflow-hidden">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">{item.userEmail || item.user}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(item.timestamp)}</span>
            </div>
          </div>
          
          <p>
            <span className="font-medium">{t(item.action)}</span>
          </p>
          
          {item.details && (
            <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
              <div className="flex items-center space-x-1 mb-1">
                <Code className="h-3 w-3" />
                <span>{t("details")}:</span>
              </div>
              <pre className="overflow-auto text-xs p-1 bg-muted rounded-sm">
                {item.details}
              </pre>
            </div>
          )}
        </div>
      ))}
      
      {maxItems && items.length > maxItems && (
        <div className="text-center">
          <button className="text-sm text-primary hover:underline">
            {t("viewMore")} ({items.length - maxItems})
          </button>
        </div>
      )}
    </div>
  );
};
