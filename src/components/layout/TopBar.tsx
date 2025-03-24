
import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <header className="h-16 border-b border-border flex items-center px-4 bg-white/80 backdrop-blur-sm">
      <button 
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors mr-2"
      >
        <Menu size={20} />
      </button>
      
      <div className="flex-1">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input 
            type="search" 
            placeholder="Search..." 
            className={cn(
              "pl-10 pr-4 py-2 text-sm rounded-full w-full",
              "bg-secondary border-none focus:ring-1 focus:ring-primary/20",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
