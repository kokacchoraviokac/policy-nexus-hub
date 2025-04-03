
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { BarChart, RefreshCcw } from "lucide-react";
import { useSalesProcessData } from "@/hooks/sales/useSalesProcessData";
import PipelineSummary from "@/components/sales/pipeline/PipelineSummary";
import PipelineKanbanBoard from "@/components/sales/pipeline/PipelineKanbanBoard";
import { 
  PageHeader, 
  FilterBar, 
  FilterGroup, 
  ActiveFilter,
  ActionButtons
} from "@/components/ui/common";

const PipelineOverview = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  
  // Use our custom hook to fetch sales process data
  const { salesProcesses, isLoading, error, refresh, processesByStage } = useSalesProcessData({
    stageFilter: "all" // We'll handle filtering through our UI
  });
  
  const handleRefresh = () => {
    refresh();
    toast.success(t("pipelineRefreshed"), {
      description: t("pipelineRefreshedDescription"),
    });
  };
  
  const handleFilterChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters);
    // In a real implementation, we would update our filter state and refetch data
  };

  // Define filter groups based on our data and business requirements
  const filterGroups: FilterGroup[] = [
    {
      id: "period",
      label: t("timePeriod"),
      options: [
        { id: "7days", label: t("last7Days"), value: "7days" },
        { id: "30days", label: t("last30Days"), value: "30days" },
        { id: "90days", label: t("last90Days"), value: "90days" },
        { id: "thisYear", label: t("thisYear"), value: "thisYear" },
      ]
    },
    {
      id: "stage",
      label: t("stage"),
      options: [
        { id: "quote", label: t("stageQuote"), value: "quote" },
        { id: "authorization", label: t("stageAuthorization"), value: "authorization" },
        { id: "proposal", label: t("stageProposal"), value: "proposal" },
        { id: "signed", label: t("stageSigned"), value: "signed" },
        { id: "concluded", label: t("stageConcluded"), value: "concluded" },
      ],
      multiSelect: true
    },
    {
      id: "status",
      label: t("status"),
      options: [
        { id: "active", label: t("statusActive"), value: "active" },
        { id: "completed", label: t("statusCompleted"), value: "completed" },
        { id: "canceled", label: t("statusCanceled"), value: "canceled" },
      ]
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader 
        title={t("salesPipeline")}
        description={t("salesPipelineDescription")}
        actions={
          <ActionButtons 
            primaryAction={{
              label: t("refresh"),
              onClick: handleRefresh,
              icon: <RefreshCcw className="h-4 w-4 mr-2" />,
              isLoading: isLoading
            }}
            secondaryActions={[
              {
                id: "viewChart",
                label: t("viewAsChart"),
                icon: <BarChart className="h-4 w-4" />,
                onClick: () => toast.info(t("featureComingSoon"))
              }
            ]}
          />
        }
      />
      
      <FilterBar
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => setActiveFilters([])}
      />
      
      <PipelineSummary 
        processesByStage={processesByStage} 
        isLoading={isLoading} 
      />
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium">{t("pipelineKanban")}</h2>
          <p className="text-sm text-muted-foreground">{t("pipelineKanbanDescription")}</p>
        </div>
        <PipelineKanbanBoard 
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default PipelineOverview;
