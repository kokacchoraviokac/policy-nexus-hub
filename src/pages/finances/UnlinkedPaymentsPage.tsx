
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, FileDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UnlinkedPaymentsTable from "@/components/finances/unlinked-payments/UnlinkedPaymentsTable";
import { UnlinkedPaymentsFilters } from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import { useUnlinkedPaymentsFilters } from "@/hooks/unlinked-payments/useUnlinkedPaymentsFilters";
import { useUnlinkedPaymentsQuery } from "@/hooks/unlinked-payments/useUnlinkedPaymentsQuery";
import { useUnlinkedPaymentsPagination } from "@/hooks/unlinked-payments/useUnlinkedPaymentsPagination";
import { useUnlinkedPaymentsExport } from "@/hooks/unlinked-payments/useUnlinkedPaymentsExport";
import UnlinkedPaymentsPagination from "@/components/finances/unlinked-payments/UnlinkedPaymentsPagination";
import { UnlinkedPaymentType } from "@/types/finances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UnlinkedPaymentsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { filters, setFilters } = useUnlinkedPaymentsFilters();
  const { pagination, setPagination } = useUnlinkedPaymentsPagination();
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useUnlinkedPaymentsQuery({
    filters,
    pagination
  });
  
  const unlinkedPayments = data?.data as UnlinkedPaymentType[] || [];
  const totalItems = data?.totalCount || 0;
  
  const { exportPayments } = useUnlinkedPaymentsExport(filters);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination({
      ...pagination,
      page: 1,
      pageIndex: 0
    });
  };
  
  const handleClearFilters = () => {
    setFilters({});
    setPagination({
      ...pagination,
      page: 1,
      pageIndex: 0
    });
  };
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportPayments();
      toast({
        title: t("exportSuccess"),
        description: t("unlinkedPaymentsExportedSuccessfully"),
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: t("exportError"),
        description: t("unlinkedPaymentsExportFailed"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setPagination({
      ...pagination,
      page: newPage,
      pageIndex: newPage - 1
    });
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({
      ...pagination,
      pageSize: newPageSize,
      page: 1,
      pageIndex: 0
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/finances"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("unlinkedPayments")}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            {t("refresh")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileDown className="h-4 w-4" />
            {isExporting ? t("exporting") : t("exportPayments")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UnlinkedPaymentsFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("unlinkedPayments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UnlinkedPaymentsTable 
            payments={unlinkedPayments}
            isLoading={isLoading}
            onRefresh={refetch}
          />
          
          <div className="mt-4">
            <UnlinkedPaymentsPagination
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnlinkedPaymentsPage;
