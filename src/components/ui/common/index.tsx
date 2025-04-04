
import React from "react";
import { cn } from "@/lib/utils";

// Export a lazy-loaded PageHeader component
export const PageHeader = React.lazy(() => import("@/components/ui/page/PageHeader"));

// Export other common components as needed
export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn("animate-spin rounded-full border-4 border-primary border-t-transparent", className || "h-8 w-8")}></div>
);
