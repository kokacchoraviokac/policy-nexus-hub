
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
        className="h-6 w-6 rounded-full bg-sidebar-accent/10 text-sidebar-foreground flex items-center justify-center hover:bg-sidebar-accent/20 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
};

export default SidebarHeader;
