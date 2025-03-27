
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EntityNotFoundProps {
  entityType: string;
  backPath: string;
  backLabel: string;
}

const EntityNotFound: React.FC<EntityNotFoundProps> = ({ 
  entityType, 
  backPath, 
  backLabel 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <AlertCircle className="h-8 w-8 mb-2" />
      <h3 className="text-lg font-semibold">{entityType} not found</h3>
      <p>The {entityType.toLowerCase()} you're looking for doesn't exist or has been removed.</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate(backPath)}>
        Return to {backLabel}
      </Button>
    </div>
  );
};

export default EntityNotFound;
