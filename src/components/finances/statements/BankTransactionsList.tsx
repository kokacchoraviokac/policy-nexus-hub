
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BankTransaction } from "@/types/finances";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  CircleSlash,
  Loader2,
  RotateCcw,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface BankTransactionsListProps {
  transactions: BankTransaction[];
  isLoading: boolean;
  onMatch: (params: { transactionId: string; policyId: string }) => void;
  onIgnore: (transactionId: string) => void;
  onResetStatus: (transactionId: string) => void;
  isMatching: boolean;
  isIgnoring: boolean;
  isResetting: boolean;
  statementStatus?: string;
}

const BankTransactionsList: React.FC<BankTransactionsListProps> = ({
  transactions,
  isLoading,
  onMatch,
  onIgnore,
  onResetStatus,
  isMatching,
  isIgnoring,
  isResetting,
  statementStatus
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
  
  const isReadOnly = statementStatus === "confirmed";
  
  const handleMatchClick = (transaction: BankTransaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  
  const handlePolicySelect = (policyId: string) => {
    if (selectedTransaction) {
      onMatch({
        transactionId: selectedTransaction.id,
        policyId
      });
    }
    setDialogOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unmatched":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{t(status)}</Badge>;
      case "matched":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t(status)}</Badge>;
      case "ignored":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">{t(status)}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredTransactions = searchTerm
    ? transactions.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : transactions;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchTransactions")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noTransactionsFound")}</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("reference")}</TableHead>
                <TableHead>{t("amount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("matchedPolicy")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.reference || '-'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(transaction.amount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    {transaction.matched_policy_id ? (
                      <Link 
                        to={`/policies/${transaction.matched_policy_id}`}
                        className="text-primary hover:underline"
                      >
                        {t("viewPolicy")}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!isReadOnly && (
                      <div className="flex justify-end space-x-2">
                        {transaction.status === "unmatched" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMatchClick(transaction)}
                              disabled={isMatching}
                            >
                              {isMatching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onIgnore(transaction.id)}
                              disabled={isIgnoring}
                            >
                              {isIgnoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleSlash className="h-4 w-4" />}
                            </Button>
                          </>
                        )}
                        {(transaction.status === "matched" || transaction.status === "ignored") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onResetStatus(transaction.id)}
                            disabled={isResetting}
                          >
                            {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("matchTransactionToPolicy")}</DialogTitle>
            <DialogDescription>
              {t("searchAndSelectPolicy")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={t("searchPolicyByNumberOrPolicyholder")}
              className="mb-4"
            />
            
            <div className="border rounded-md divide-y">
              {/* This would be populated with policy search results */}
              <div className="p-3 hover:bg-muted cursor-pointer" onClick={() => handlePolicySelect("policy-1")}>
                <div className="font-medium">POL-12345</div>
                <div className="text-sm text-muted-foreground">John Doe - UniCredit</div>
              </div>
              <div className="p-3 hover:bg-muted cursor-pointer" onClick={() => handlePolicySelect("policy-2")}>
                <div className="font-medium">POL-67890</div>
                <div className="text-sm text-muted-foreground">Jane Smith - Raiffeisen</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankTransactionsList;
