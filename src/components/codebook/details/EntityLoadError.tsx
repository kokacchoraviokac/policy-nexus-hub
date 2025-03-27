
import React from "react";
import { AlertCircle } from "lucide-react";

interface EntityLoadErrorProps {
  entityType: string;
  error: Error;
}

const EntityLoadError: React.FC<EntityLoadErrorProps> = ({ entityType, error }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-destructive">
      <AlertCircle className="h-8 w-8 mb-2" />
      <h3 className="text-lg font-semibold">Error loading {entityType.toLowerCase()} details</h3>
      <p>{error.message}</p>
    </div>
  );
};

export default EntityLoadError;
