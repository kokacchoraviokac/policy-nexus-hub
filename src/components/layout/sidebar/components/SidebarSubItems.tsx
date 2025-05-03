
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: React.ElementType;
}

interface SidebarSubItemsProps {
  subItems: SubItem[];
  currentPath: string;
}

const SidebarSubItems: React.FC<SidebarSubItemsProps> = ({ subItems, currentPath }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-1 ml-9 space-y-1">
      {subItems.map((item, i) => {
        const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
        
        return (
          <Link
            key={i}
            to={item.path}
            className={cn(
              "flex items-center text-sm px-3 py-1.5 rounded-md text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors duration-200",
              isActive && "bg-sidebar-accent/70 text-sidebar-foreground font-medium"
            )}
          >
            {item.icon && <item.icon size={16} className="mr-2 opacity-70" />}
            <span className="truncate">{t(item.label)}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarSubItems;
