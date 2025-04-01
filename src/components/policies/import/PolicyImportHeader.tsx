
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PolicyImportHeaderProps {
  title: string;
  description: string;
  onBackToWorkflow: () => void;
}

const PolicyImportHeader: React.FC<PolicyImportHeaderProps> = ({
  title,
  description,
  onBackToWorkflow
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={onBackToWorkflow}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToPoliciesWorkflow")}
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default PolicyImportHeader;
