
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, EntityType, DocumentCategory, DocumentSearchParams } from "@/types/documents";
import { useToast } from "@/hooks/use-toast";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

export interface UseDocumentSearchProps {
  entityType?: EntityType | EntityType[];
  entityId?: string;
  initialSearchParams?: DocumentSearchParams;
  page?: number;
  pageSize?: number;
}

export const useDocumentSearch = ({
  entityType,
  entityId,
  initialSearchParams = {},
  page = 1,
  pageSize = 10
}: UseDocumentSearchProps = {}) => {
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>(initialSearchParams);
  const { toast } = useToast();
  
  const fetchDocuments = async () => {
    try {
      // If no entity type is specified, we don't know which table to query
      if (!entityType) {
        return { documents: [], totalCount: 0 };
      }
      
      // Handle array of entity types
      const entityTypes = Array.isArray(entityType) ? entityType : [entityType];
      
      let allDocuments: Document[] = [];
      let totalCount = 0;
      
      // Query each entity type's document table
      for (const type of entityTypes) {
        const tableName = getDocumentTableName(type);
        
        // Create a base query with type assertion to avoid TypeScript errors
        let query = supabase.from(tableName as any).select('*');
        
        // Apply entity ID filter if provided
        if (entityId) {
          const idColumn = `${type}_id`;
          query = query.eq(idColumn, entityId) as any;
        }
        
        // Apply search parameters
        if (searchParams.searchTerm) {
          query = (query as any).ilike('document_name', `%${searchParams.searchTerm}%`);
        }
        
        if (searchParams.documentType) {
          query = (query as any).eq('document_type', searchParams.documentType);
        }
        
        if (searchParams.category) {
          query = (query as any).eq('category', searchParams.category);
        }
        
        if (searchParams.uploadedAfter) {
          query = (query as any).gte('created_at', searchParams.uploadedAfter);
        }
        
        if (searchParams.uploadedBefore) {
          query = (query as any).lt('created_at', searchParams.uploadedBefore);
        }
        
        // Fetch count first
        const countQuery = structuredClone(query);
        const { count: entityCount, error: countError } = await (countQuery as any).count();
        
        if (countError) {
          console.error(`Error counting documents for ${type}:`, countError);
          continue;
        }
        
        totalCount += entityCount || 0;
        
        // Apply pagination and sorting
        query = (query as any).order(
          searchParams.sortBy || 'created_at',
          { 
            ascending: searchParams.sortDirection === 'asc'
          }
        );
        
        // Calculate pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        query = (query as any).range(from, to);
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          console.error(`Error fetching documents for ${type}:`, error);
          continue;
        }
        
        if (data && data.length > 0) {
          // Transform the data into our Document type and add entity_type
          const transformedData = data.map((doc: any) => ({
            id: doc.id,
            document_name: doc.document_name,
            document_type: doc.document_type,
            created_at: doc.created_at,
            file_path: doc.file_path,
            entity_type: type,
            entity_id: doc[`${type}_id`] || entityId || '',
            uploaded_by: doc.uploaded_by,
            company_id: doc.company_id,
            description: doc.description,
            category: doc.category,
            version: doc.version,
            is_latest_version: doc.is_latest_version,
            mime_type: doc.mime_type,
            original_document_id: doc.original_document_id,
            uploaded_by_name: doc.uploaded_by_name,
            updated_at: doc.updated_at || doc.created_at,
            approval_status: doc.approval_status,
            approved_by: doc.approved_by,
            approved_at: doc.approved_at,
            approval_notes: doc.approval_notes
          })) as Document[];
          
          allDocuments = [...allDocuments, ...transformedData];
        }
      }
      
      // If we're querying multiple entity types, we need to sort and paginate the combined results
      if (entityTypes.length > 1) {
        // Sort the combined results
        allDocuments.sort((a, b) => {
          const field = searchParams.sortBy || 'created_at';
          const aValue = (a as any)[field];
          const bValue = (b as any)[field];
          
          if (searchParams.sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        // Apply pagination to the combined results
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        allDocuments = allDocuments.slice(from, to);
      }
      
      return { documents: allDocuments, totalCount };
    } catch (error) {
      console.error("Error in document search:", error);
      toast({
        title: "Error searching documents",
        description: "There was an error searching for documents. Please try again.",
        variant: "destructive",
      });
      return { documents: [], totalCount: 0 };
    }
  };
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documents', 'search', entityType, entityId, searchParams, page, pageSize],
    queryFn: fetchDocuments,
  });
  
  const searchDocuments = (params: DocumentSearchParams) => {
    setSearchParams(params);
  };
  
  // Add a shorthand search function
  const search = () => {
    refetch();
  };
  
  return {
    documents: data?.documents || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error: error as Error,
    searchDocuments,
    refresh: refetch,
    search,
    isError: !!error
  };
};
