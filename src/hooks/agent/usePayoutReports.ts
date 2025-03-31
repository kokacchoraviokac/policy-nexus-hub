
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
    if (!companyId) {
      return { data: [], totalCount: 0 };
    }

    try {
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      const { data, error, count } = await supabase
        .from("agent_payouts")
        .select(`
          *,
          agents(name)
        `, { count: 'exact' })
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      // Transform data to include agent name
      const transformedData = data.map((payout) => ({
        ...payout,
        agent_name: payout.agents?.name || "Unknown"
      }));

      return { 
        data: transformedData, 
        totalCount: count || 0 
      };
    } catch (error) {
      console.error("Error fetching payouts:", error);
      toast({
        title: t("errorFetchingPayouts"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
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
