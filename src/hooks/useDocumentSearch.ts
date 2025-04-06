
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document, DocumentSearchParams, EntityType } from '@/types/documents';
import { supabase } from '@/integrations/supabase/client';
import { getDocumentTableName } from '@/utils/documentUploadUtils';

export interface UseDocumentSearchProps {
  entityType?: EntityType | EntityType[];
  entityId?: string;
  initialSearchParams?: DocumentSearchParams;
  page?: number;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

export const useDocumentSearch = ({
  entityType,
  entityId,
  initialSearchParams = {},
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
}: UseDocumentSearchProps) => {
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>(initialSearchParams);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [pageSize, setPageSize] = useState<number>(pageSize);

  // Reset pagination when search params change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const fetchDocuments = useCallback(async () => {
    try {
      let tables: string[] = [];
      
      // Determine which tables to query
      if (entityType) {
        if (Array.isArray(entityType)) {
          tables = entityType.map(type => getDocumentTableName(type));
        } else {
          tables = [getDocumentTableName(entityType)];
        }
      } else {
        // Query all document tables if no entity type specified
        tables = [
          'policy_documents',
          'claim_documents',
          'sales_documents',
          'client_documents',
          'insurer_documents',
          'agent_documents',
          'invoice_documents',
          'addendum_documents'
        ];
      }
      
      // For simplicity, we'll just query the first table in the list
      // In a real implementation, you might want to query all tables and merge results
      const tableName = tables[0];
      
      // Build the query
      const query = supabase
        .from(tableName as any)
        .select('*', { count: 'exact' });
      
      // Add filters
      if (entityId) {
        if (tableName === 'policy_documents') {
          query.eq('policy_id', entityId);
        } else if (tableName === 'claim_documents') {
          query.eq('claim_id', entityId);
        } else if (tableName === 'sales_documents') {
          query.eq('sales_process_id', entityId);
        } else {
          query.eq('entity_id', entityId);
        }
      }
      
      if (searchParams.searchTerm) {
        query.ilike('document_name', `%${searchParams.searchTerm}%`);
      }
      
      if (searchParams.documentType) {
        query.eq('document_type', searchParams.documentType);
      }
      
      if (searchParams.category) {
        query.eq('category', searchParams.category);
      }
      
      if (searchParams.uploadedAfter) {
        query.gte('created_at', searchParams.uploadedAfter);
      }
      
      if (searchParams.uploadedBefore) {
        query.lte('created_at', searchParams.uploadedBefore);
      }
      
      // Add pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query.range(from, to);
      
      // Add sorting
      if (searchParams.sortBy) {
        query.order(searchParams.sortBy, {
          ascending: searchParams.sortDirection === 'asc'
        });
      } else {
        query.order('created_at', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        documents: data as Document[],
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }, [entityType, entityId, searchParams, currentPage, pageSize]);
  
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['documents', entityType, entityId, searchParams, currentPage, pageSize],
    queryFn: fetchDocuments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const searchDocuments = useCallback((params: DocumentSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page on new search
  }, []);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // Simple search function for convenience
  const search = useCallback(() => {
    refetch();
  }, [refetch]);
  
  return {
    documents: data?.documents || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    searchDocuments,
    refresh: refetch,
    search,
    isError: !!error,
    currentPage,
    pageSize,
    handlePageChange
  };
};
