
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarItemLinkProps {
  icon: React.ElementType;
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
  
  const linkContent = (
    <>
      <Icon className={cn("h-5 w-5 mr-2 flex-shrink-0", collapsed && "mx-auto")} />
      {!collapsed && <span className="flex-1">{t(label)}</span>}
      {!collapsed && hasSubItems && (
        <span className="ml-auto flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      )}
    </>
  );

  return (
    <Link
      to={hasSubItems ? "#" : path} // Use # for items with subitems to allow toggle without navigation
      onClick={onClick}
      className={cn(
        "flex items-center p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
        active && !hasSubItems && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        hasSubItems && isExpanded && "bg-sidebar-accent text-sidebar-accent-foreground",
        collapsed && "justify-center"
      )}
    >
      {linkContent}
    </Link>
  );
};

export default SidebarItemLink;
