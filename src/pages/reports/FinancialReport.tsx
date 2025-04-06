
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialReportSummary from "@/components/reports/financial/FinancialReportSummary";
import FinancialReportFilters from "@/components/reports/financial/FinancialReportFilters";
import FinancialTransactions from "@/components/reports/financial/FinancialTransactions";
import FinancialReportTable from "@/components/reports/financial/FinancialReportTable";
import { useFinancialReport } from "@/hooks/reports/useFinancialReport";
import { useLanguage } from "@/contexts/LanguageContext";

const FinancialReport: React.FC = () => {
  const { t } = useLanguage();
  const { 
    reports,
    isLoading,
    error,
    filters, 
    setFilters,
    applyFilters,
    resetFilters,
    summary,
    defaultFilters
  } = useFinancialReport();

  // Run the report on initial load
  useEffect(() => {
    applyFilters();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("financialReport")}
        description={t("financialReportDescription")}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t("reportFilters")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialReportFilters 
              filters={filters} 
              onApply={applyFilters}
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-destructive">
                  {t("errorLoadingReport")}
                </h3>
                <p className="mt-2">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <FinancialReportSummary summary={summary} />
            
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">{t("tableView")}</TabsTrigger>
                <TabsTrigger value="transactions">{t("transactionsView")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table" className="mt-6">
                <FinancialReportTable data={reports.data} />
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-6">
                <FinancialTransactions data={reports.data} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialReport;
