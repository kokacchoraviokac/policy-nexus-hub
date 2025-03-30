
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UnlinkedPaymentsTable } from "@/components/finances/unlinked-payments/UnlinkedPaymentsTable";
import { UnlinkedPaymentsFilters } from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import { useUnlinkedPaymentsFilters } from "@/hooks/unlinked-payments/useUnlinkedPaymentsFilters";
import { useUnlinkedPaymentsQuery } from "@/hooks/unlinked-payments/useUnlinkedPaymentsQuery";
import { useUnlinkedPaymentsPagination } from "@/hooks/unlinked-payments/useUnlinkedPaymentsPagination";
import { useUnlinkedPaymentsExport } from "@/hooks/unlinked-payments/useUnlinkedPaymentsExport";
import { UnlinkedPaymentsPagination } from "@/components/finances/unlinked-payments/UnlinkedPaymentsPagination";

const UnlinkedPaymentsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { filters, setFilters } = useUnlinkedPaymentsFilters();
  const { pagination, setPagination } = useUnlinkedPaymentsPagination();
  
  const {
    data: unlinkedPayments,
    totalItems,
    isLoading,
    isError,
    refetch
  } = useUnlinkedPaymentsQuery({
    filters,
    pagination
  });
  
  const { exportUnlinkedPayments, isExporting } = useUnlinkedPaymentsExport();
  
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
      await exportUnlinkedPayments(filters);
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
      
      <UnlinkedPaymentsFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      <UnlinkedPaymentsTable 
        payments={unlinkedPayments || []}
        isLoading={isLoading}
        onRefresh={refetch}
      />
      
      <UnlinkedPaymentsPagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default UnlinkedPaymentsPage;
