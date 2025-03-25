
import React from "react";
import { Info } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState = ({ 
  title, 
  description, 
  icon = <Info className="h-12 w-12 text-muted-foreground" />, 
  action 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
