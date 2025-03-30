
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { InvoiceType } from "@/types/finances";

export type InvoiceFilterOptions = {
  status: string;
  searchTerm: string;
  startDate: Date | null;
  endDate: Date | null;
  entityType?: string;
  entityId?: string;
};

export const useInvoices = () => {
  const { user } = useContext(AuthContext);
  const companyId = user?.companyId;
  
  const [filters, setFilters] = useState<InvoiceFilterOptions>({
    status: "all",
    searchTerm: "",
    startDate: null,
    endDate: null,
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  const fetchInvoices = async () => {
    try {
      const pageIndex = pagination.page - 1;
      const { pageSize } = pagination;
      
      // Cast the query builder to 'any' to prevent deep type instantiation
      let query: any = supabase
        .from('invoices')
        .select('*', { count: 'exact' });
      
      // Apply company filter if available
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply search term filter to invoice number or entity name
      if (filters.searchTerm) {
        query = query.or(
          `invoice_number.ilike.%${filters.searchTerm}%,entity_name.ilike.%${filters.searchTerm}%`
        );
      }
      
      // Apply date range filters
      if (filters.startDate) {
        query = query.gte('issue_date', filters.startDate.toISOString().split('T')[0]);
      }
      
      if (filters.endDate) {
        // Add one day to include the end date fully
        const endDate = new Date(filters.endDate);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('issue_date', endDate.toISOString().split('T')[0]);
      }
      
      // Apply entity type filter if provided
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      
      // Apply entity id filter if provided
      if (filters.entityId) {
        query = query.eq('entity_id', filters.entityId);
      }
      
      // Apply pagination
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('issue_date', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        data: data as InvoiceType[],
        totalCount: count || 0
      };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['invoices', pagination, filters],
    queryFn: fetchInvoices,
  });
  
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 })); // Reset to first page when changing page size
  };
  
  const clearFilters = () => {
    setFilters({
      status: "all",
      searchTerm: "",
      startDate: null,
      endDate: null,
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when clearing filters
  };
  
  return {
    invoices: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    pagination: {
      ...pagination, 
      setPage,
      setPageSize,
      totalPages: Math.ceil((data?.totalCount || 0) / pagination.pageSize)
    },
    refetch,
    clearFilters
  };
};
