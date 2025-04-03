
import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  if (!message) return null;
  
  return (
    <div className={cn("flex items-center text-sm text-destructive mt-1.5", className)}>
      <AlertCircle className="h-4 w-4 mr-1.5" />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
