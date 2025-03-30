
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Link as LinkIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnlinkedPayments } from "@/hooks/useUnlinkedPayments";
import LinkPaymentDialog from "@/components/policies/unlinked-payments/LinkPaymentDialog";
import UnlinkedPaymentsFilters from "@/components/policies/unlinked-payments/UnlinkedPaymentsFilters";

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
  
  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };
  
  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    setFilters(prev => ({ 
      ...prev, 
      startDate: range.from,
      endDate: range.to
    }));
  };
  
  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
  };
  
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
            searchTerm={filters.searchTerm || ""}
            onSearchChange={handleSearch}
            dateRange={{ from: filters.startDate, to: filters.endDate }}
            onDateRangeChange={handleDateRangeChange}
            status={filters.status || "unlinked"}
            onStatusChange={handleStatusChange}
          />
          
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reference")}</TableHead>
                  <TableHead>{t("payerName")}</TableHead>
                  <TableHead className="text-right">{t("baseAmount")}</TableHead>
                  <TableHead className="text-center">{t("commissionRate")}</TableHead>
                  <TableHead className="text-right">{t("paymentAmount")}</TableHead>
                  <TableHead>{t("paymentDate")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
                        {formatCurrency(payment.base_amount, "EUR")}
                      </TableCell>
                      <TableCell className="text-center">
                        {payment.commission_rate}%
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.payment_amount, "EUR")}
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      {t("noPaymentsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <LinkPaymentDialog
        open={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onConfirm={handleConfirmLink}
        isLoading={isLinking}
      />
    </div>
  );
};

export default UnlinkedPayments;
