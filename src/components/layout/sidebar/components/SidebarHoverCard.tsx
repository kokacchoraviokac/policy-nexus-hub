
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: LucideIcon;
}

interface SidebarHoverCardProps {
  label: string;
  subItems: SubItem[];
  currentPath: string;
  children: React.ReactNode;
}

const SidebarHoverCard: React.FC<SidebarHoverCardProps> = ({ label, subItems, currentPath, children }) => {
  const { t } = useLanguage();

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div className="relative">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="right" 
        align="start" 
        className="w-52 p-2 sidebar-hover-card border-sidebar-border z-50"
      >
        <div className="font-medium text-sm mb-2 border-b border-gray-200 pb-1">{t(label)}</div>
        <div className="space-y-1">
          {subItems.map((subItem, index) => {
            const isSubItemActive = 
              currentPath === subItem.path || 
              currentPath.startsWith(`${subItem.path}/`) ||
              (subItem.path !== "/" && 
               currentPath.includes(subItem.path.split("/").filter(Boolean)[0]));
            
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
};

export default SidebarHoverCard;
