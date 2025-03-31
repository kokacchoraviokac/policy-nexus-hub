
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useFinancialReport } from "@/hooks/reports/useFinancialReport";
import { exportFinancialReportToCsv, mapToFinancialTransaction, FinancialReportFilters } from "@/utils/reports/financialReportUtils";
import FinancialReportFilters from "@/components/reports/financial/FinancialReportFilters";
import FinancialReportSummary from "@/components/reports/financial/FinancialReportSummary";
import FinancialTransactions from "@/components/reports/financial/FinancialTransactions";

const FinancialReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState<FinancialReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  
  const { data, isLoading, refetch, isExporting, setIsExporting } = useFinancialReport(filters);
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (data?.transactions) {
        exportFinancialReportToCsv(data.transactions, "financial-report.csv");
        
        toast({
          title: t("exportSuccessful"),
          description: t("reportHasBeenDownloaded")
        });
      } else {
        throw new Error("No data to export");
      }
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

  const handleFiltersChange = (newFilters: FinancialReportFilters) => {
    setFilters(newFilters);
  };
  
  // Map data.transactions to FinancialTransaction type for components
  const financialTransactions = data?.transactions ? 
    data.transactions.map(mapToFinancialTransaction) : [];
  
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
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <FinancialReportFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onRefresh={() => refetch()}
            isExporting={isExporting}
          />
        </CardContent>
      </Card>
      
      <FinancialReportSummary 
        data={financialTransactions} 
        isLoading={isLoading} 
      />
      
      <FinancialTransactions 
        data={financialTransactions}
        isLoading={isLoading}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
};

export default FinancialReport;
