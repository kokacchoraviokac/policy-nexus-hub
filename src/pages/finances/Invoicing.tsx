
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

const Invoicing = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const {
    invoices,
    totalCount,
    isLoading,
    filters,
    setFilters,
    pagination,
    refetch,
    clearFilters
  } = useInvoices();

  const handleExportInvoices = () => {
    toast({
      title: t("exportStarted"),
      description: t("preparingExportData"),
    });
    // Export functionality would be implemented here
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
          >
            <FileDown className="h-4 w-4 mr-2" />
            {t("exportInvoices")}
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
