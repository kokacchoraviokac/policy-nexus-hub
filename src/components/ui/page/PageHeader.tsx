
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backButtonLabel?: string;
  backButtonPath?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backButtonLabel,
  backButtonPath,
  actions,
  className,
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-2 mb-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {(backButtonPath || backButtonLabel) && (
            <Button
              variant="outline"
              size="sm"
              className="mr-2 h-8 gap-1 w-fit"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              {backButtonLabel}
            </Button>
          )}
          
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
