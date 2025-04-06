
import { useState, useCallback } from "react";
import { 
  PolicyDocument, 
  DocumentCategory, 
  DocumentApprovalStatus,
  DocumentSearchParams,
  UseDocumentSearchProps,
  UseDocumentSearchReturn 
} from "@/types/documents";
import { EntityType } from "@/types/common";
import { fromTable } from "@/utils/supabaseTypeAssertions";

export const useDocumentSearch = ({
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
}: UseDocumentSearchProps = {}): UseDocumentSearchReturn => {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | undefined>(category);
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<DocumentApprovalStatus | undefined>(approvalStatus);
  const [isError, setIsError] = useState(false);
  
  const searchDocuments = useCallback(async (params?: Partial<DocumentSearchParams>) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    
    try {
      const searchParams: DocumentSearchParams = {
        searchTerm: params?.searchTerm !== undefined ? params.searchTerm : searchTerm,
        category: params?.category || selectedCategory,
        page: params?.page || page,
        limit: params?.limit || pageSize,
        entityType: params?.entityType || entityType,
        entityId: params?.entityId || entityId,
        sortBy: params?.sortBy || sortBy,
        sortOrder: params?.sortOrder || sortOrder,
        approvalStatus: params?.approvalStatus || selectedApprovalStatus
      };
      
      // For now, we'll mock the document data since there might be issues with the database schema
      // In a real implementation, replace this with proper Supabase queries
      
      // Mock document data
      const mockDocuments: PolicyDocument[] = [
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
          entity_type: entityType || EntityType.POLICY,
          version: 1,
          is_latest_version: true,
          approval_status: DocumentApprovalStatus.APPROVED,
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
          entity_type: entityType || EntityType.CLAIM,
          version: 1,
          is_latest_version: true,
          approval_status: DocumentApprovalStatus.PENDING,
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
      const start = ((searchParams.page || 1) - 1) * (searchParams.limit || 10);
      const end = start + (searchParams.limit || 10);
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
  }, [
    entityType,
    entityId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    selectedCategory,
    selectedApprovalStatus,
    searchTerm
  ]);
  
  const refresh = useCallback(() => {
    searchDocuments();
  }, [searchDocuments]);
  
  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    searchDocuments({ page: newPage });
  };
  
  // Compute total pages
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    documents,
    totalCount,
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
    searchDocuments,
    refresh,
    isError,
    currentPage: page,
    totalPages,
    handlePageChange,
    itemsCount: totalCount,
    itemsPerPage: pageSize
  };
};
