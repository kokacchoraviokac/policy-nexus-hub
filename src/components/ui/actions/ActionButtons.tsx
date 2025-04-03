
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

interface ActionButtonsProps {
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
  };
  secondaryActions?: ActionItem[];
  className?: string;
  align?: "center" | "start" | "end";
  size?: "default" | "sm" | "lg";
  dropdownLabel?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  primaryAction,
  secondaryActions,
  className,
  align = "end",
  size = "default",
  dropdownLabel,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className={cn("flex items-center gap-2", className, {
      "justify-end": align === "end",
      "justify-center": align === "center",
      "justify-start": align === "start"
    })}>
      {secondaryActions && secondaryActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={size}
              className="gap-1"
            >
              {dropdownLabel || t("actions")}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {secondaryActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  action.variant === "destructive" && "text-destructive focus:text-destructive"
                )}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {primaryAction && (
        <Button
          onClick={primaryAction.onClick}
          disabled={primaryAction.isLoading || primaryAction.disabled}
          size={size}
        >
          {primaryAction.isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            primaryAction.icon || <Plus className="mr-2 h-4 w-4" />
          )}
          {primaryAction.label}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
