
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarItemLinkProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  hasSubItems: boolean;
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const SidebarItemLink: React.FC<SidebarItemLinkProps> = ({
  icon: Icon,
  label,
  path,
  active,
  collapsed,
  hasSubItems,
  isExpanded,
  onClick
}) => {
  const { t } = useLanguage();
  
  const baseClasses = cn(
    "flex items-center rounded-md transition-all duration-200 my-1",
    collapsed ? "justify-center p-2 mx-auto" : "px-3 py-2 w-full",
    active 
      ? "bg-primary/10 text-primary font-medium" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-1"
  );

  return (
    <Link
      to={path}
      onClick={onClick}
      className={baseClasses}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", collapsed && !hasSubItems && "mx-auto")} />
      
      {!collapsed && (
        <>
          <span className="ml-3 flex-1 text-sm capitalize">{t(label)}</span>
          {hasSubItems && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </>
      )}
    </Link>
  );
};

export default SidebarItemLink;
