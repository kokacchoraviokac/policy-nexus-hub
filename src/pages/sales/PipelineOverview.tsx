
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PipelineOverviewHeader from "@/components/sales/pipeline/PipelineOverviewHeader";
import PipelineSummary from "@/components/sales/pipeline/PipelineSummary";
import PipelineKanbanBoard from "@/components/sales/pipeline/PipelineKanbanBoard";
import { toast } from "sonner";

const PipelineOverview = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  
  const handleRefresh = () => {
    // In a real app, this would refresh data from API
    toast.success(t("pipelineRefreshed"), {
      description: t("pipelineRefreshedDescription"),
    });
  };
  
  const handleFilterChange = (period: string) => {
    setSelectedPeriod(period);
    // In a real app, this would update data based on the selected period
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PipelineOverviewHeader 
        onRefresh={handleRefresh}
        onFilterChange={handleFilterChange}
        selectedPeriod={selectedPeriod}
      />
      
      <PipelineSummary />
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium">{t("pipelineKanban")}</h2>
          <p className="text-sm text-muted-foreground">{t("pipelineKanbanDescription")}</p>
        </div>
        <PipelineKanbanBoard />
      </div>
    </div>
  );
};

export default PipelineOverview;
