
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: LucideIcon;
}

interface SidebarSubItemsProps {
  subItems: SubItem[];
  currentPath: string;
}

const SidebarSubItems: React.FC<SidebarSubItemsProps> = ({ subItems, currentPath }) => {
  const { t } = useLanguage();

  return (
    <div className="pl-9 mt-1 space-y-1">
      {subItems.map((subItem, index) => {
        // More precise path matching for subitems - exact match or direct child routes only
        const isSubItemActive = 
          currentPath === subItem.path || 
          (currentPath.startsWith(`${subItem.path}/`) && 
           !currentPath.substring(subItem.path.length + 1).includes('/'));
        
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
};

export default SidebarSubItems;
