
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUnlinkedPayments } from "@/hooks/useUnlinkedPayments";
import { UnlinkedPaymentType } from "@/types/policies";
import { useLocation } from "react-router-dom";

// Import the new components
import LinkPaymentDialog from "@/components/finances/unlinked-payments/LinkPaymentDialog";
import UnlinkedPaymentsFilters from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import PaymentDetailsDialog from "@/components/finances/unlinked-payments/PaymentDetailsDialog";
import PaginationController from "@/components/ui/pagination-controller";
import UnlinkedPaymentsHeader from "@/components/finances/unlinked-payments/UnlinkedPaymentsHeader";
import PaymentsTable from "@/components/finances/unlinked-payments/PaymentsTable";

const UnlinkedPayments = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<UnlinkedPaymentType | null>(null);
  
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
    refetch,
    exportPayments
  } = useUnlinkedPayments();
  
  // Check if we're coming from a policy page to record a payment
  useEffect(() => {
    const state = location.state as { fromPolicyId?: string } | undefined;
    if (state?.fromPolicyId) {
      // Automatically set the filters to show unlinked payments
      setFilters({
        ...filters,
        status: "unlinked"
      });
    }
  }, [location]);
  
  const handleLinkPayment = (payment: UnlinkedPaymentType) => {
    setSelectedPayment(payment);
    setShowLinkDialog(true);
  };
  
  const handleViewPaymentDetails = (payment: UnlinkedPaymentType) => {
    setSelectedPayment(payment);
    setShowDetailsDialog(true);
  };
  
  const handleConfirmLink = (policyId: string) => {
    if (selectedPayment) {
      linkPayment({ paymentId: selectedPayment.id, policyId });
      setShowLinkDialog(false);
    }
  };
  
  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "unlinked"
    });
  };

  return (
    <div className="space-y-6">
      <UnlinkedPaymentsHeader onExport={exportPayments} />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("paymentManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UnlinkedPaymentsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={refetch}
            isLoading={isLoading}
          />
          
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reference")}</TableHead>
                  <TableHead>{t("payerName")}</TableHead>
                  <TableHead className="text-right">{t("amount")}</TableHead>
                  <TableHead>{t("paymentDate")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <PaymentsTable 
                  payments={payments}
                  isLoading={isLoading}
                  onView={handleViewPaymentDetails}
                  onLink={handleLinkPayment}
                  onClearFilters={handleClearFilters}
                />
              </TableBody>
            </Table>
          </div>
          
          {totalCount > 0 && (
            <div className="mt-4 flex justify-end">
              <PaginationController
                currentPage={pagination.pageIndex}
                totalPages={Math.ceil(totalCount / pagination.pageSize)}
                itemsPerPage={pagination.pageSize}
                totalItems={totalCount}
                onPageChange={(page) => setPagination({ ...pagination, pageIndex: page })}
                onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedPayment && (
        <>
          <LinkPaymentDialog
            open={showLinkDialog}
            onOpenChange={setShowLinkDialog}
            onConfirm={handleConfirmLink}
            isLoading={isLinking}
            paymentReference={selectedPayment.reference}
            paymentAmount={selectedPayment.amount}
            payerName={selectedPayment.payer_name}
          />
          
          <PaymentDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            payment={selectedPayment}
          />
        </>
      )}
    </div>
  );
};

export default UnlinkedPayments;
