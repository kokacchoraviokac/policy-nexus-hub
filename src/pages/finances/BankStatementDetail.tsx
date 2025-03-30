
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBankTransactions } from "@/hooks/useBankTransactions";
import { supabase } from "@/integrations/supabase/client";
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
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [statement, setStatement] = useState<BankStatement | null>(null);
  const [isLoadingStatement, setIsLoadingStatement] = useState(true);
  
  useEffect(() => {
    const fetchStatement = async () => {
      if (!statementId) return;
      
      try {
        setIsLoadingStatement(true);
        const { data, error } = await supabase
          .from('bank_statements')
          .select('*')
          .eq('id', statementId)
          .single();
        
        if (error) throw error;
        
        setStatement(data);
      } catch (error) {
        console.error('Error fetching statement:', error);
        toast({
          title: t("errorFetchingStatement"),
          description: t("errorFetchingStatementDetails"),
          variant: "destructive",
        });
      } finally {
        setIsLoadingStatement(false);
      }
    };
    
    fetchStatement();
  }, [statementId, toast, t]);
  
  const { 
    transactions, 
    isLoading: isLoadingTransactions, 
    matchTransaction, 
    isMatching, 
    ignoreTransaction, 
    isIgnoring,
    resetStatus,
    isResetting,
    refetch: refetchTransactions
  } = useBankTransactions(statementId || "");
  
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
      setStatement(prev => prev ? { ...prev, status: 'processed' } : null);
    } catch (error) {
      console.error("Error processing statement:", error);
    }
  };
  
  const handleConfirmStatement = async () => {
    if (!statementId) return;
    
    try {
      await confirmStatement(statementId);
      setStatement(prev => prev ? { ...prev, status: 'confirmed' } : null);
    } catch (error) {
      console.error("Error confirming statement:", error);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const processStatement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bank_statements')
        .update({
          status: 'processed',
          processed_by: (await supabase.auth.getUser()).data.user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: t("statementProcessed"),
        description: t("statementProcessedSuccess"),
      });
      
      return true;
    } catch (error) {
      console.error('Error processing statement:', error);
      toast({
        title: t("errorProcessingStatement"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const confirmStatement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bank_statements')
        .update({
          status: 'confirmed'
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: t("statementConfirmed"),
        description: t("statementConfirmedSuccess"),
      });
      
      return true;
    } catch (error) {
      console.error('Error confirming statement:', error);
      toast({
        title: t("errorConfirmingStatement"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };
  
  if (isLoadingStatement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-40 bg-muted rounded animate-pulse" />
        <div className="h-60 bg-muted rounded animate-pulse" />
      </div>
    );
  }
  
  if (!statement) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/finances/statements")}
        >
          {t("backToStatements")}
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-2">{t("statementNotFound")}</h2>
            <p className="text-muted-foreground mb-4">{t("statementNotFoundDescription")}</p>
            <Button onClick={() => navigate("/finances/statements")}>
              {t("backToStatements")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
        transactionCount={transactions.length}
        isLoading={isLoadingTransactions}
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
            isLoading={isLoadingTransactions}
            onMatchTransaction={matchTransaction}
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
