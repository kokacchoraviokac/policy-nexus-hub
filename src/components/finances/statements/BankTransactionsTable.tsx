
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, LinkIcon } from "lucide-react";
import { BankTransaction } from "@/types/finances";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BankTransactionsTableProps {
  transactions: BankTransaction[];
  isLoading: boolean;
  onMatchTransaction: (transactionId: string) => void;
  onIgnoreTransaction: (transactionId: string) => void;
  isMatching: boolean;
  isIgnoring: boolean;
  searchTerm: string;
  statusFilter: string;
}

const BankTransactionsTable: React.FC<BankTransactionsTableProps> = ({
  transactions,
  isLoading,
  onMatchTransaction,
  onIgnoreTransaction,
  isMatching,
  isIgnoring,
  searchTerm,
  statusFilter
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(transaction.amount).includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">{t("noTransactionsFound")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("adjustFiltersToSeeMore")}
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
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.reference || "-"}</TableCell>
              <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={
                  transaction.status === "unmatched" ? "secondary" : 
                  transaction.status === "matched" ? "default" : 
                  "outline"
                }>
                  {t(transaction.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {transaction.status === "unmatched" && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMatchTransaction(transaction.id)}
                      disabled={isMatching}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      {t("linkToPolicy")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onIgnoreTransaction(transaction.id)}
                      disabled={isIgnoring}
                    >
                      {t("ignore")}
                    </Button>
                  </div>
                )}
                {transaction.status === "matched" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate(`/policies/${transaction.matched_policy_id}`);
                    }}
                  >
                    {t("viewPolicy")}
                  </Button>
                )}
                {transaction.status === "ignored" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Reset to unmatched
                      // This would need to be implemented in the hook
                    }}
                  >
                    {t("resetStatus")}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BankTransactionsTable;
