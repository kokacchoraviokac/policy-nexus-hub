
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, setCollapsed }) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
      {!collapsed && (
        <div className="text-sidebar-foreground font-medium text-xl">
          Policy<span className="text-[#c76449]">Hub</span>
        </div>
      )}
      {collapsed && (
        <div className="w-full flex justify-center text-sidebar-foreground font-medium text-xl">
          P<span className="text-[#c76449]">H</span>
        </div>
      )}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
};

export default SidebarHeader;
