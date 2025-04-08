
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentSearchParams, UseDocumentSearchProps, UseDocumentSearchReturn, DocumentCategory } from '@/types/documents';
import { useAuth } from '@/contexts/AuthContext';

export const useDocumentSearch = (props?: UseDocumentSearchProps): UseDocumentSearchReturn => {
  const { user } = useAuth();
  
  // Extract props with defaults
  const {
    defaultParams,
    autoSearch = true,
    entityType,
    entityId,
    category,
    defaultPageSize = 10,
    defaultSortBy = 'created_at',
    defaultSortOrder = 'desc',
    initialSearchTerm = '',
    approvalStatus,
    initialSearchParams,
    autoFetch = true
  } = props || {};

  // State for search parameters
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>({
    page: 1,
    pageSize: defaultPageSize,
    ...defaultParams,
    ...initialSearchParams
  });
  
  // State for search results
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Additional state for the component requirements
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | undefined>(
    category as DocumentCategory
  );
  
  // Calculate derived values
  const itemsCount = totalCount;
  const itemsPerPage = searchParams.pageSize || defaultPageSize;
  const currentPage = searchParams.page || 1;
  const isError = !!error;

  const search = useCallback(async () => {
    if (!user?.company_id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Build the query
      let query = supabase
        .from('document_view') // Assuming a view that joins all document tables
        .select('*', { count: 'exact' });
      
      // Add company filter
      query = query.eq('company_id', user.company_id);
      
      // Add entity type filter if provided
      if (searchParams.entityType) {
        query = query.eq('entity_type', searchParams.entityType);
      }
      
      // Add entity ID filter if provided
      if (searchParams.entityId) {
        query = query.eq('entity_id', searchParams.entityId);
      }
      
      // Add category filter if provided
      if (searchParams.category) {
        query = query.eq('category', searchParams.category);
      }
      
      // Add approval status filter if provided
      if (approvalStatus) {
        query = query.eq('approval_status', approvalStatus);
      }
      
      // Add date range filters if provided
      if (searchParams.dateFrom) {
        query = query.gte('created_at', searchParams.dateFrom);
      }
      
      if (searchParams.dateTo) {
        query = query.lte('created_at', searchParams.dateTo);
      }
      
      // Add search term filter if provided
      if (searchParams.searchTerm) {
        query = query.or(
          `document_name.ilike.%${searchParams.searchTerm}%,document_type.ilike.%${searchParams.searchTerm}%`
        );
      }
      
      // Add document type filter if provided
      if (searchParams.documentType) {
        query = query.eq('document_type', searchParams.documentType);
      }
      
      // Add pagination
      const pageSize = searchParams.pageSize || defaultPageSize;
      const page = searchParams.page || 1;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query
        .order(defaultSortBy, { ascending: defaultSortOrder === 'asc' })
        .range(from, to);
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Update state with results
      setDocuments(data as Document[]);
      
      if (count !== null) {
        setTotalCount(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (err) {
      console.error('Error searching documents:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.company_id, searchParams, approvalStatus, defaultPageSize, defaultSortBy, defaultSortOrder]);
  
  // Execute search when parameters change if autoSearch is enabled
  useEffect(() => {
    if (autoFetch && user?.company_id) {
      search();
    }
  }, [search, autoFetch, user?.company_id]);
  
  // Handle search term changes
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    setSearchParams(prev => ({ ...prev, searchTerm: term }));
  }, []);
  
  // Handle category changes
  const handleCategoryChange = useCallback((newCategory: DocumentCategory | undefined) => {
    setSelectedCategory(newCategory);
    setSearchParams(prev => ({ ...prev, category: newCategory }));
  }, []);
  
  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);
  
  // Reset search
  const resetSearch = useCallback(() => {
    setSearchParams({
      page: 1,
      pageSize: defaultPageSize,
      ...defaultParams
    });
    setSearchTerm('');
    setSelectedCategory(undefined);
  }, [defaultPageSize, defaultParams]);
  
  // Combined search function for UI
  const searchDocuments = useCallback(() => {
    // Update search params with current UI state
    setSearchParams(prev => ({
      ...prev,
      searchTerm,
      category: selectedCategory,
      page: 1 // Reset to first page when searching
    }));
    
    // Trigger search
    search();
  }, [search, searchTerm, selectedCategory]);
  
  return {
    documents,
    isLoading,
    error,
    searchParams,
    setSearchParams,
    search,
    totalCount,
    totalPages,
    resetSearch,
    // Additional properties for the component
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    searchDocuments,
    currentPage,
    handlePageChange,
    itemsCount,
    itemsPerPage,
    isError,
    page: currentPage
  };
};
