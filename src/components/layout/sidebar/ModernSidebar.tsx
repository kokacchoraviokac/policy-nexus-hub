
import React from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

interface ModernSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <SidebarNav collapsed={collapsed} />
        </div>
        <SidebarFooter collapsed={collapsed} />
      </div>
    </div>
  );
};

export default ModernSidebar;
