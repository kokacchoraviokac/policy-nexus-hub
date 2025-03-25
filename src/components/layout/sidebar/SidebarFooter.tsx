
import React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className={cn(
        "flex items-center gap-3",
        collapsed ? "justify-center" : "px-2"
      )}>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
          {user.name.charAt(0)}
        </div>
        {!collapsed && (
          <div>
            <div className="text-xs font-medium text-sidebar-foreground">{user.name}</div>
            <div className="text-xs text-sidebar-foreground/70">{user.email}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarFooter;
