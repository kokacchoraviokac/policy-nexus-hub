
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useContext } from "react";

export const useCommissionMutations = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  
  // Get the current user's company_id
  const companyId = user?.companyId;

  const calculateCommissionMutation = useMutation({
    mutationFn: async ({ policyId, baseAmount, rate }: { 
      policyId: string; 
      baseAmount: number; 
      rate: number 
    }) => {
      // Calculate commission amount
      const calculatedAmount = (baseAmount * rate) / 100;
      
      if (!companyId) {
        throw new Error("No company ID available");
      }
      
      const { data, error } = await supabase
        .from('commissions')
        .insert({
          policy_id: policyId,
          base_amount: baseAmount,
          rate: rate,
          calculated_amount: calculatedAmount,
          status: 'due',
          company_id: companyId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast({
        title: t("commissionCalculated"),
        description: t("commissionCalculationSuccess"),
      });
    },
    onError: (error) => {
      console.error('Error calculating commission:', error);
      toast({
        title: t("errorCalculatingCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const updateCommissionStatusMutation = useMutation({
    mutationFn: async ({ commissionId, status, paymentDate, paidAmount }: { 
      commissionId: string; 
      status: string;
      paymentDate?: string;
      paidAmount?: number;
    }) => {
      const updateData: any = { status };
      
      if (status === 'paid' || status === 'partially_paid') {
        if (paymentDate) {
          updateData.payment_date = paymentDate;
        }
        
        if (paidAmount !== undefined) {
          updateData.paid_amount = paidAmount;
        }
      }
      
      const { data, error } = await supabase
        .from('commissions')
        .update(updateData)
        .eq('id', commissionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast({
        title: t("commissionUpdated"),
        description: t("commissionStatusUpdated"),
      });
    },
    onError: (error) => {
      console.error('Error updating commission status:', error);
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
    isUpdating: updateCommissionStatusMutation.isPending
  };
};
