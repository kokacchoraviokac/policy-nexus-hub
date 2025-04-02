
import React from "react";
import { cn } from "@/lib/utils";
import ModernSidebar from "./sidebar/ModernSidebar";

// This component is now just a wrapper for ModernSidebar
// to maintain backward compatibility if needed
const Sidebar = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  return (
    <div className={cn("h-screen", className)}>
      <ModernSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>
  );
};

export default Sidebar;
