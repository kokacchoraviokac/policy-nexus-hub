
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
  visibleColumns?: string[];
}

// Define an interface for the column data
interface ColumnData {
  header: string;
  render: (transaction: FinancialTransaction) => React.ReactNode;
  className?: string;
}

const FinancialReportTable: React.FC<FinancialReportTableProps> = ({
  data,
  isLoading,
  visibleColumns = ["date", "description", "type", "category", "reference", "status", "amount"]
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
  
  const columnMap: Record<string, ColumnData> = {
    date: { 
      header: t("date"), 
      render: (transaction: FinancialTransaction) => formatDate(new Date(transaction.date), language) 
    },
    description: { 
      header: t("description"), 
      render: (transaction: FinancialTransaction) => transaction.description 
    },
    type: { 
      header: t("type"), 
      render: (transaction: FinancialTransaction) => (
        <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'}>
          {t(transaction.type)}
        </Badge>
      )
    },
    category: { 
      header: t("category"), 
      render: (transaction: FinancialTransaction) => t(transaction.category) 
    },
    reference: { 
      header: t("reference"), 
      render: (transaction: FinancialTransaction) => transaction.reference || "-" 
    },
    status: { 
      header: t("status"), 
      render: (transaction: FinancialTransaction) => (
        <Badge variant={getStatusBadgeVariant(transaction.status)}>
          {t(transaction.status)}
        </Badge>
      )
    },
    amount: { 
      header: t("amount"), 
      render: (transaction: FinancialTransaction) => (
        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {transaction.type === 'income' ? '+' : '-'} 
          {formatCurrency(transaction.amount, language, transaction.currency)}
        </span>
      ),
      className: "text-right font-medium"
    }
  };
  
  const visibleColumnData = visibleColumns.map(col => columnMap[col as keyof typeof columnMap]);
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumnData.map((column, index) => (
              <TableHead 
                key={index} 
                className={column.className}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              {visibleColumnData.map((column, index) => (
                <TableCell 
                  key={index} 
                  className={column.className}
                >
                  {column.render(transaction)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinancialReportTable;
