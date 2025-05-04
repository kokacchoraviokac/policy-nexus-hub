
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  requiredPrivilege: string;
  currentPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  active,
  collapsed,
  requiredPrivilege,
  currentPath
}) => {
  const { hasPrivilege } = useAuth();
  const { t } = useLanguage();
  
  // Only render if user has required privilege
  if (!hasPrivilege(requiredPrivilege)) {
    return null;
  }

  const Icon = icon;
  
  // Create the main item link
  const itemLink = (
    <Link
      to={path}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors",
        "hover:bg-muted/50",
        active ? "bg-muted text-primary" : "text-muted-foreground",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <span className="flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </span>
      {!collapsed && (
        <span className="ml-3 truncate">{t(label)}</span>
      )}
    </Link>
  );

  // When sidebar is collapsed, show tooltip on hover
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{itemLink}</div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t(label)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default case - when sidebar is expanded
  return <div>{itemLink}</div>;
};

export default SidebarItem;
