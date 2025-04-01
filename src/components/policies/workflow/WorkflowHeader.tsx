
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Import, RefreshCw } from "lucide-react";

interface WorkflowHeaderProps {
  onRefresh: () => void;
  onImport: () => void;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  onRefresh,
  onImport,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("policiesWorkflow")}</h1>
        <p className="text-muted-foreground">
          {t("policiesWorkflowDescription")}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className="gap-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          {t("refresh")}
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          onClick={onImport}
          className="gap-1.5"
        >
          <Import className="h-4 w-4" />
          {t("importPolicies")}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowHeader;
