
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBankTransactions } from "@/hooks/useBankTransactions";
import { BankStatement } from "@/types/finances";

// Imported components
import BankStatementHeader from "@/components/finances/statements/BankStatementHeader";
import BankStatementDetailsCard from "@/components/finances/statements/BankStatementDetailsCard";
import BankTransactionsFilters from "@/components/finances/statements/BankTransactionsFilters";
import BankTransactionsTable from "@/components/finances/statements/BankTransactionsTable";

const BankStatementDetail = () => {
  const { statementId } = useParams<{ statementId: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // This is a mock for demonstration. In a real implementation, you'd fetch the statement details.
  const mockStatement: BankStatement = {
    id: statementId || "1",
    bank_name: "UniCredit",
    account_number: "170-123456789-01",
    statement_date: new Date().toISOString(),
    starting_balance: 10000,
    ending_balance: 12500,
    status: "processed",
    file_path: "/statements/statement1.pdf",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_id: "company1"
  };
  
  const { 
    transactions, 
    isLoading, 
    matchTransaction, 
    isMatching, 
    ignoreTransaction, 
    isIgnoring,
    resetStatus,
    isResetting
  } = useBankTransactions(statementId || "");
  
  const handleDownloadStatement = () => {
    // Mock download functionality
    toast({
      title: t("downloadStarted"),
      description: t("statementDownloadStarted"),
    });
  };
  
  const handleProcessStatement = () => {
    // In a real implementation, you'd call an API to process the statement
    toast({
      title: t("statementProcessed"),
      description: t("statementProcessedSuccess"),
    });
  };
  
  const handleConfirmStatement = () => {
    // In a real implementation, you'd call an API to confirm the statement
    toast({
      title: t("statementConfirmed"),
      description: t("statementConfirmedSuccess"),
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleMatchTransaction = (transactionId: string) => {
    // In a real implementation, you'd open a dialog to select a policy
    // For now, we'll just use a mock policy ID
    const mockPolicyId = "policy1";
    matchTransaction({ transactionId, policyId: mockPolicyId });
  };
  
  return (
    <div className="space-y-6">
      <BankStatementHeader 
        backLink="/finances/statements"
        statementStatus={mockStatement.status}
        onDownload={handleDownloadStatement}
        onProcess={handleProcessStatement}
        onConfirm={handleConfirmStatement}
      />
      
      <BankStatementDetailsCard 
        statement={mockStatement}
        transactionCount={transactions.length}
      />
      
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
            isLoading={isLoading}
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
    </div>
  );
};

export default BankStatementDetail;
