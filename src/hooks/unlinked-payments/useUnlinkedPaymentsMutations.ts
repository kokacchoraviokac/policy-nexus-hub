
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useUnlinkedPaymentsMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  const linkPaymentMutation = useMutation({
    mutationFn: async ({ paymentId, policyId }: { paymentId: string, policyId: string }) => {
      // Get current timestamp and user
      const now = new Date().toISOString();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      // Update the unlinked payment with policy information
      const { error } = await supabase
        .from("unlinked_payments")
        .update({
          linked_policy_id: policyId,
          linked_by: userId,
          linked_at: now,
          status: "linked",
        })
        .eq("id", paymentId);

      if (error) throw error;
      return { paymentId, policyId };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["unlinked-payments"] });
      
      // Show success toast
      toast({
        title: t("paymentLinkSuccess"),
        description: t("paymentSuccessfullyLinked"),
      });
    },
    onError: (error) => {
      console.error("Error linking payment:", error);
      toast({
        title: t("errorLinkingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    linkPayment: linkPaymentMutation.mutate,
    isLinking: linkPaymentMutation.isPending,
  };
};
