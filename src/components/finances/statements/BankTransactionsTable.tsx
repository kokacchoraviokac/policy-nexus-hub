
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
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";
import { BankTransaction } from "@/types/finances";
import BankTransactionActions from "./BankTransactionActions";

interface BankTransactionsTableProps {
  transactions: BankTransaction[];
  isLoading: boolean;
  onMatchTransaction: (transactionId: string) => void;
  onIgnoreTransaction: (transactionId: string) => void;
  onResetStatus: (transactionId: string) => void;
  isMatching: boolean;
  isIgnoring: boolean;
  isResetting: boolean;
  searchTerm: string;
  statusFilter: string;
}

const BankTransactionsTable: React.FC<BankTransactionsTableProps> = ({
  transactions,
  isLoading,
  onMatchTransaction,
  onIgnoreTransaction,
  onResetStatus,
  isMatching,
  isIgnoring,
  isResetting,
  searchTerm,
  statusFilter
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();

  // Filter transactions based on search term and status filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filteredTransactions.length) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">{t("noTransactionsFound")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {searchTerm || statusFilter !== 'all' 
            ? t("noTransactionsMatchFilters") 
            : t("noTransactionsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("reference")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
              <TableCell className="max-w-xs truncate" title={transaction.description}>
                {transaction.description}
              </TableCell>
              <TableCell>{transaction.reference || "-"}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    transaction.status === 'matched' 
                      ? 'default' 
                      : transaction.status === 'ignored' 
                        ? 'outline' 
                        : 'secondary'
                  }
                >
                  {t(transaction.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <BankTransactionActions 
                  transaction={transaction}
                  onMatch={() => onMatchTransaction(transaction.id)}
                  onIgnore={() => onIgnoreTransaction(transaction.id)}
                  onReset={() => onResetStatus(transaction.id)}
                  isMatching={isMatching}
                  isIgnoring={isIgnoring}
                  isResetting={isResetting}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BankTransactionsTable;
