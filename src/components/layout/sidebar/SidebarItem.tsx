
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: LucideIcon;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  requiredPrivilege: string;
  subItems?: SubItem[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  path,
  active,
  collapsed,
  requiredPrivilege,
  subItems,
  isExpanded = false,
  onToggleExpand
}) => {
  const { hasPrivilege } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  
  // Filter sub-items based on user privileges
  const authorizedSubItems = subItems?.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );

  // Only render if user has required privilege
  if (!hasPrivilege(requiredPrivilege)) {
    return null;
  }

  // If no authorized sub-items exist for this item, render it as a simple link
  const hasSubItems = authorizedSubItems && authorizedSubItems.length > 0;
  
  const handleItemClick = (e: React.MouseEvent) => {
    if (hasSubItems && onToggleExpand) {
      e.preventDefault();
      onToggleExpand();
    }
  };
  
  const item = (
    <Link 
      to={path}
      className={cn(
        "sidebar-item group flex items-center w-full p-2 rounded-md transition-colors duration-200",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
      )}
      onClick={handleItemClick}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <span className="ml-3 truncate">{t(label)}</span>
      )}
      {!collapsed && hasSubItems && (
        <svg 
          className={cn(
            "w-3 h-3 ml-auto transform transition-transform",
            isExpanded ? "rotate-90" : "rotate-0"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );

  // Render sub-items if not collapsed and expanded
  const subItemsComponent = !collapsed && isExpanded && hasSubItems && (
    <div className="pl-9 mt-1 space-y-1">
      {authorizedSubItems?.map((subItem, index) => {
        const isSubItemActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
        
        return (
          <Link
            key={index}
            to={subItem.path}
            className={cn(
              "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md py-1.5 px-2 text-sm flex items-center",
              isSubItemActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
            <span>{t(subItem.label)}</span>
          </Link>
        );
      })}
    </div>
  );

  // When sidebar is collapsed, use HoverCard to show sub-items on hover
  if (collapsed && hasSubItems) {
    return (
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <div className="relative">
            {item}
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          side="right" 
          align="start" 
          className="w-52 p-2 sidebar-hover-card border-sidebar-border z-50"
        >
          <div className="font-medium text-sm mb-2 border-b border-gray-200 pb-1">{t(label)}</div>
          <div className="space-y-1">
            {authorizedSubItems?.map((subItem, index) => {
              const isSubItemActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
              
              return (
                <Link
                  key={index}
                  to={subItem.path}
                  className={cn(
                    "text-foreground hover:bg-muted rounded-md py-1.5 px-2 text-sm flex items-center transition-colors duration-200",
                    isSubItemActive && "bg-primary/10 font-medium"
                  )}
                >
                  {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                  <span>{t(subItem.label)}</span>
                </Link>
              );
            })}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  // When sidebar is collapsed and no sub-items, show tooltip on hover
  if (collapsed && !hasSubItems) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{item}</div>
        </TooltipTrigger>
        <TooltipContent side="right" className="sidebar-tooltip">
          {t(label)}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Default case - when sidebar is expanded
  return (
    <div>
      {item}
      {subItemsComponent}
    </div>
  );
};

export default SidebarItem;
