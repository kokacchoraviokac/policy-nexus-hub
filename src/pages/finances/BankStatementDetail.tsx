import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileDown, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/utils/format";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BankStatement, BankTransaction } from "@/types/finances";

const BankStatementDetail = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { statementId } = useParams<{ statementId: string }>();
  const navigate = useNavigate();
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { data: statement, isLoading, isError, refetch } = useQuery({
    queryKey: ['bank-statement', statementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_statements')
        .select('*')
        .eq('id', statementId)
        .single();
      
      if (error) throw error;
      return data as BankStatement;
    },
  });
  
  const { data: transactions, isLoading: isTransactionsLoading, isError: isTransactionsError } = useQuery({
    queryKey: ['bank-transactions', statementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .eq('statement_id', statementId)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as BankTransaction[];
    },
    enabled: !!statementId,
  });
  
  const updateStatement = async (id: string, updates: Partial<BankStatement>) => {
    const { error } = await supabase
      .from('bank_statements')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  };
  
  const handleDownloadStatement = async () => {
    if (!statement?.file_path) {
      toast({
        title: t("downloadFailed"),
        description: t("statementPathMissing"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      const { data, error } = await supabase.storage
        .from('bank-statements')
        .download(statement.file_path);
        
      if (error) throw error;
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `statement-${statement.statement_date}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      toast({
        title: t("downloadStarted"),
        description: t("statementDownloadStarted")
      });
      
    } catch (error) {
      console.error("Statement download error:", error);
      toast({
        title: t("downloadFailed"),
        description: error instanceof Error ? error.message : t("errorOccurred"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleProcessStatement = async () => {
    try {
      const newStatus = "processed" as const; // Use a const assertion to fix the type
      await updateStatement(statement.id, { status: newStatus });
      await refetch();
      toast({
        title: t("statementProcessed"),
        description: t("statementProcessedSuccess")
      });
    } catch (error) {
      console.error("Error processing statement:", error);
      toast({
        title: t("errorProcessingStatement"),
        description: String(error),
        variant: "destructive"
      });
    }
  };
  
  const handleConfirmStatement = async () => {
    try {
      const newStatus = "confirmed" as const; // Use a const assertion to fix the type
      await updateStatement(statement.id, { status: newStatus });
      await refetch();
      toast({
        title: t("statementConfirmed"),
        description: t("statementConfirmedSuccess")
      });
    } catch (error) {
      console.error("Error confirming statement:", error);
      toast({
        title: t("errorConfirmingStatement"),
        description: String(error),
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case 'in_progress':
        variant = "secondary";
        break;
      case 'processed':
        variant = "default";
        break;
      case 'confirmed':
        variant = "outline";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {t(status)}
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/finances/statements"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Skeleton className="h-8 w-48" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError || !statement) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/finances/statements"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{t("statementNotFound")}</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("statementNotFound")}</h2>
            <p className="text-muted-foreground mb-6">{t("statementNotFoundDescription")}</p>
            <Button asChild>
              <Link to="/finances/statements">{t("backToStatements")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/finances/statements"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("bankStatement")} - {formatDate(new Date(statement.statement_date))}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleDownloadStatement}
            disabled={isDownloading}
          >
            <FileDown className="h-4 w-4 mr-2" />
            {isDownloading ? t("downloading") : t("downloadStatement")}
          </Button>
          
          {statement.status === 'in_progress' && (
            <Button 
              size="sm"
              onClick={handleProcessStatement}
            >
              {t("processStatement")}
            </Button>
          )}
          
          {statement.status === 'processed' && (
            <Button 
              size="sm"
              onClick={handleConfirmStatement}
            >
              {t("confirmStatement")}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t("statementDetails")}</CardTitle>
              <CardDescription>
                {t("statementFrom")} {formatDate(new Date(statement.statement_date))}
              </CardDescription>
            </div>
            <div>{getStatusBadge(statement.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("bankName")}
              </h3>
              <p className="font-medium">{statement.bank_name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("accountNumber")}
              </h3>
              <p>{statement.account_number}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("startingBalance")}
              </h3>
              <p>{formatCurrency(statement.starting_balance, 'EUR')}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("endingBalance")}
              </h3>
              <p>{formatCurrency(statement.ending_balance, 'EUR')}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("status")}
              </h3>
              <p>{t(statement.status)}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">{t("transactions")}</h3>
            <div className="border rounded-md">
              <div className="grid grid-cols-12 p-3 bg-muted/50 text-sm font-medium">
                <div className="col-span-3">{t("transactionDate")}</div>
                <div className="col-span-6">{t("description")}</div>
                <div className="col-span-3 text-right">{t("amount")}</div>
              </div>
              <Separator />
              
              {isTransactionsLoading ? (
                <div className="p-4">
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : isTransactionsError ? (
                <div className="p-4 text-muted-foreground">
                  {t("errorLoadingTransactions")}
                </div>
              ) : (
                transactions?.map((transaction, index) => (
                  <React.Fragment key={transaction.id || index}>
                    <div className="grid grid-cols-12 p-3 text-sm">
                      <div className="col-span-3">
                        {formatDate(new Date(transaction.transaction_date))}
                      </div>
                      <div className="col-span-6">{transaction.description}</div>
                      <div className="col-span-3 text-right">
                        {formatCurrency(transaction.amount, 'EUR')}
                      </div>
                    </div>
                    {index < (transactions?.length || 0) - 1 && <Separator />}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankStatementDetail;
