
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, className, ...props }) => {
  const logoPath = "/lovable-uploads/12935fea-6db8-4d48-ade1-d8dc24b1c35a.png";
  
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
        <div className="text-sidebar-foreground font-medium text-xl">
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
