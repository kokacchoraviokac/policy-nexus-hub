
import React from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/utils/cn";

interface PaginationButtonProps extends Omit<ButtonProps, "className"> {
  isActive?: boolean;
  className?: string;
}

export const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(({ isActive, className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={isActive ? "default" : "outline"}
      className={cn(
        "h-8 w-8", 
        isActive && "pointer-events-none", 
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

PaginationButton.displayName = "PaginationButton";

export default PaginationButton;
