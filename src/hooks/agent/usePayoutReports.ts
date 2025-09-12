
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import * as XLSX from "xlsx";

export const usePayoutReports = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const companyId = user?.companyId;

  const fetchPayouts = async () => {
    console.log("Using mock payout reports data for testing");
    
    // Get stored payouts from localStorage (from finalized payouts)
    const storedPayouts = JSON.parse(localStorage.getItem('mockPayouts') || '[]');
    
    // Create comprehensive mock payout history
    const mockPayouts = [
      {
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
        created_at: "2024-02-01T10:00:00Z"
      },
      {
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
        created_at: "2024-02-01T11:00:00Z"
      },
      {
        id: "payout-3",
        agent_id: "agent-1",
        agent_name: "John Anderson",
        period_start: "2024-02-01",
        period_end: "2024-02-29",
        total_amount: 1069.50,
        status: "pending",
        payment_date: null,
        payment_reference: null,
        calculated_by: "admin",
        company_id: "default-company",
        created_at: "2024-03-01T09:00:00Z"
      },
      ...storedPayouts.map(payout => ({
        ...payout,
        agent_name: payout.agent_id === "agent-1" ? "John Anderson" :
                   payout.agent_id === "agent-2" ? "Sarah Wilson" :
                   payout.agent_id === "agent-3" ? "Michael Brown" : "Unknown Agent"
      }))
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Apply pagination
    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize;
    const paginatedData = mockPayouts.slice(from, to);

    return {
      data: paginatedData,
      totalCount: mockPayouts.length
    };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['payouts', pagination, companyId],
    queryFn: fetchPayouts,
  });

  // Export payouts to Excel
  const exportPayoutReport = async () => {
    if (!companyId) {
      toast({
        title: t("exportError"),
        description: t("userNotAuthenticated"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch all payouts without pagination
      const { data, error } = await supabase
        .from("agent_payouts")
        .select(`
          *,
          agents(name)
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data for export
      const exportData = data.map((payout) => ({
        [t("agent")]: payout.agents?.name || "Unknown",
        [t("periodStart")]: new Date(payout.period_start).toLocaleDateString(),
        [t("periodEnd")]: new Date(payout.period_end).toLocaleDateString(),
        [t("totalAmount")]: payout.total_amount,
        [t("status")]: t(payout.status),
        [t("paymentDate")]: payout.payment_date ? new Date(payout.payment_date).toLocaleDateString() : "-",
        [t("paymentReference")]: payout.payment_reference || "-",
        [t("createdAt")]: new Date(payout.created_at).toLocaleDateString()
      }));

      // Create workbook and add data
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, t("payoutReport"));

      // Save file
      XLSX.writeFile(workbook, `${t("payoutReport")}_${new Date().toISOString().split("T")[0]}.xlsx`);

      toast({
        title: t("exportSuccess"),
        description: t("payoutReportExported"),
      });
    } catch (error) {
      console.error("Error exporting payout report:", error);
      toast({
        title: t("exportError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  return {
    payouts: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch,
    pagination: {
      ...pagination,
      onPageChange: (page: number) => setPagination({ ...pagination, pageIndex: page }),
      onPageSizeChange: (size: number) => setPagination({ pageIndex: 0, pageSize: size })
    },
    exportPayoutReport
  };
};
