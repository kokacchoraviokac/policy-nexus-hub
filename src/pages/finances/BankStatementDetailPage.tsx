
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankStatement } from "@/hooks/useBankStatement";
import BankStatementDetails from "@/components/finances/statements/BankStatementDetails";
import BankTransactionsList from "@/components/finances/statements/BankTransactionsList";
import { useBankTransactions } from "@/hooks/useBankTransactions";
import { Skeleton } from "@/components/ui/skeleton";

const BankStatementDetailPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { statementId } = useParams<{ statementId: string }>();
  
  const { 
    statement, 
    isLoading: isStatementLoading, 
    processStatement, 
    confirmStatement 
  } = useBankStatement(statementId);
  
  const {
    transactions,
    isLoading: isTransactionsLoading,
    matchTransaction,
    ignoreTransaction,
    resetStatus,
    isMatching,
    isIgnoring,
    isResetting
  } = useBankTransactions(statementId || '');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/finances/statements")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("backToStatements")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isStatementLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              `${t("statement")}: ${statement?.bank_name} (${new Date(statement?.statement_date || '').toLocaleDateString()})`
            )}
          </h1>
          <p className="text-muted-foreground">
            {t("statementDetails")}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("statementDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isStatementLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <BankStatementDetails 
                  statement={statement}
                  onProcess={() => statementId && processStatement(statementId)}
                  onConfirm={() => statementId && confirmStatement(statementId)}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("transactions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <BankTransactionsList 
                transactions={transactions}
                isLoading={isTransactionsLoading}
                onMatch={matchTransaction}
                onIgnore={ignoreTransaction}
                onResetStatus={resetStatus}
                isMatching={isMatching}
                isIgnoring={isIgnoring}
                isResetting={isResetting}
                statementStatus={statement?.status}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BankStatementDetailPage;
