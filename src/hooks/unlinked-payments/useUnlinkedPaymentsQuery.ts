
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnlinkedPaymentType } from "@/types/policies";
import { FilterOptions } from "./useUnlinkedPaymentsFilters";
import { PaginationState } from "./useUnlinkedPaymentsPagination";

export type UnlinkedPayment = UnlinkedPaymentType;

export const useUnlinkedPaymentsQuery = (pagination: PaginationState, filters: FilterOptions) => {
  const fetchUnlinkedPayments = async ({ pageIndex, pageSize, filters }: { 
    pageIndex: number, 
    pageSize: number, 
    filters: FilterOptions 
  }) => {
    let query = supabase
      .from('unlinked_payments')
      .select('*', { count: 'exact' });
    
    // Apply status filter
    if (filters.status === 'linked') {
      query = query.not('linked_policy_id', 'is', null);
    } else if (filters.status === 'unlinked') {
      query = query.is('linked_policy_id', null);
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      query = query.or(`reference.ilike.%${filters.searchTerm}%,payer_name.ilike.%${filters.searchTerm}%`);
    }
    
    // Apply date range filters
    if (filters.startDate) {
      query = query.gte('payment_date', filters.startDate.toISOString().split('T')[0]);
    }
    
    if (filters.endDate) {
      query = query.lte('payment_date', filters.endDate.toISOString().split('T')[0]);
    }
    
    // Apply pagination
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('payment_date', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data: data as UnlinkedPayment[],
      totalCount: count || 0
    };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['unlinked-payments', pagination, filters],
    queryFn: () => fetchUnlinkedPayments({ 
      pageIndex: pagination.pageIndex, 
      pageSize: pagination.pageSize, 
      filters 
    }),
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
};
