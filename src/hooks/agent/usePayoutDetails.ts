
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
    if (!payoutId) {
      return null;
    }

    console.log("Using mock payout details data for:", payoutId);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check localStorage for finalized payouts first
    const storedPayouts = JSON.parse(localStorage.getItem('mockPayouts') || '[]');
    const storedPayout = storedPayouts.find((p: any) => p.id === payoutId);

    if (storedPayout) {
      // Return stored payout with mock items
      return {
        ...storedPayout,
        agent_name: storedPayout.agent_id === "agent-1" ? "John Anderson" :
                   storedPayout.agent_id === "agent-2" ? "Sarah Wilson" :
                   storedPayout.agent_id === "agent-3" ? "Michael Brown" : "Unknown Agent",
        items: [
          {
            policy_id: "pol-1",
            policy_number: "POL-2024-001",
            policyholder_name: "John Smith",
            amount: 187.50
          },
          {
            policy_id: "pol-2",
            policy_number: "POL-2024-002",
            policyholder_name: "Jane Doe",
            amount: 252.00
          }
        ]
      };
    }

    // Mock payout details for historical records
    const mockPayoutDetails = {
      "payout-1": {
        id: "payout-1",
        agent_id: "agent-1",
        agent_name: "John Anderson",
        period_start: "2024-01-01",
        period_end: "2024-01-31",
        total_amount: 1249.50,
        status: "paid",
        payment_date: "2024-02-05",
        payment_reference: "PAY-2024-001",
        calculated_by: "admin",
        company_id: "default-company",
        created_at: "2024-02-01T10:00:00Z",
        items: [
          {
            policy_id: "pol-1",
            policy_number: "POL-2024-001",
            policyholder_name: "John Smith",
            amount: 187.50
          },
          {
            policy_id: "pol-2",
            policy_number: "POL-2024-002",
            policyholder_name: "Jane Doe",
            amount: 252.00
          },
          {
            policy_id: "pol-3",
            policy_number: "POL-2024-003",
            policyholder_name: "Smith Industries Ltd",
            amount: 630.00
          },
          {
            policy_id: "pol-4",
            policy_number: "POL-2024-004",
            policyholder_name: "ABC Corporation",
            amount: 180.00
          }
        ]
      },
      "payout-2": {
        id: "payout-2",
        agent_id: "agent-2",
        agent_name: "Sarah Wilson",
        period_start: "2024-01-01",
        period_end: "2024-01-31",
        total_amount: 439.00,
        status: "pending",
        payment_date: null,
        payment_reference: null,
        calculated_by: "admin",
        company_id: "default-company",
        created_at: "2024-02-01T11:00:00Z",
        items: [
          {
            policy_id: "pol-5",
            policy_number: "POL-2024-005",
            policyholder_name: "Wilson Corp",
            amount: 219.00
          },
          {
            policy_id: "pol-6",
            policy_number: "POL-2024-006",
            policyholder_name: "Tech Solutions Inc",
            amount: 220.00
          }
        ]
      }
    };

    return mockPayoutDetails[payoutId as keyof typeof mockPayoutDetails] || null;
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
