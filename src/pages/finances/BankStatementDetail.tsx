
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useBankStatement } from "@/hooks/useBankStatement";

// Imported components
import BankStatementHeader from "@/components/finances/statements/BankStatementHeader";
import BankStatementDetailsCard from "@/components/finances/statements/BankStatementDetailsCard";
import TransactionsSection from "@/components/finances/statements/TransactionsSection";
import BankStatementLoadingState from "@/components/finances/statements/BankStatementLoadingState";
import BankStatementNotFound from "@/components/finances/statements/BankStatementNotFound";

const BankStatementDetail = () => {
  const { statementId } = useParams<{ statementId: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    statement, 
    isLoading: isLoadingStatement, 
    processStatement, 
    confirmStatement 
  } = useBankStatement(statementId);
  
  const handleDownloadStatement = () => {
    if (!statement || !statement.file_path) {
      toast({
        title: t("downloadError"),
        description: t("fileNotAvailable"),
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, you'd implement download logic here
    toast({
      title: t("downloadStarted"),
      description: t("statementDownloadStarted"),
    });
  };
  
  const handleProcessStatement = async () => {
    if (!statementId) return;
    try {
      await processStatement(statementId);
    } catch (error) {
      console.error("Error processing statement:", error);
    }
  };
  
  const handleConfirmStatement = async () => {
    if (!statementId) return;
    try {
      await confirmStatement(statementId);
    } catch (error) {
      console.error("Error confirming statement:", error);
    }
  };
  
  if (isLoadingStatement) {
    return <BankStatementLoadingState />;
  }
  
  if (!statement) {
    return <BankStatementNotFound />;
  }
  
  return (
    <div className="space-y-6">
      <BankStatementHeader 
        backLink="/finances/statements"
        statementStatus={statement.status}
        onDownload={handleDownloadStatement}
        onProcess={handleProcessStatement}
        onConfirm={handleConfirmStatement}
        isProcessing={false}
        isConfirming={false}
      />
      
      <BankStatementDetailsCard 
        statement={statement}
        transactionCount={0} // This will be populated by the TransactionsSection
      />
      
      {statementId && <TransactionsSection statementId={statementId} />}
    </div>
  );
};

export default BankStatementDetail;
