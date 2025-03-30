
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBankTransactions } from "@/hooks/useBankTransactions";
import BankTransactionsFilters from "./BankTransactionsFilters";
import BankTransactionsTable from "./BankTransactionsTable";

interface TransactionsSectionProps {
  statementId: string;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ statementId }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { 
    transactions, 
    isLoading: isLoadingTransactions, 
    matchTransaction, 
    isMatching, 
    ignoreTransaction, 
    isIgnoring,
    resetStatus,
    isResetting
  } = useBankTransactions(statementId);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  // Helper function to handle matching transactions with proper parameter forwarding
  const handleMatchTransaction = (transactionId: string, policyId: string) => {
    matchTransaction({ transactionId, policyId });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t("transactions")}</CardTitle>
      </CardHeader>
      <CardContent>
        <BankTransactionsFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
        
        <BankTransactionsTable 
          transactions={transactions}
          isLoading={isLoadingTransactions}
          onMatchTransaction={handleMatchTransaction}
          onIgnoreTransaction={ignoreTransaction}
          onResetStatus={resetStatus}
          isMatching={isMatching}
          isIgnoring={isIgnoring}
          isResetting={isResetting}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionsSection;
