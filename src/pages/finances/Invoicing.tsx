
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, FileDown } from "lucide-react";
import { Link } from "react-router-dom";
import InvoicesTable from "@/components/finances/invoices/InvoicesTable";
import InvoicesFilters from "@/components/finances/invoices/InvoicesFilters";
import { useInvoices } from "@/hooks/finances/useInvoices";
import CreateInvoiceDialog from "@/components/finances/invoices/CreateInvoiceDialog";
import { exportInvoicesToExcel } from "@/utils/invoices/excelExport";

const Invoicing = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    invoices,
    totalCount,
    isLoading,
    filters,
    setFilters,
    pagination,
    refetch,
    clearFilters,
    exportAllInvoices
  } = useInvoices();

  const handleExportInvoices = async () => {
    try {
      setIsExporting(true);
      toast({
        title: t("exportStarted"),
        description: t("preparingExportData"),
      });
      
      // Get all invoices for export (not just the current page)
      const allInvoices = await exportAllInvoices();
      
      // Create translations object
      const translations = {
        invoiceNumber: t("invoiceNumber"),
        entityName: t("entityName"),
        entityType: t("entityType"),
        issueDate: t("issueDate"),
        dueDate: t("dueDate"),
        status: t("status"),
        totalAmount: t("totalAmount"),
        currency: t("currency"),
        invoiceType: t("invoiceType"),
        invoiceCategory: t("invoiceCategory"),
        calculationReference: t("calculationReference"),
        draft: t("draft"),
        issued: t("issued"),
        paid: t("paid"),
        cancelled: t("cancelled"),
        domestic: t("domestic"),
        foreign: t("foreign"),
        automatic: t("automatic"),
        manual: t("manual")
      };
      
      exportInvoicesToExcel(allInvoices, translations);
      
      toast({
        title: t("exportCompleted"),
        description: t("invoicesExportedSuccessfully"),
      });
    } catch (error) {
      console.error("Error exporting invoices:", error);
      toast({
        title: t("errorExportingInvoices"),
        description: t("errorExportingInvoicesDescription"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link 
              to="/finances"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{t("invoicing")}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {t("invoicingModuleDescription")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleExportInvoices}
            disabled={isExporting || isLoading || totalCount === 0}
          >
            <FileDown className="h-4 w-4 mr-2" />
            {isExporting ? t("exporting") : t("exportInvoices")}
          </Button>
          <Button 
            size="sm" 
            className="h-9"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("createInvoice")}
          </Button>
        </div>
      </div>

      <InvoicesFilters 
        filters={filters} 
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
      />

      <InvoicesTable
        invoices={invoices}
        isLoading={isLoading}
        pagination={pagination}
        totalCount={totalCount}
        onRefresh={refetch}
      />
      
      <CreateInvoiceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onInvoiceCreated={refetch}
      />
    </div>
  );
};

export default Invoicing;
