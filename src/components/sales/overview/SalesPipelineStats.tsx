
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SalesPipelineStatsProps {
  isLoading: boolean;
  error: Error | null;
}

const SalesPipelineStats: React.FC<SalesPipelineStatsProps> = ({ 
  isLoading, 
  error 
}) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("pipelineStats")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("pipelineStats")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-destructive">
            <p className="text-center">{t("errorLoadingStats")}</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Placeholder data - in a real app, this would come from props
  const stats = [
    { label: t("activeSalesProcesses"), value: 24 },
    { label: t("newLeadsThisWeek"), value: 12 },
    { label: t("pendingQuotes"), value: 8 },
    { label: t("closedDealsThisMonth"), value: 5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pipelineStats")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPipelineStats;
