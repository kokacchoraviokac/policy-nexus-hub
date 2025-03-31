
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useAgents } from "../agents/useAgents";

interface PayoutPreviewParams {
  agentId: string;
  periodStart: string;
  periodEnd: string;
}

interface PayoutItem {
  policy_id: string;
  policy_number: string;
  policyholder_name: string;
  amount: number;
}

interface PayoutPreviewData {
  totalAmount: number;
  items: PayoutItem[];
}

interface FinalizePayoutsParams extends PayoutPreviewParams {
  items: PayoutItem[];
}

export const useCalculatePayouts = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { agents } = useAgents();
  
  const [payoutPreviewData, setPayoutPreviewData] = useState<PayoutPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const companyId = user?.companyId;

  // Calculate payout preview mutation
  const calculatePreviewMutation = useMutation({
    mutationFn: async (params: PayoutPreviewParams) => {
      if (!companyId) {
        throw new Error("User not authenticated");
      }

      setIsLoading(true);
      
      try {
        // This would be a more sophisticated calculation in a real app
        // For now, we'll simulate it by retrieving policies with commission data for the agent
        const { data: policyData, error: policyError } = await supabase
          .from("policies")
          .select(`
            id,
            policy_number,
            policyholder_name,
            premium,
            commission_percentage
          `)
          .eq("company_id", companyId)
          .eq("assigned_to", params.agentId)
          .gte("start_date", params.periodStart)
          .lte("start_date", params.periodEnd);

        if (policyError) throw policyError;
        
        // Check for manual commission overrides
        const { data: manualCommissions, error: manualError } = await supabase
          .from("manual_commissions")
          .select("policy_id, rate")
          .eq("agent_id", params.agentId);
          
        if (manualError) throw manualError;
        
        // Create a map of policy_id to manual commission rate
        const manualRates = manualCommissions.reduce((acc: Record<string, number>, curr) => {
          acc[curr.policy_id] = curr.rate;
          return acc;
        }, {});
        
        // Calculate amounts for each policy
        const items = policyData.map((policy) => {
          const rate = manualRates[policy.id] || policy.commission_percentage || 0;
          const amount = (policy.premium * rate) / 100;
          
          return {
            policy_id: policy.id,
            policy_number: policy.policy_number,
            policyholder_name: policy.policyholder_name,
            amount
          };
        });
        
        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        
        return { totalAmount, items };
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      setPayoutPreviewData(data);
      toast({
        title: t("payoutCalculated"),
        description: t("payoutCalculationComplete"),
      });
    },
    onError: (error) => {
      console.error("Error calculating payout:", error);
      toast({
        title: t("errorCalculatingPayout"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Finalize payout mutation
  const finalizePayoutMutation = useMutation({
    mutationFn: async (params: FinalizePayoutsParams) => {
      if (!companyId || !user?.id) {
        throw new Error("User not authenticated");
      }

      // Create the agent payout record
      const { data: payoutData, error: payoutError } = await supabase
        .from("agent_payouts")
        .insert({
          agent_id: params.agentId,
          period_start: params.periodStart,
          period_end: params.periodEnd,
          total_amount: params.items.reduce((sum, item) => sum + item.amount, 0),
          status: "pending",
          calculated_by: user.id,
          company_id: companyId
        })
        .select()
        .single();

      if (payoutError) throw payoutError;
      
      // Create payout items for each policy
      const payoutItems = params.items.map(item => ({
        payout_id: payoutData.id,
        policy_id: item.policy_id,
        amount: item.amount,
        company_id: companyId
      }));
      
      const { error: itemsError } = await supabase
        .from("payout_items")
        .insert(payoutItems);
        
      if (itemsError) throw itemsError;
      
      return payoutData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-payouts'] });
      toast({
        title: t("payoutFinalized"),
        description: t("payoutFinalizedSuccess"),
      });
      setPayoutPreviewData(null); // Clear preview data after finalization
    },
    onError: (error) => {
      console.error("Error finalizing payout:", error);
      toast({
        title: t("errorFinalizingPayout"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  return {
    agents,
    calculatePayoutPreview: calculatePreviewMutation.mutate,
    isCalculating: calculatePreviewMutation.isPending,
    payoutPreviewData,
    isLoading,
    finalizePayouts: finalizePayoutMutation.mutate,
    isFinalizing: finalizePayoutMutation.isPending
  };
};
