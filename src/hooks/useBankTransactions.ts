
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { BankTransaction } from "@/types/finances";

export const useBankTransactions = (statementId: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('bank_transactions')
      .select('*')
      .eq('statement_id', statementId)
      .order('transaction_date', { ascending: false });
    
    if (error) throw error;
    
    return data as BankTransaction[];
  };

  const { data: transactions, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bank-transactions', statementId],
    queryFn: fetchTransactions,
    enabled: !!statementId,
  });

  const matchTransactionMutation = useMutation({
    mutationFn: async ({ 
      transactionId, 
      policyId 
    }: { 
      transactionId: string; 
      policyId: string 
    }) => {
      const { error } = await supabase
        .from('bank_transactions')
        .update({
          matched_policy_id: policyId,
          status: 'matched',
          matched_at: new Date().toISOString(),
          matched_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', transactionId);
      
      if (error) throw error;
      return { transactionId, policyId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-transactions', statementId] });
      toast({
        title: t("transactionMatched"),
        description: t("transactionMatchedSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error matching transaction:', error);
      toast({
        title: t("errorMatchingTransaction"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const ignoreTransactionMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from('bank_transactions')
        .update({
          status: 'ignored'
        })
        .eq('id', transactionId);
      
      if (error) throw error;
      return { transactionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-transactions', statementId] });
      toast({
        title: t("transactionIgnored"),
        description: t("transactionIgnoredSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error ignoring transaction:', error);
      toast({
        title: t("errorIgnoringTransaction"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    transactions: transactions || [],
    isLoading,
    isError,
    error,
    refetch,
    matchTransaction: matchTransactionMutation.mutate,
    isMatching: matchTransactionMutation.isPending,
    ignoreTransaction: ignoreTransactionMutation.mutate,
    isIgnoring: ignoreTransactionMutation.isPending
  };
};
