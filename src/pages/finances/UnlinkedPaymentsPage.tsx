
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { useUnlinkedPayments } from "@/hooks/useUnlinkedPayments";
import UnlinkedPaymentsTable from "@/components/finances/unlinked-payments/UnlinkedPaymentsTable";
import UnlinkedPaymentsFilters from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import UnlinkedPaymentsPagination from "@/components/finances/unlinked-payments/UnlinkedPaymentsPagination";
import LinkPaymentDialog from "@/components/policies/unlinked-payments/LinkPaymentDialog";

const UnlinkedPaymentsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  
  const {
    payments,
    totalCount,
    isLoading,
    filters,
    setFilters,
    pagination,
    setPagination,
    linkPayment,
    isLinking,
    exportPayments
  } = useUnlinkedPayments();
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination({ ...pagination, page: 1 });
  };
  
  const handleClearFilters = () => {
    setFilters({});
    // Reset to first page when filters are cleared
    setPagination({ ...pagination, page: 1 });
  };
  
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };
  
  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };
  
  const handleLinkPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setLinkDialogOpen(true);
  };
  
  const handleConfirmLink = (policyId: string) => {
    linkPayment({ paymentId: selectedPaymentId, policyId });
    setLinkDialogOpen(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/finances")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("backToFinances")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
            <p className="text-muted-foreground">
              {t("unlinkedPaymentsModuleDescription")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={exportPayments}
          disabled={payments.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          {t("exportPayments")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentManagement")}</CardTitle>
          <CardDescription>
            {t("unlinkedPaymentsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UnlinkedPaymentsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          <UnlinkedPaymentsTable
            payments={payments}
            isLoading={isLoading}
            onLinkPayment={handleLinkPayment}
            isLinking={isLinking}
            linkingPaymentId={selectedPaymentId}
          />
          
          {!isLoading && payments.length > 0 && (
            <UnlinkedPaymentsPagination
              totalCount={totalCount}
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>
      
      <LinkPaymentDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onConfirm={handleConfirmLink}
        isLoading={isLinking}
      />
    </div>
  );
};

export default UnlinkedPaymentsPage;
