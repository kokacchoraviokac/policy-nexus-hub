
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory, EntityType } from '@/types/common';
import { 
  Document,
  DocumentSearchParams,
  UseDocumentSearchProps,
  UseDocumentSearchReturn
} from '@/types/documents';
import { getDocumentTableName } from '@/utils/documentUploadUtils';

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
  const [documents, setDocuments] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | string | undefined>(category);
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(approvalStatus);
  const [isError, setIsError] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = page;
  const itemsCount = totalCount;
  const itemsPerPage = pageSize;

  /**
   * Fetch documents based on search parameters
   */
  const searchDocuments = async (params?: Partial<DocumentSearchParams>) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsError(false);

      const currentParams = {
        page: page,
        limit: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder,
        searchTerm: searchTerm,
        category: selectedCategory,
        entityType: entityType,
        entityId: entityId,
        approvalStatus: selectedApprovalStatus,
        ...(initialSearchParams || {}),
        ...(params || {})
      };

      // This is where we would make a real API call to fetch documents
      // For now, let's just simulate a successful response with empty data
      setTimeout(() => {
        setDocuments([]);
        setTotalCount(0);
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Error searching documents:', err);
      setError(err);
      setIsError(true);
      setIsLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    if (autoFetch) {
      searchDocuments();
    }
  }, [
    page,
    pageSize,
    sortBy,
    sortOrder,
    entityType,
    entityId,
    selectedCategory,
    selectedApprovalStatus,
    // We don't include searchTerm here to avoid triggering search on every keystroke
  ]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else if (autoFetch) {
      searchDocuments();
    }
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const refresh = () => {
    searchDocuments();
  };

  return {
    documents,
    totalCount,
    page,
    setPage,
    pageSize,
    isLoading,
    error,
    isError,
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
    currentPage,
    totalPages,
    handlePageChange,
    itemsCount,
    itemsPerPage
  };
};
