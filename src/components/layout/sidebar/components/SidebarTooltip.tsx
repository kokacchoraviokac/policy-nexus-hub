
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarTooltipProps {
  label: string;
  children: React.ReactNode;
}

const SidebarTooltip: React.FC<SidebarTooltipProps> = ({ label, children }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent side="right" className="sidebar-tooltip">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarTooltip;
