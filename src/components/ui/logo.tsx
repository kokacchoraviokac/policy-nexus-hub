
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, className, ...props }) => {
  const logoPath = "/lovable-uploads/3b177361-b829-4fcf-ad25-4f4eb04166bf.png";
  
  return (
    <div 
      className={cn(
        "flex items-center", 
        collapsed ? "justify-center" : "justify-start",
        className
      )} 
      {...props}
    >
      {collapsed ? (
        <div className="text-sidebar-foreground font-semibold text-lg">
          P<span className="text-sidebar-primary">H</span>
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
