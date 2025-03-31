
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import * as XLSX from "xlsx";

export const usePayoutDetails = (payoutId: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  
  const companyId = user?.companyId;

  const fetchPayoutDetails = async () => {
    if (!companyId || !payoutId) {
      return null;
    }

    try {
      // Fetch payout details
      const { data: payoutData, error: payoutError } = await supabase
        .from("agent_payouts")
        .select(`
          *,
          agents(name)
        `)
        .eq("id", payoutId)
        .eq("company_id", companyId)
        .single();

      if (payoutError) throw payoutError;

      // Fetch payout items
      const { data: itemsData, error: itemsError } = await supabase
        .from("payout_items")
        .select(`
          *,
          policies(policy_number, policyholder_name)
        `)
        .eq("payout_id", payoutId);

      if (itemsError) throw itemsError;

      // Transform items data
      const transformedItems = itemsData.map(item => ({
        policy_id: item.policy_id,
        policy_number: item.policies?.policy_number || "Unknown",
        policyholder_name: item.policies?.policyholder_name || "Unknown",
        amount: item.amount
      }));

      // Return combined data
      return {
        ...payoutData,
        agent_name: payoutData.agents?.name || "Unknown",
        items: transformedItems
      };
    } catch (error) {
      console.error("Error fetching payout details:", error);
      toast({
        title: t("errorFetchingPayoutDetails"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['payout-details', payoutId, companyId],
    queryFn: fetchPayoutDetails,
    enabled: !!payoutId && !!companyId
  });

  // Export payout details to Excel
  const exportPayoutDetails = async (payoutId: string) => {
    if (!companyId || !payoutId) {
      toast({
        title: t("exportError"),
        description: t("invalidPayoutOrUser"),
        variant: "destructive",
      });
      return;
    }

    try {
      if (!data) {
        // Try to fetch data if not already loaded
        const payoutDetails = await fetchPayoutDetails();
        if (!payoutDetails) {
          throw new Error(t("payoutNotFound"));
        }
        
        // Create Excel from the fetched data
        exportToExcel(payoutDetails);
      } else {
        // Use already loaded data
        exportToExcel(data);
      }
    } catch (error) {
      console.error("Error exporting payout details:", error);
      toast({
        title: t("exportError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  // Helper function to create and download Excel
  const exportToExcel = (payoutDetails: any) => {
    // Create items worksheet
    const itemsData = payoutDetails.items.map((item: any) => ({
      [t("policyNumber")]: item.policy_number,
      [t("policyholder")]: item.policyholder_name,
      [t("amount")]: item.amount.toFixed(2)
    }));
    
    const itemsSheet = XLSX.utils.json_to_sheet(itemsData);
    
    // Create summary worksheet
    const summaryData = [{
      [t("agent")]: payoutDetails.agent_name,
      [t("periodStart")]: new Date(payoutDetails.period_start).toLocaleDateString(),
      [t("periodEnd")]: new Date(payoutDetails.period_end).toLocaleDateString(),
      [t("totalAmount")]: payoutDetails.total_amount.toFixed(2),
      [t("status")]: t(payoutDetails.status),
      [t("paymentDate")]: payoutDetails.payment_date ? new Date(payoutDetails.payment_date).toLocaleDateString() : "-",
      [t("paymentReference")]: payoutDetails.payment_reference || "-"
    }];
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    
    // Create workbook and add sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, t("summary"));
    XLSX.utils.book_append_sheet(workbook, itemsSheet, t("items"));
    
    // Save file
    const fileName = `${t("payoutDetails")}_${payoutDetails.agent_name}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: t("exportSuccess"),
      description: t("payoutDetailsExported"),
    });
  };

  return {
    payoutDetails: data,
    isLoading,
    isError,
    error,
    exportPayoutDetails
  };
};
