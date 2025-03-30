
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FinancialReportFilters from "@/components/reports/financial/FinancialReportFilters";
import FinancialReportTable from "@/components/reports/financial/FinancialReportTable";
import FinancialReportSummary from "@/components/reports/financial/FinancialReportSummary";
import { useFinancialReport } from "@/hooks/reports/useFinancialReport";
import { useToast } from "@/hooks/use-toast";
import { FinancialReportFilters as FiltersType } from "@/utils/reports/financialReportUtils";

const FinancialReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FiltersType>({
    startDate: new Date(new Date().setDate(1)), // First day of current month
    endDate: new Date()
  });
  
  const { 
    data,
    isLoading, 
    isExporting,
    exportReport,
    refetch
  } = useFinancialReport(filters);
  
  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
  };
  
  const handleExport = () => {
    exportReport();
    toast({
      title: t("exportComplete"),
      description: t("financialReportExported"),
    });
  };
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: t("dataRefreshed"),
      description: t("financialReportRefreshed"),
    });
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
      
      <FinancialReportFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        isExporting={isExporting}
      />
      
      <FinancialReportSummary 
        data={data?.transactions || []} 
        isLoading={isLoading} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>{t("transactionHistory")}</CardTitle>
          <CardDescription>
            {t("viewAllFinancialTransactions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialReportTable 
            data={data?.transactions || []} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
