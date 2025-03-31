
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";

interface SidebarHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, setCollapsed }) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
      <Logo collapsed={collapsed} />
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
