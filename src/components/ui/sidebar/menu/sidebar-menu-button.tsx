
import * as React from "react";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "../sidebar-hooks";
import { sidebarMenuButtonVariants } from "./sidebar-menu-button-variants";

interface SidebarMenuButtonProps extends
  React.ComponentProps<"button">,
  VariantProps<typeof sidebarMenuButtonVariants> {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  }

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
