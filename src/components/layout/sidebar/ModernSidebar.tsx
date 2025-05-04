
import React from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

interface ModernSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  collapsed,
  onCollapsedChange
}) => {
  return (
    <div 
      className={cn(
        "bg-sidebar border-r border-sidebar-border shrink-0",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out h-full flex flex-col"
      )}
    >
      {/* Sidebar header with logo and collapse button */}
      <SidebarHeader 
        collapsed={collapsed} 
        setCollapsed={onCollapsedChange} 
      />
      
      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto sidebar-scrollbar">
        <SidebarNav collapsed={collapsed} />
      </div>
      
      {/* User profile footer */}
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};

export default ModernSidebar;
