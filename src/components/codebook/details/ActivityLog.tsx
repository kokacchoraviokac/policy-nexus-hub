
import React from "react";
import { format } from "date-fns";
import { Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

interface ActivityLogProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

export function ActivityLog({ items, isLoading = false }: ActivityLogProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-md">
            <Skeleton className="h-5 w-2/3 mb-2" />
            <div className="flex items-center text-muted-foreground text-sm mt-2 space-x-4">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No activity records found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="p-4 border rounded-md hover:bg-accent/30 transition-colors"
        >
          <div className="font-medium">{item.action}</div>
          
          <div className="flex items-center text-muted-foreground text-sm mt-2 space-x-4">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
            </div>
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              {item.user}
            </div>
          </div>
          
          {item.details && (
            <div className="mt-2 text-sm border-l-2 pl-3 py-1 border-muted">
              {item.details}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
