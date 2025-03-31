
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useFinancialReport } from "@/hooks/reports/useFinancialReport";

const FinancialReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const { data, isLoading, refetch } = useFinancialReport({});
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Placeholder for actual export functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("totalIncome")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€24,500.00</p>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("totalExpenses")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€8,320.00</p>
            <p className="text-xs text-muted-foreground">-3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("netIncome")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€16,180.00</p>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("transactions")}</CardTitle>
            <CardDescription>{t("recentTransactions")}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileDown className="h-4 w-4 mr-1" />
            {isExporting ? t("exporting") : t("exportToExcel")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t("featureUnderDevelopment")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
