
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
    <ul className="pl-7 mt-2 space-y-1">
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
                "flex items-center gap-3 px-2 py-1.5 text-sm rounded-md transition-colors duration-200",
                isActive 
                  ? "bg-[#C76449] text-white font-medium" 
                  : "text-sidebar-foreground hover:bg-[#C76449]/20 hover:text-white"
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
