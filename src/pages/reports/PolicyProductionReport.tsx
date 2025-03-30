
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import PolicyProductionFilters from "@/components/reports/policies/PolicyProductionFilters";
import PolicyProductionTable from "@/components/reports/policies/PolicyProductionTable";
import { usePolicyProductionReport } from "@/hooks/usePolicyProductionReport";
import { PolicyReportFilters, exportPolicyReportToCsv } from "@/utils/policies/policyReportUtils";

const PolicyProductionReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<PolicyReportFilters>({});
  
  const {
    data,
    isLoading,
    refetch,
    isExporting,
    setIsExporting
  } = usePolicyProductionReport(filters);
  
  const handleFiltersChange = (newFilters: PolicyReportFilters) => {
    setFilters(newFilters);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleExport = async () => {
    if (!data?.policies || data.policies.length === 0) {
      toast({
        title: t("noDataToExport"),
        description: t("pleaseAdjustYourFiltersAndTryAgain"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting(true);
      exportPolicyReportToCsv(data.policies);
      
      toast({
        title: t("exportSuccessful"),
        description: t("reportHasBeenDownloaded")
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: t("exportFailed"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackToReports}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("backToReports")}
      </Button>
      
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("policyProductionReport")}</h1>
        <p className="text-muted-foreground">
          {t("viewAndExportPolicyProductionData")}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("filters")}</CardTitle>
          <CardDescription>
            {t("adjustFiltersToRefineResults")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PolicyProductionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
            isExporting={isExporting}
          />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("results")}</h2>
          <p className="text-sm text-muted-foreground">
            {data?.totalCount ? t("showingResults", { count: data.totalCount }) : t("noResults")}
          </p>
        </div>
        
        <Separator />
        
        <PolicyProductionTable
          data={data?.policies || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PolicyProductionReport;
