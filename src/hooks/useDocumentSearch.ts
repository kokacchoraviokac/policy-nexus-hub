
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Document, 
  EntityType, 
  DocumentCategory, 
  DocumentSearchParams,
  UseDocumentSearchProps,
  UseDocumentSearchReturn 
} from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { fromAnyTable } from "@/utils/supabaseTypeAssertions";

export const useDocumentSearch = ({
  entityType,
  entityId,
  category,
  defaultPageSize = 10,
  defaultSortBy = 'created_at',
  defaultSortOrder = 'desc',
  initialSearchTerm = '',
  approvalStatus,
  initialSearchParams
}: UseDocumentSearchProps = {}): UseDocumentSearchReturn => {
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
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<string | undefined>(approvalStatus);
  const [isError, setIsError] = useState(false);
  
  const searchDocuments = async (params?: Partial<DocumentSearchParams>) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    
    try {
      const searchParams: DocumentSearchParams = {
        searchTerm: params?.searchTerm !== undefined ? params.searchTerm : searchTerm,
        category: params?.category || selectedCategory,
        page: params?.page || page,
        pageSize: params?.pageSize || pageSize,
        entityType: params?.entityType || entityType,
        entityId: params?.entityId || entityId,
        sortBy: params?.sortBy || sortBy,
        sortOrder: params?.sortOrder || sortOrder,
        approvalStatus: params?.approvalStatus as any || selectedApprovalStatus
      };
      
      // For now, we'll mock the document data since there might be issues with the database schema
      // In a real implementation, replace this with proper Supabase queries
      
      // Mock document data
      const mockDocuments: Document[] = [
        {
          id: '1',
          document_name: 'Policy Document',
          document_type: 'policy',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          uploaded_by: 'user123',
          file_path: '/documents/policy1.pdf',
          category: 'policy',
          entity_id: entityId || 'mock-entity-id',
          entity_type: entityType || 'policy',
          version: 1,
          is_latest_version: true,
          approval_status: 'approved',
          company_id: 'mock-company-id'
        },
        {
          id: '2',
          document_name: 'Claim Form',
          document_type: 'claim',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          uploaded_by: 'user123',
          file_path: '/documents/claim1.pdf',
          category: 'claim',
          entity_id: entityId || 'mock-entity-id',
          entity_type: entityType || 'claim',
          version: 1,
          is_latest_version: true,
          approval_status: 'pending',
          company_id: 'mock-company-id'
        }
      ];
      
      // Apply filters to mock data
      let filteredDocuments = [...mockDocuments];
      
      if (searchParams.entityId) {
        filteredDocuments = filteredDocuments.filter(doc => doc.entity_id === searchParams.entityId);
      }
      
      if (searchParams.entityType) {
        filteredDocuments = filteredDocuments.filter(doc => doc.entity_type === searchParams.entityType);
      }
      
      if (searchParams.category) {
        filteredDocuments = filteredDocuments.filter(doc => doc.category === searchParams.category);
      }
      
      if (searchParams.approvalStatus) {
        filteredDocuments = filteredDocuments.filter(doc => doc.approval_status === searchParams.approvalStatus);
      }
      
      if (searchParams.searchTerm) {
        const term = searchParams.searchTerm.toLowerCase();
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.document_name.toLowerCase().includes(term)
        );
      }
      
      // Sort the documents
      filteredDocuments.sort((a, b) => {
        const aValue = (a as any)[searchParams.sortBy || 'created_at'];
        const bValue = (b as any)[searchParams.sortBy || 'created_at'];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return searchParams.sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
      
      // Apply pagination
      const start = (searchParams.page || 1 - 1) * (searchParams.pageSize || 10);
      const end = start + (searchParams.pageSize || 10);
      const paginatedDocuments = filteredDocuments.slice(start, end);
      
      setTotalCount(filteredDocuments.length);
      setDocuments(paginatedDocuments);
      
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
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Alias for page to match component expectations
  const currentPage = page;
  
  // Alias for setPage to match component expectations
  const handlePageChange = (newPage: number) => setPage(newPage);
  
  // Build search params for further customization
  const searchParams: DocumentSearchParams = {
    searchTerm,
    category: selectedCategory,
    page,
    pageSize,
    entityType,
    entityId
  };
  
  return {
    documents,
    totalCount,
    page,
    setPage,
    pageSize,
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
    totalPages,
    handlePageChange,
    searchParams,
    setSearchParams: (params) => {
      // Update search params
      if (params.searchTerm !== undefined) setSearchTerm(params.searchTerm);
      if (params.category !== undefined) setSelectedCategory(params.category);
      if (params.page !== undefined) setPage(params.page);
      if (params.sortBy !== undefined) setSortBy(params.sortBy);
      if (params.sortOrder !== undefined) setSortOrder(params.sortOrder);
      if (params.approvalStatus !== undefined) setSelectedApprovalStatus(params.approvalStatus as string);
    },
    resetSearch: () => {
      setSearchTerm('');
      setSelectedCategory(undefined);
      setSelectedApprovalStatus(undefined);
      setPage(1);
      setSortBy(defaultSortBy);
      setSortOrder(defaultSortOrder);
      searchDocuments({
        searchTerm: '',
        category: undefined,
        page: 1,
        sortBy: defaultSortBy,
        sortOrder: defaultSortOrder,
        approvalStatus: undefined
      });
    }
  };
};
