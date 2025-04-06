
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document, EntityType, DocumentCategory, DocumentSearchParams, DocumentApprovalStatus, UseDocumentSearchProps, UseDocumentSearchReturn } from "@/types/documents";
import { safeQueryCast } from "@/utils/safeSupabaseQuery";
import { fromTable } from "@/utils/supabaseHelpers";
import { mapEntityToDocumentTable } from "@/utils/supabaseQueryHelper";

export const useDocumentSearch = ({
  entityType,
  entityId,
  category,
  defaultPageSize = 10,
  defaultSortBy = 'created_at',
  defaultSortOrder = 'desc',
  initialSearchTerm = '',
  approvalStatus
}: UseDocumentSearchProps): UseDocumentSearchReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | undefined>(category);
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<DocumentApprovalStatus | undefined>(approvalStatus);
  const [isError, setIsError] = useState(false);
  
  const searchDocuments = async (params?: Partial<DocumentSearchParams>) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    
    try {
      const searchParams: DocumentSearchParams = {
        entityType,
        entityId: params?.entityId || entityId,
        category: params?.category || selectedCategory,
        searchTerm: params?.searchTerm !== undefined ? params.searchTerm : searchTerm,
        page: params?.page || page,
        pageSize: params?.pageSize || pageSize,
        sortBy: params?.sortBy || sortBy,
        sortOrder: params?.sortOrder || sortOrder,
        approvalStatus: params?.approvalStatus || selectedApprovalStatus
      };
      
      // Get the table name for this entity type
      const tableName = mapEntityToDocumentTable(searchParams.entityType);
      
      if (!tableName) {
        throw new Error(`Invalid entity type: ${searchParams.entityType}`);
      }
      
      // Build the query using the safe query helper
      let query = supabase.from(tableName);
      
      // Apply entity ID filter if provided
      if (searchParams.entityId) {
        query = query.eq('entity_id', searchParams.entityId);
      }
      
      // Apply category filter if provided
      if (searchParams.category) {
        query = query.eq('category', searchParams.category);
      }
      
      // Apply approval status filter if provided
      if (searchParams.approvalStatus) {
        query = query.eq('approval_status', searchParams.approvalStatus);
      }
      
      // Apply search term filter if provided
      if (searchParams.searchTerm) {
        query = query.ilike('document_name', `%${searchParams.searchTerm}%`);
      }
      
      // Get the total count first
      const countResult = await query.count();
      const count = countResult.count || 0;
      
      setTotalCount(count);
      
      // Apply pagination and sorting
      const dataResult = await query
        .order(searchParams.sortBy, { ascending: searchParams.sortOrder === 'asc' })
        .range(
          (searchParams.page - 1) * searchParams.pageSize,
          searchParams.page * searchParams.pageSize - 1
        );
      
      if (dataResult.error) {
        throw new Error(`Error fetching documents: ${dataResult.error.message}`);
      }
      
      // Convert the query result to Document[]
      const documentData = dataResult.data as unknown as Document[];
      setDocuments(documentData || []);
      
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch and when dependencies change
  useEffect(() => {
    searchDocuments();
  }, [
    entityType,
    entityId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    selectedCategory,
    selectedApprovalStatus
  ]);
  
  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // Reset to first page on new search
      } else {
        searchDocuments({ searchTerm });
      }
    }, 300);
    
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  // Alias for page to match component expectations
  const currentPage = page;
  
  // Alias for setPage to match component expectations
  const handlePageChange = setPage;
  
  return {
    documents,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedCategory,
    setSelectedCategory,
    selectedApprovalStatus,
    setSelectedApprovalStatus,
    refetch: searchDocuments,
    isError,
    searchDocuments,
    currentPage,
    handlePageChange
  };
};
