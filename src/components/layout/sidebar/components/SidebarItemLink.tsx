
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarItemLinkProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  hasSubItems: boolean;
  isExpanded?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const SidebarItemLink: React.FC<SidebarItemLinkProps> = ({
  icon: Icon,
  label,
  path,
  active,
  collapsed,
  hasSubItems,
  isExpanded = false,
  onClick
}) => {
  const { t } = useLanguage();

  return (
    <Link 
      to={path}
      className={cn(
        "sidebar-item group flex items-center w-full p-2 rounded-md transition-colors duration-200",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
      )}
      onClick={onClick}
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
};

export default SidebarItemLink;
