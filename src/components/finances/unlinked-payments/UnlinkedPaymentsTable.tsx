
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, Loader2 } from "lucide-react";
import { UnlinkedPaymentType } from "@/types/finances";

interface UnlinkedPaymentsTableProps {
  payments: UnlinkedPaymentType[];
  isLoading: boolean;
  onLinkPayment?: (payment: UnlinkedPaymentType) => void;
  isLinking?: boolean;
  linkingPaymentId?: string;
  onRefresh?: () => void;
}

export const UnlinkedPaymentsTable: React.FC<UnlinkedPaymentsTableProps> = ({
  payments,
  isLoading,
  onLinkPayment,
  isLinking,
  linkingPaymentId,
  onRefresh
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">{t("loadingPayments")}</span>
      </div>
    );
  }
  
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("noPaymentsFound")}</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("reference")}</TableHead>
          <TableHead>{t("payerName")}</TableHead>
          <TableHead>{t("amount")}</TableHead>
          <TableHead>{t("paymentDate")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.reference || "-"}</TableCell>
            <TableCell>{payment.payer_name || "-"}</TableCell>
            <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
            <TableCell>{formatDate(payment.payment_date)}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                payment.status === "linked" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}>
                {t(payment.status)}
              </span>
            </TableCell>
            <TableCell>
              {payment.status === "unlinked" && onLinkPayment ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLinkPayment(payment)}
                  disabled={isLinking && linkingPaymentId === payment.id}
                >
                  {isLinking && linkingPaymentId === payment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Link className="h-4 w-4 mr-2" />
                  )}
                  {t("link")}
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">{t("linked")}</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UnlinkedPaymentsTable;
