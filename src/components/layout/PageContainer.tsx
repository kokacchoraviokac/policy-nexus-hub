
import React from "react";
import { cn } from "@/utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full'
};

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className, 
  maxWidth = 'full' 
}) => {
  return (
    <div className={cn(
      "container mx-auto px-4 py-6", 
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
};

export default PageContainer;
