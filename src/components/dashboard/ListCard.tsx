
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ListCardProps {
  title: string;
  items: Array<{
    id: string;
    primary: string;
    secondary?: string;
    tertiary?: string;
    status?: "success" | "warning" | "error" | "info";
  }>;
  icon?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  onItemClick?: (id: string) => void;
  actionLabel?: string;
  onAction?: () => void;
}

const ListCard: React.FC<ListCardProps> = ({
  title,
  items,
  icon,
  emptyMessage = "No items to display",
  className,
  onItemClick,
  actionLabel,
  onAction,
}) => {
  return (
    <div className={cn(
      "glass-card rounded-lg overflow-hidden animate-enter",
      className
    )}>
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="font-medium">{title}</h3>
        </div>
        
        {actionLabel && onAction && (
          <Button variant="ghost" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
      
      <div className="divide-y divide-border">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id}
              className={cn(
                "px-5 py-3 flex items-center",
                onItemClick && "cursor-pointer hover:bg-secondary/50 transition-colors"
              )}
              onClick={() => onItemClick?.(item.id)}
            >
              {item.status && (
                <div className="mr-3">
                  <span className={cn(
                    "w-2 h-2 rounded-full block",
                    item.status === "success" && "bg-emerald-500",
                    item.status === "warning" && "bg-amber-500",
                    item.status === "error" && "bg-rose-500",
                    item.status === "info" && "bg-blue-500",
                  )}></span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.primary}</p>
                {item.secondary && (
                  <p className="text-xs text-muted-foreground truncate">{item.secondary}</p>
                )}
              </div>
              
              {item.tertiary && (
                <div className="text-xs text-muted-foreground ml-2">
                  {item.tertiary}
                </div>
              )}
              
              {onItemClick && (
                <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListCard;
