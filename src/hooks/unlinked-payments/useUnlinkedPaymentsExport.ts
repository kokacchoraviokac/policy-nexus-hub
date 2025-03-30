
import { FilterOptions } from "./useUnlinkedPaymentsFilters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useUnlinkedPaymentsExport = (filters: FilterOptions) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const exportPayments = async () => {
    try {
      // Start building the query
      let query = supabase
        .from("unlinked_payments")
        .select("*")
        .eq("status", filters.status || "unlinked");

      // Apply filters if provided
      if (filters.searchTerm) {
        query = query.or(
          `reference.ilike.%${filters.searchTerm}%,payer_name.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.dateFrom) {
        query = query.gte("payment_date", filters.dateFrom.toISOString().split("T")[0]);
      }

      if (filters.dateTo) {
        query = query.lte("payment_date", filters.dateTo.toISOString().split("T")[0]);
      }

      // Execute the query
      const { data, error } = await query.order("payment_date", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: t("noPaymentsFound"),
          description: t("noPaymentsToExport"),
          variant: "destructive",
        });
        return;
      }

      // Convert data to CSV
      const headers = ["Reference", "Payer Name", "Amount", "Payment Date", "Status"];
      const csvRows = [
        headers.join(","),
        ...data.map((payment) => {
          return [
            payment.reference || "",
            payment.payer_name || "",
            payment.amount,
            payment.payment_date,
            payment.status,
          ].join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // Create a link to download the CSV
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `unlinked-payments-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t("exportSuccessful"),
        description: t("paymentsExportedSuccessfully"),
      });
    } catch (error) {
      console.error("Error exporting payments:", error);
      toast({
        title: t("errorExportingPayments"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  return { exportPayments };
};
