
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ListCardProps {
  title: string;
  items: Array<{
    id: string;
    primary: string;
    secondary?: string;
    tertiary?: string;
    status?: "success" | "warning" | "error" | "info";
    tooltipContent?: string;
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
      "bg-card rounded-lg border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="font-medium">{title}</h3>
        </div>
        
        {actionLabel && onAction && (
          <Button variant="ghost" size="sm" onClick={onAction} className="hover:bg-primary/10 hover:text-primary">
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
            <TooltipProvider key={item.id}>
              <div 
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
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p className="text-sm font-medium truncate">{item.primary}</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{item.primary}</h4>
                        {item.secondary && (
                          <p className="text-sm text-muted-foreground">{item.secondary}</p>
                        )}
                        {item.tooltipContent && (
                          <p className="text-xs text-muted-foreground">{item.tooltipContent}</p>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  
                  {item.secondary && (
                    <p className="text-xs text-muted-foreground truncate">{item.secondary}</p>
                  )}
                </div>
                
                {item.tertiary && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground ml-2 border-b border-dotted border-muted-foreground/30">
                        {item.tertiary}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Due in {item.tertiary}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {onItemClick && (
                  <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </TooltipProvider>
          ))
        )}
      </div>
    </div>
  );
};

export default ListCard;
