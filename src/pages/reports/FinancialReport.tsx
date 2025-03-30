
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import FinancialReportFilters from "@/components/reports/financial/FinancialReportFilters";
import FinancialReportSummary from "@/components/reports/financial/FinancialReportSummary";
import FinancialReportTable from "@/components/reports/financial/FinancialReportTable";
import { useFinancialReport } from "@/hooks/reports/useFinancialReport";
import { FinancialReportFilters as FinancialFiltersType } from "@/utils/reports/financialReportUtils";

const FinancialReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FinancialFiltersType>({});
  
  const {
    data,
    isLoading,
    refetch,
    isExporting,
    setIsExporting,
    exportReport
  } = useFinancialReport(filters);

  const handleFiltersChange = (newFilters: FinancialFiltersType) => {
    setFilters(newFilters);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleExport = async () => {
    if (!data?.transactions || data.transactions.length === 0) {
      toast({
        title: t("noDataToExport"),
        description: t("pleaseAdjustYourFiltersAndTryAgain"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting(true);
      await exportReport();
      
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
        <h1 className="text-2xl font-bold tracking-tight">{t("financialReport")}</h1>
        <p className="text-muted-foreground">
          {t("financialReportDescription")}
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
          <FinancialReportFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
            isExporting={isExporting}
          />
        </CardContent>
      </Card>

      {data && (
        <FinancialReportSummary data={data} />
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("transactions")}</h2>
          <p className="text-sm text-muted-foreground">
            {data?.totalCount ? t("showingResults", { count: data.totalCount }) : t("noResults")}
          </p>
        </div>
        
        <Separator />
        
        <FinancialReportTable
          data={data?.transactions || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default FinancialReport;
