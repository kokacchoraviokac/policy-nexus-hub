
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FilterOptions } from "./useUnlinkedPaymentsFilters";
import { PaginationState } from "./useUnlinkedPaymentsPagination";

export interface UnlinkedPayment {
  id: string;
  reference: string;
  payer_name: string;
  amount: number;
  payment_date: string;
  currency: string;
  status: string;
  linked_policy_id?: string;
}

export const useUnlinkedPaymentsQuery = (
  pagination: PaginationState,
  filters: FilterOptions
) => {
  return useQuery({
    queryKey: ["unlinked-payments", pagination, filters],
    queryFn: async () => {
      // Calculate offset from page and pageSize
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      // Start building the query
      let query = supabase
        .from("unlinked_payments")
        .select("*", { count: "exact" })
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

      // Execute the query with pagination
      const { data, error, count } = await query
        .order("payment_date", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: data as UnlinkedPayment[],
        totalCount: count || 0,
      };
    },
  });
};
