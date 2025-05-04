
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-norwester text-lg tracking-wider text-white">
              POLICY HUB
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {t("insuranceManagement")}
            </span>
          </div>
        )}
        
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-accent">
            <span className="font-norwester text-lg tracking-wider text-white">P</span>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? 
          <ChevronRight className="h-4 w-4" /> : 
          <ChevronLeft className="h-4 w-4" />
        }
      </Button>
    </div>
  );
};

export default SidebarHeader;
