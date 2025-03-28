
import React from "react";
import { AlertCircle, FileText, FilePlus, FileEdit, FileSearch } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "file" | "file-plus" | "file-edit" | "file-search" | "alert";
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  title,
  description,
  icon = "file",
  action,
  className,
}: EmptyStateProps) => {
  const IconComponent = {
    file: FileText,
    "file-plus": FilePlus,
    "file-edit": FileEdit,
    "file-search": FileSearch,
    alert: AlertCircle,
  }[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 h-full min-h-[240px]",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <IconComponent className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
