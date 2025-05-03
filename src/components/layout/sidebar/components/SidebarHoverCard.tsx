
import React from "react";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: React.ElementType;
}

interface SidebarHoverCardProps {
  label: string;
  subItems: SubItem[];
  children: React.ReactNode;
  currentPath: string;
}

const SidebarHoverCard: React.FC<SidebarHoverCardProps> = ({
  label,
  subItems,
  children,
  currentPath
}) => {
  const { t } = useLanguage();

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent 
        side="right" 
        align="start"
        className="sidebar-hover-card w-64 p-2"
      >
        <div className="space-y-1 p-2">
          <h4 className="text-sm font-medium">{t(label)}</h4>
          <div className="space-y-0.5">
            {subItems.map((item, i) => {
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              
              return (
                <Link
                  key={i}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  {item.icon && <item.icon size={16} className="mr-2 opacity-70" />}
                  <span>{t(item.label)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SidebarHoverCard;
