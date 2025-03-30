
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useUnlinkedPaymentsMutations = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const linkPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, policyId }: { paymentId: string; policyId: string }) => {
      const { error } = await supabase
        .from('unlinked_payments')
        .update({
          linked_policy_id: policyId,
          linked_at: new Date().toISOString(),
          linked_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'linked'
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      return { paymentId, policyId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlinked-payments'] });
      toast({
        title: t("paymentLinkSuccess"),
        description: t("paymentSuccessfullyLinked"),
      });
    },
    onError: (error) => {
      console.error('Error linking payment:', error);
      toast({
        title: t("errorLinkingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    linkPayment: linkPaymentMutation.mutate,
    isLinking: linkPaymentMutation.isPending
  };
};
