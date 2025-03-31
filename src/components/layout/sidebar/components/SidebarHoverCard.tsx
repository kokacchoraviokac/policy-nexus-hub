
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
        <div className="relative cursor-pointer">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="right" 
        align="start" 
        className="w-56 p-3 z-50 bg-popover border border-sidebar-border"
      >
        <div className="font-medium text-sm mb-3 border-b border-gray-200 pb-2">{t(label)}</div>
        <div className="space-y-1.5">
          {subItems.map((subItem, index) => {
            const isSubItemActive = 
              currentPath === subItem.path || 
              currentPath.startsWith(`${subItem.path}/`);
            
            return (
              <Link
                key={index}
                to={subItem.path}
                className={cn(
                  "text-foreground hover:bg-[#C76449]/20 hover:text-[#C76449] rounded-md py-2 px-3 text-sm flex items-center transition-colors duration-200",
                  isSubItemActive && "bg-[#C76449] text-white font-medium"
                )}
              >
                {subItem.icon && <subItem.icon className="h-4 w-4 mr-3 flex-shrink-0" />}
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
