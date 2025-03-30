
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { BankStatement } from "@/types/finances";

export const useBankStatement = (statementId: string | undefined) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [statement, setStatement] = useState<BankStatement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStatement = async () => {
      if (!statementId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bank_statements')
          .select('*')
          .eq('id', statementId)
          .single();
        
        if (error) throw error;
        
        // Ensure we're setting a valid BankStatement object with the correct status type
        const validStatus = data.status as "in_progress" | "processed" | "confirmed";
        setStatement({
          ...data,
          status: validStatus
        });
      } catch (error) {
        console.error('Error fetching statement:', error);
        toast({
          title: t("errorFetchingStatement"),
          description: t("errorFetchingStatementDetails"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatement();
  }, [statementId, toast, t]);
  
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
      
      // Update local state
      if (statement) {
        setStatement({ ...statement, status: 'processed' });
      }
      
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
      
      // Update local state
      if (statement) {
        setStatement({ ...statement, status: 'confirmed' });
      }
      
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

  return { 
    statement, 
    isLoading, 
    processStatement, 
    confirmStatement 
  };
};
