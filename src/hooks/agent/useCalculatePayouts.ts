
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
      console.log("Calculating payout preview with mock data:", params);
      
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock commission data for the selected agent
        const mockCommissionData = [
          {
            policy_id: "pol-1",
            policy_number: "POL-2024-001",
            policyholder_name: "John Smith",
            premium: 1250.00,
            commission_percentage: 15,
            amount: 187.50
          },
          {
            policy_id: "pol-2",
            policy_number: "POL-2024-002",
            policyholder_name: "Jane Doe",
            premium: 2100.00,
            commission_percentage: 12,
            amount: 252.00
          },
          {
            policy_id: "pol-3",
            policy_number: "POL-2024-003",
            policyholder_name: "Smith Industries Ltd",
            premium: 3500.00,
            commission_percentage: 18,
            amount: 630.00
          },
          {
            policy_id: "pol-4",
            policy_number: "POL-2024-004",
            policyholder_name: "ABC Corporation",
            premium: 1800.00,
            commission_percentage: 10,
            amount: 180.00
          }
        ];
        
        // Filter data based on selected agent (different agents get different data)
        const agentSpecificData = params.agentId === "agent-1" ? mockCommissionData :
                                 params.agentId === "agent-2" ? mockCommissionData.slice(0, 2) :
                                 mockCommissionData.slice(0, 3);
        
        const items = agentSpecificData.map(data => ({
          policy_id: data.policy_id,
          policy_number: data.policy_number,
          policyholder_name: data.policyholder_name,
          amount: data.amount
        }));
        
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        
        console.log("Mock payout calculation result:", { totalAmount, items });
        
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
      console.log("Finalizing payout with mock data:", params);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalAmount = params.items.reduce((sum, item) => sum + item.amount, 0);
      
      // Mock payout record
      const mockPayoutData = {
        id: `payout-${Date.now()}`,
        agent_id: params.agentId,
        period_start: params.periodStart,
        period_end: params.periodEnd,
        total_amount: totalAmount,
        status: "pending",
        calculated_by: user?.id || "mock-user",
        company_id: companyId || "default-company",
        created_at: new Date().toISOString(),
        payment_date: null,
        payment_reference: null
      };
      
      console.log("Mock payout finalized:", mockPayoutData);
      
      // Store in localStorage for persistence in mock environment
      const existingPayouts = JSON.parse(localStorage.getItem('mockPayouts') || '[]');
      existingPayouts.push(mockPayoutData);
      localStorage.setItem('mockPayouts', JSON.stringify(existingPayouts));
      
      return mockPayoutData;
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
