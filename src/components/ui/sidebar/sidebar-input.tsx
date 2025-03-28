
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type SidebarInputProps = React.ComponentPropsWithoutRef<typeof Input>;

export const SidebarInput = React.forwardRef<HTMLInputElement, SidebarInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInput.displayName = "SidebarInput";
