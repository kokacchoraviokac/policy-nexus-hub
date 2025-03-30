
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";

interface CalculateCommissionParams {
  policy: Policy;
  baseAmount: number;
  rate: number;
  calculatedAmount: number;
}

interface UpdateCommissionStatusParams {
  commissionId: string;
  status: string;
  paidAmount?: number;
  paymentDate?: Date;
}

export const useCommissionMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  const calculateCommissionMutation = useMutation({
    mutationFn: async ({ policy, baseAmount, rate, calculatedAmount }: CalculateCommissionParams) => {
      // Insert a new commission record
      const { data, error } = await supabase
        .from("commissions")
        .insert({
          policy_id: policy.id,
          base_amount: baseAmount,
          rate: rate,
          calculated_amount: calculatedAmount,
          status: "due",
          company_id: policy.company_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries and show success toast
      queryClient.invalidateQueries({ queryKey: ["policy-commissions"] });
      toast({
        title: t("commissionCalculated"),
        description: t("commissionCalculationSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error calculating commission:", error);
      toast({
        title: t("errorCalculatingCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const updateCommissionStatusMutation = useMutation({
    mutationFn: async ({
      commissionId,
      status,
      paidAmount,
      paymentDate,
    }: UpdateCommissionStatusParams) => {
      // Build update object
      const updateData: any = { status };

      // Add optional fields if provided
      if (paidAmount !== undefined) {
        updateData.paid_amount = paidAmount;
      }

      if (paymentDate) {
        updateData.payment_date = paymentDate.toISOString().split("T")[0];
      }

      // Update the commission record
      const { error } = await supabase
        .from("commissions")
        .update(updateData)
        .eq("id", commissionId);

      if (error) throw error;
      return { commissionId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-commissions"] });
      toast({
        title: t("commissionUpdated"),
        description: t("commissionStatusUpdated"),
      });
    },
    onError: (error) => {
      console.error("Error updating commission status:", error);
      toast({
        title: t("errorUpdatingCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    calculateCommission: calculateCommissionMutation.mutate,
    isCalculating: calculateCommissionMutation.isPending,
    updateCommissionStatus: updateCommissionStatusMutation.mutate,
    isUpdatingStatus: updateCommissionStatusMutation.isPending,
  };
};
