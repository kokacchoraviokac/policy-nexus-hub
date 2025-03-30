
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
import { FinancialTransaction } from "@/utils/reports/financialReportUtils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface FinancialReportTableProps {
  data: FinancialTransaction[];
  isLoading: boolean;
}

const FinancialReportTable: React.FC<FinancialReportTableProps> = ({
  data,
  isLoading
}) => {
  const { t, language } = useLanguage();
  
  // Update this function to return valid badge variants
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary';  // Instead of 'success'
      case 'paid':
        return 'secondary';  // Instead of 'success'
      case 'pending':
        return 'outline';    // Instead of 'warning'
      default:
        return 'outline';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <h3 className="text-lg font-medium">{t("noDataFound")}</h3>
        <p className="text-muted-foreground mt-2">{t("tryAdjustingYourFilters")}</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("category")}</TableHead>
            <TableHead>{t("reference")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {formatDate(new Date(transaction.date), language)}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'}>
                  {t(transaction.type)}
                </Badge>
              </TableCell>
              <TableCell>{t(transaction.category)}</TableCell>
              <TableCell>{transaction.reference || "-"}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {t(transaction.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'income' ? '+' : '-'} 
                  {formatCurrency(transaction.amount, language, transaction.currency)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinancialReportTable;
