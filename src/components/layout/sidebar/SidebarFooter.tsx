
import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarImage src={user?.avatar || `https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user?.name}
              </span>
              <span className="text-xs text-sidebar-foreground/70">{user?.role || "User"}</span>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">{t("help")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="sidebar-tooltip">
              {t("help")}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">{t("logout")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="sidebar-tooltip">
              {t("logout")}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
