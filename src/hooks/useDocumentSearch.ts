import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Document, EntityType } from "@/types/documents";
import { supabase } from "@/integrations/supabase/client";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { queryDocuments } from "@/utils/supabaseQueryHelper";

interface DocumentSearchParams {
  searchTerm?: string;
  category?: string;
  documentType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface UseDocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
}

export const useDocumentSearch = ({
  entityType,
  entityId
}: UseDocumentSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>({});
  const queryClient = useQueryClient();
  
  const queryKey = ['document-search', entityType, entityId, searchParams];
  
  const { 
    data: documents = [], 
    isLoading: isLoadingDocuments,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        setIsSearching(true);
        
        // If no search params and we have entity constraints, use regular document fetching
        if (
          entityType && 
          entityId && 
          !searchParams.searchTerm && 
          !searchParams.category && 
          !searchParams.documentType && 
          !searchParams.dateFrom && 
          !searchParams.dateTo
        ) {
          const tableName = getDocumentTableName(entityType);
          
          let query = queryDocuments(tableName);
          
          // Apply entity ID filter based on the table
          if (tableName === 'policy_documents') {
            query = query.eq('policy_id', entityId);
          } else if (tableName === 'claim_documents') {
            query = query.eq('claim_id', entityId);
          } else if (tableName === 'sales_documents') {
            query = query.eq('sales_process_id', entityId);
          }
          
          const { data, error: fetchError } = await query
            .order('created_at', { ascending: false });
          
          if (fetchError) throw fetchError;
          
          return mapToDocuments(data, entityType, entityId);
        }
        
        // Otherwise, perform a search across all document tables
        const tables = [
          'policy_documents',
          'claim_documents',
          'sales_documents'
        ];
        
        let allDocuments: Document[] = [];
        
        for (const table of tables) {
          // Skip table if we're filtering by entity type and it doesn't match
          if (entityType && getDocumentTableName(entityType) !== table) {
            continue;
          }
          
          let query = queryDocuments(table);
          
          // Apply entity ID filter if provided
          if (entityType && entityId) {
            if (table === 'policy_documents') {
              query = query.eq('policy_id', entityId);
            } else if (table === 'claim_documents') {
              query = query.eq('claim_id', entityId);
            } else if (table === 'sales_documents') {
              query = query.eq('sales_process_id', entityId);
            }
          }
          
          // Apply search filters
          if (searchParams.searchTerm) {
            query = query.ilike('document_name', `%${searchParams.searchTerm}%`);
          }
          
          if (searchParams.category) {
            query = query.eq('category', searchParams.category);
          }
          
          if (searchParams.documentType) {
            query = query.eq('document_type', searchParams.documentType);
          }
          
          if (searchParams.dateFrom) {
            query = query.gte('created_at', searchParams.dateFrom.toISOString());
          }
          
          if (searchParams.dateTo) {
            // Add 1 day to include the entire day
            const nextDay = new Date(searchParams.dateTo);
            nextDay.setDate(nextDay.getDate() + 1);
            query = query.lt('created_at', nextDay.toISOString());
          }
          
          const { data, error: fetchError } = await query
            .order('created_at', { ascending: false });
          
          if (fetchError) throw fetchError;
          
          // Map results to Document type and add to combined results
          const mappedDocuments = mapToDocuments(
            data, 
            getEntityTypeFromTable(table),
            entityId
          );
          
          allDocuments = [...allDocuments, ...mappedDocuments];
        }
        
        // Sort combined results by creation date, newest first
        allDocuments.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        return allDocuments;
      } finally {
        setIsSearching(false);
      }
    },
    enabled: true
  });
  
  const searchDocuments = (params: DocumentSearchParams) => {
    setSearchParams(params);
    queryClient.invalidateQueries({ queryKey: ['document-search', entityType, entityId] });
  };
  
  return {
    documents,
    isLoading: isLoadingDocuments || isSearching,
    error,
    searchDocuments,
    refresh: refetch
  };
};

// Helper function to map database records to Document type
function mapToDocuments(
  data: any[], 
  entityType: EntityType | undefined,
  entityId: string | undefined
): Document[] {
  return (data || []).map(item => {
    // Determine entity ID and type from the record
    let mappedEntityId = entityId || "";
    let mappedEntityType = entityType || "other";
    
    if (item.policy_id) {
      mappedEntityId = item.policy_id;
      mappedEntityType = "policy";
    } else if (item.claim_id) {
      mappedEntityId = item.claim_id;
      mappedEntityType = "claim";
    } else if (item.sales_process_id) {
      mappedEntityId = item.sales_process_id;
      mappedEntityType = "sales_process";
    }
    
    return {
      id: item.id,
      document_name: item.document_name,
      document_type: item.document_type,
      created_at: item.created_at,
      file_path: item.file_path,
      entity_type: mappedEntityType,
      entity_id: mappedEntityId,
      uploaded_by_id: item.uploaded_by,
      uploaded_by_name: "", // Can be populated if needed
      description: item.description || "",
      version: item.version || 1,
      status: item.status || "active",
      tags: item.tags || [],
      category: item.category || "other",
      mime_type: item.mime_type || "",
      is_latest_version: item.is_latest_version === undefined ? true : item.is_latest_version,
      original_document_id: item.original_document_id || null,
      approval_status: item.approval_status || "pending"
    } as Document;
  });
}

// Helper function to determine entity type from table name
function getEntityTypeFromTable(tableName: string): EntityType {
  switch (tableName) {
    case 'policy_documents':
      return 'policy';
    case 'claim_documents':
      return 'claim';
    case 'sales_documents':
      return 'sales_process';
    default:
      return 'policy'; // Default fallback
  }
}
