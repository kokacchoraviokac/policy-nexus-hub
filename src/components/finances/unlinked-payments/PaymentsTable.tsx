
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link as LinkIcon, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnlinkedPaymentType } from "@/types/policies";
import EmptyPaymentsState from "./EmptyPaymentsState";

interface PaymentsTableProps {
  payments: UnlinkedPaymentType[];
  isLoading: boolean;
  onView: (payment: UnlinkedPaymentType) => void;
  onLink: (payment: UnlinkedPaymentType) => void;
  onClearFilters: () => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  isLoading,
  onView,
  onLink,
  onClearFilters
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">{t("loadingPayments")}</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (payments.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <EmptyPaymentsState onClearFilters={onClearFilters} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {payments.map((payment) => (
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
                onClick={() => onView(payment)}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">{t("view")}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onLink(payment)}
                disabled={!!payment.linked_policy_id}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                {payment.linked_policy_id ? t("linked") : t("link")}
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default PaymentsTable;
