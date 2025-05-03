
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarItemLinkProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const SidebarItemLink: React.FC<SidebarItemLinkProps> = ({
  icon: Icon,
  label,
  path,
  active,
  collapsed,
  hasSubItems = false,
  isExpanded = false,
  onClick
}) => {
  return (
    <Link
      to={path}
      className={cn(
        "sidebar-item group flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200",
        active && "active bg-sidebar-primary text-sidebar-primary-foreground",
        hasSubItems && "justify-between"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon size={18} className={cn("shrink-0", active && "text-sidebar-primary-foreground")} />
        {!collapsed && (
          <span className="truncate">{label}</span>
        )}
      </div>
      
      {hasSubItems && !collapsed && (
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDown size={16} className="opacity-70" />
          ) : (
            <ChevronRight size={16} className="opacity-70" />
          )}
        </div>
      )}
    </Link>
  );
};

export default SidebarItemLink;
