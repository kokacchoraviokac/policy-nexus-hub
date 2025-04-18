
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubItemProps {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: LucideIcon;
}

interface SidebarSubItemsProps {
  subItems: SubItemProps[];
  currentPath: string;
}

const SidebarSubItems: React.FC<SidebarSubItemsProps> = ({ 
  subItems, 
  currentPath,
}) => {
  const { t } = useLanguage();
  
  return (
    <ul className="pl-7 mt-2 space-y-1.5">
      {subItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
        
        // Ensure the text is properly capitalized when displayed
        const displayLabel = t(item.label);
        
        return (
          <li key={index}>
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{displayLabel}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarSubItems;
