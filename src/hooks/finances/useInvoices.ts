
import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { InvoiceType } from '@/types/finances';

export interface InvoiceFilterOptions {
  search?: string;
  status?: 'draft' | 'issued' | 'paid' | 'cancelled' | '';
  dateFrom?: Date;
  dateTo?: Date;
  invoiceType?: 'domestic' | 'foreign' | '';
  invoiceCategory?: 'automatic' | 'manual' | '';
}

export interface InvoicePaginationOptions {
  pageIndex: number;
  pageSize: number;
}

export interface InvoicePaginationResult {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const useInvoices = () => {
  const { user } = useContext(AuthContext);
  const companyId = user?.companyId;
  
  const [filters, setFilters] = useState<InvoiceFilterOptions>({});
  const [pagination, setPagination] = useState<InvoicePaginationOptions>({
    pageIndex: 0,
    pageSize: 10
  });
  
  // Query to fetch invoices
  const {
    data: fetchResult,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['invoices', filters, pagination, companyId],
    queryFn: async () => {
      if (!companyId) return { data: [], count: 0 };
      
      // Start building the query - use type assertion to prevent excessive type inference
      let query = supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('company_id', companyId) as any;
      
      // Apply filters
      if (filters.search) {
        query = query.or(`invoice_number.ilike.%${filters.search}%,entity_name.ilike.%${filters.search}%`);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.dateFrom) {
        query = query.gte('issue_date', filters.dateFrom.toISOString());
      }
      
      if (filters.dateTo) {
        query = query.lte('issue_date', filters.dateTo.toISOString());
      }
      
      if (filters.invoiceType) {
        query = query.eq('invoice_type', filters.invoiceType);
      }
      
      if (filters.invoiceCategory) {
        query = query.eq('invoice_category', filters.invoiceCategory);
      }
      
      // Apply pagination
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      // Add range and ordering - using any to break type recursion
      const paginatedQuery = query.order('created_at', { ascending: false }).range(from, to);
      
      // Execute the query
      const { data, error, count } = await paginatedQuery;
      
      if (error) throw error;
      
      return {
        data: data as InvoiceType[],
        count: count || 0
      };
    },
    enabled: !!companyId
  });
  
  // Function to export all invoices (not just the current page)
  const exportAllInvoices = async () => {
    if (!companyId) return [];
    
    // Start building the query with type assertion
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('company_id', companyId) as any;
    
    // Apply filters (same as above but without pagination)
    if (filters.search) {
      query = query.or(`invoice_number.ilike.%${filters.search}%,entity_name.ilike.%${filters.search}%`);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.dateFrom) {
      query = query.gte('issue_date', filters.dateFrom.toISOString());
    }
    
    if (filters.dateTo) {
      query = query.lte('issue_date', filters.dateTo.toISOString());
    }
    
    if (filters.invoiceType) {
      query = query.eq('invoice_type', filters.invoiceType);
    }
    
    if (filters.invoiceCategory) {
      query = query.eq('invoice_category', filters.invoiceCategory);
    }
    
    // Order by created_at descending - using any to break type recursion
    const exportQuery = query.order('created_at', { ascending: false });
    
    // Execute the query
    const { data, error } = await exportQuery;
    
    if (error) throw error;
    
    return data as InvoiceType[];
  };
  
  // Function to clear all filters
  const clearFilters = () => {
    setFilters({});
    setPagination({
      ...pagination,
      pageIndex: 0
    });
  };
  
  // Construct pagination result object
  const paginationResult: InvoicePaginationResult = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    totalCount: fetchResult?.count || 0,
    totalPages: Math.ceil((fetchResult?.count || 0) / pagination.pageSize),
    setPage: (page: number) => setPagination({ ...pagination, pageIndex: page - 1 }),
    setPageSize: (pageSize: number) => setPagination({ pageIndex: 0, pageSize }),
    onPageChange: (pageIndex: number) => setPagination({ ...pagination, pageIndex }),
    onPageSizeChange: (pageSize: number) => setPagination({ pageIndex: 0, pageSize })
  };
  
  return {
    invoices: fetchResult?.data || [],
    totalCount: fetchResult?.count || 0,
    isLoading,
    isError,
    filters,
    setFilters,
    pagination: paginationResult,
    refetch,
    clearFilters,
    exportAllInvoices
  };
};
