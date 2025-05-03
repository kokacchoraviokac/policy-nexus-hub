
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import ModernSidebar from "./sidebar/ModernSidebar";

const Sidebar = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className={cn("h-screen", className)}>
      <ModernSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
    </div>
  );
};

export default Sidebar;
