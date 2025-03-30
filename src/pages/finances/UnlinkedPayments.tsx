
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Link as LinkIcon } from "lucide-react";
import { useUnlinkedPayments } from "@/hooks/useUnlinkedPayments";
import LinkPaymentDialog from "@/components/finances/unlinked-payments/LinkPaymentDialog";
import UnlinkedPaymentsFilters from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import { PaginationController } from "@/components/ui/pagination-controller";

const UnlinkedPayments = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  
  const {
    payments,
    totalCount,
    isLoading,
    filters,
    setFilters,
    pagination,
    setPagination,
    linkPayment,
    isLinking
  } = useUnlinkedPayments();
  
  const handleLinkPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setShowLinkDialog(true);
  };
  
  const handleConfirmLink = (policyId: string) => {
    if (selectedPaymentId) {
      linkPayment({ paymentId: selectedPaymentId, policyId });
      setShowLinkDialog(false);
      setSelectedPaymentId(null);
    }
  };
  
  const handleExport = () => {
    // Export logic would go here
    console.log("Exporting payments");
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
            onRefresh={() => console.log("Refreshing payments")}
          />
          
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reference")}</TableHead>
                  <TableHead>{t("payerName")}</TableHead>
                  <TableHead className="text-right">{t("amount")}</TableHead>
                  <TableHead>{t("paymentDate")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t("loadingPayments")}
                    </TableCell>
                  </TableRow>
                ) : payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.reference}
                      </TableCell>
                      <TableCell>{payment.payer_name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.amount, payment.currency || "EUR")}
                      </TableCell>
                      <TableCell>
                        {formatDate(payment.payment_date)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleLinkPayment(payment.id)}
                          disabled={!!payment.linked_policy_id}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          {payment.linked_policy_id ? t("linked") : t("link")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t("noPaymentsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalCount > 0 && (
            <div className="mt-4 flex justify-end">
              <PaginationController
                currentPage={pagination.pageIndex + 1}
                pageSize={pagination.pageSize}
                totalItems={totalCount}
                onPageChange={(page) => setPagination({ ...pagination, pageIndex: page - 1 })}
                onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <LinkPaymentDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        onConfirm={handleConfirmLink}
        isLoading={isLinking}
      />
    </div>
  );
};

export default UnlinkedPayments;
