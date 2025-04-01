
import React from "react";
import { cn } from "@/lib/utils";

// Add font import
import "@/styles/fonts.css";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, className, ...props }) => {
  const logoPath = "/lovable-uploads/1b311c28-eb7c-4569-8dad-cac01c35303c.png";
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center", 
        collapsed ? "w-8" : "w-full",
        className
      )} 
      {...props}
    >
      {collapsed ? (
        <div className="text-sidebar-foreground font-norwester text-xl">
          P<span className="text-[#c76449]">H</span>
        </div>
      ) : (
        <img 
          src={logoPath} 
          alt="Policy Hub Logo" 
          className="h-8 w-auto"
        />
      )}
    </div>
  );
};

export default Logo;
