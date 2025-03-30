import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Link as LinkIcon, Eye, Loader2 } from "lucide-react";
import { useUnlinkedPayments } from "@/hooks/useUnlinkedPayments";
import LinkPaymentDialog from "@/components/finances/unlinked-payments/LinkPaymentDialog";
import UnlinkedPaymentsFilters from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import PaymentDetailsDialog from "@/components/finances/unlinked-payments/PaymentDetailsDialog";
import PaginationController from "@/components/ui/pagination-controller";
import { UnlinkedPaymentType } from "@/types/policies";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";

const UnlinkedPayments = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
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
  
  const handleExport = () => {
    exportPayments();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
          <p className="text-muted-foreground">
            {t("unlinkedPaymentsDescription")}
          </p>
        </div>
        
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          {t("exportPayments")}
        </Button>
      </div>
      
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">{t("loadingPayments")}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.reference || "-"}
                      </TableCell>
                      <TableCell>{payment.payer_name || "-"}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.amount, payment.currency || "EUR")}
                      </TableCell>
                      <TableCell>
                        {formatDate(payment.payment_date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.linked_policy_id ? "default" : "outline"}>
                          {payment.linked_policy_id ? t("linked") : t("unlinked")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewPaymentDetails(payment)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">{t("view")}</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLinkPayment(payment)}
                            disabled={!!payment.linked_policy_id}
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            {payment.linked_policy_id ? t("linked") : t("link")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-muted-foreground">{t("noPaymentsFound")}</p>
                        <Button 
                          variant="link" 
                          className="mt-2" 
                          onClick={() => handleClearFilters()}
                        >
                          {t("clearFilters")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
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
  
  function handleClearFilters() {
    setFilters({
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "unlinked"
    });
  }
};

export default UnlinkedPayments;
