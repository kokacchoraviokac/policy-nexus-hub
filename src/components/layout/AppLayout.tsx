
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        
        <main className={cn(
          "flex-1 overflow-auto p-6 transition-all duration-300 animate-enter no-scrollbar",
          sidebarCollapsed ? "lg:pl-24" : "lg:pl-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
