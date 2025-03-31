
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const usePolicyPayments = (policyId: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    data: payments,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['policy-payments', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unlinked_payments')
        .select('*')
        .eq('linked_policy_id', policyId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!policyId
  });
  
  const {
    data: policyFinancials,
    isLoading: isFinancialsLoading
  } = useQuery({
    queryKey: ['policy-financials', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select('premium, currency')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!policyId
  });
  
  const unlinkPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('unlinked_payments')
        .update({ 
          linked_policy_id: null,
          linked_at: null,
          linked_by: null,
          status: 'unlinked'
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      return paymentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-payments', policyId] });
      toast({
        title: t("paymentUnlinked"),
        description: t("paymentUnlinkedSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error unlinking payment:', error);
      toast({
        title: t("paymentUnlinkError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });
  
  const getPaymentSummary = () => {
    const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const premium = policyFinancials?.premium || 0;
    
    const paymentPercentage = premium > 0 ? Math.min(100, (totalPaid / premium) * 100) : 0;
    const isFullyPaid = totalPaid >= premium;
    const isOverpaid = totalPaid > premium;
    
    return {
      totalPaid,
      totalDue: premium,
      paymentPercentage,
      isFullyPaid,
      isOverpaid,
      currency: policyFinancials?.currency || 'EUR'
    };
  };
  
  return {
    payments,
    isLoading: isLoading || isFinancialsLoading,
    isError,
    error,
    refetch,
    unlinkPayment: unlinkPaymentMutation.mutate,
    isUnlinkingPayment: unlinkPaymentMutation.isPending,
    getPaymentSummary,
    paymentCount: payments?.length || 0
  };
};
