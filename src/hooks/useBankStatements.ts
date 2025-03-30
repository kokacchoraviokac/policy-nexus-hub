
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { BankStatement } from "@/types/finances";

export interface BankStatementFilterOptions {
  searchTerm?: string;
  bankName?: string;
  status?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

export const useBankStatements = (filters: BankStatementFilterOptions = {}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchBankStatements = async () => {
    let query = supabase
      .from('bank_statements')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.searchTerm) {
      query = query.or(`account_number.ilike.%${filters.searchTerm}%,bank_name.ilike.%${filters.searchTerm}%`);
    }
    
    if (filters.bankName) {
      query = query.eq('bank_name', filters.bankName);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.dateFrom) {
      query = query.gte('statement_date', filters.dateFrom.toISOString().split('T')[0]);
    }
    
    if (filters.dateTo) {
      query = query.lte('statement_date', filters.dateTo.toISOString().split('T')[0]);
    }
    
    const { data, error, count } = await query
      .order('statement_date', { ascending: false });
    
    if (error) throw error;
    
    return {
      statements: data as BankStatement[],
      total: count || 0
    };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bank-statements', filters],
    queryFn: fetchBankStatements,
  });

  const processStatementMutation = useMutation({
    mutationFn: async (statementId: string) => {
      const { error } = await supabase
        .from('bank_statements')
        .update({
          status: 'processed',
          processed_by: (await supabase.auth.getUser()).data.user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', statementId);
      
      if (error) throw error;
      return { statementId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-statements'] });
      toast({
        title: t("statementProcessed"),
        description: t("statementProcessedSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error processing statement:', error);
      toast({
        title: t("errorProcessingStatement"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const confirmStatementMutation = useMutation({
    mutationFn: async (statementId: string) => {
      const { error } = await supabase
        .from('bank_statements')
        .update({
          status: 'confirmed'
        })
        .eq('id', statementId);
      
      if (error) throw error;
      return { statementId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-statements'] });
      toast({
        title: t("statementConfirmed"),
        description: t("statementConfirmedSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error confirming statement:', error);
      toast({
        title: t("errorConfirmingStatement"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    statements: data?.statements || [],
    totalCount: data?.total || 0,
    isLoading,
    isError,
    error,
    refetch,
    processStatement: processStatementMutation.mutate,
    isProcessing: processStatementMutation.isPending,
    confirmStatement: confirmStatementMutation.mutate,
    isConfirming: confirmStatementMutation.isPending
  };
};
