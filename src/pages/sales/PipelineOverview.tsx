
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { KanbanSquare } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

const PipelineOverview = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("pipelineOverview")}</h1>
        <Button variant="outline" size="sm">
          {t("filters")}
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <EmptyState
          title={t("pipelineEmpty")}
          description={t("pipelineEmptyDescription")}
          icon="file-search"
          action={
            <Button className="mt-4" size="sm">
              {t("createSalesProcess")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default PipelineOverview;
