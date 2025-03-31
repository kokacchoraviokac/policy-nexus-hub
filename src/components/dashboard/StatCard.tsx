
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
  className?: string;
  tooltipContent?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className,
  tooltipContent,
  onClick,
}) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border shadow-sm p-5 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/20 hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className={cn(
                  "text-2xl font-bold",
                  tooltipContent && "border-b border-dotted border-muted-foreground/30"
                )}>
                  {value}
                </h3>
              </TooltipTrigger>
              {tooltipContent && (
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{tooltipContent}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {trend && (
            <div className="flex items-center mt-2">
              {trend.positive ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span className={cn(
                "text-xs font-medium ml-1",
                trend.positive ? "text-emerald-500" : "text-rose-500"
              )}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1.5">vs last month</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="p-2 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
