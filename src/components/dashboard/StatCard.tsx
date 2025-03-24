
import React from "react";
import { cn } from "@/lib/utils";

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
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className,
}) => {
  return (
    <div className={cn(
      "glass-card rounded-lg p-5 animate-enter",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium",
                trend.positive ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
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
