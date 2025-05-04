
import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
};

export default SectionContainer;
