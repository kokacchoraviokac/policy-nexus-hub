
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
  className?: string;
  spinnerSize?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  text = "Loading...",
  className = "",
  spinnerSize = 24
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" size={spinnerSize} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};
