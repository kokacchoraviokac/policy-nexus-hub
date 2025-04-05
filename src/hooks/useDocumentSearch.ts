
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Document, EntityType, DocumentSearchParams } from "@/types/documents";
import { fromEntityTable } from "@/utils/supabaseTypeAssertions";
import { getDocumentTableForEntity } from "@/utils/supabaseQueryHelper";

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
          // Use the entity-specific document table
          const query = fromEntityTable(entityType);
          
          // Apply entity ID filter based on the entity type
          let filteredQuery = query;
          if (entityType === 'policy') {
            filteredQuery = query.eq('policy_id', entityId);
          } else if (entityType === 'claim') {
            filteredQuery = query.eq('claim_id', entityId);
          } else if (entityType === 'sales_process') {
            filteredQuery = query.eq('sales_process_id', entityId);
          } else if (entityType === 'client') {
            filteredQuery = query.eq('client_id', entityId);
          } else if (entityType === 'agent') {
            filteredQuery = query.eq('agent_id', entityId);
          } else if (entityType === 'invoice') {
            filteredQuery = query.eq('invoice_id', entityId);
          } else if (entityType === 'insurer') {
            filteredQuery = query.eq('insurer_id', entityId);
          } else if (entityType === 'addendum') {
            filteredQuery = query.eq('addendum_id', entityId);
          }
          
          const { data, error: fetchError } = await filteredQuery
            .order('created_at', { ascending: false });
          
          if (fetchError) throw fetchError;
          
          return mapToDocuments(data, entityType);
        }
        
        // Simplified implementation for search - uses a single entity type
        if (entityType) {
          const query = fromEntityTable(entityType);
          
          // Apply filters based on search params
          let filteredQuery = query;
          
          // Apply entity ID filter if provided
          if (entityId) {
            if (entityType === 'policy') {
              filteredQuery = filteredQuery.eq('policy_id', entityId);
            } else if (entityType === 'claim') {
              filteredQuery = filteredQuery.eq('claim_id', entityId);
            } else if (entityType === 'sales_process') {
              filteredQuery = filteredQuery.eq('sales_process_id', entityId);
            } else if (entityType === 'client') {
              filteredQuery = filteredQuery.eq('client_id', entityId);
            } else if (entityType === 'agent') {
              filteredQuery = filteredQuery.eq('agent_id', entityId);
            } else if (entityType === 'invoice') {
              filteredQuery = filteredQuery.eq('invoice_id', entityId);
            } else if (entityType === 'insurer') {
              filteredQuery = filteredQuery.eq('insurer_id', entityId);
            } else if (entityType === 'addendum') {
              filteredQuery = filteredQuery.eq('addendum_id', entityId);
            }
          }
          
          // Apply search text if provided
          if (searchParams.searchTerm) {
            filteredQuery = filteredQuery.ilike('document_name', `%${searchParams.searchTerm}%`);
          }
          
          // Apply category filter if provided
          if (searchParams.category) {
            filteredQuery = filteredQuery.eq('category', searchParams.category);
          }
          
          // Apply document type filter if provided
          if (searchParams.documentType) {
            filteredQuery = filteredQuery.eq('document_type', searchParams.documentType);
          }
          
          // Apply date filters if provided
          if (searchParams.dateFrom) {
            filteredQuery = filteredQuery.gte('created_at', new Date(searchParams.dateFrom).toISOString());
          }
          
          if (searchParams.dateTo) {
            // Add 1 day to include the entire day
            const nextDay = new Date(searchParams.dateTo);
            nextDay.setDate(nextDay.getDate() + 1);
            filteredQuery = filteredQuery.lt('created_at', nextDay.toISOString());
          }
          
          const { data, error: fetchError } = await filteredQuery
            .order('created_at', { ascending: false });
          
          if (fetchError) throw fetchError;
          
          return mapToDocuments(data, entityType);
        }
        
        // Return empty array if no entity type provided
        return [];
        
      } finally {
        setIsSearching(false);
      }
    },
    enabled: !!entityType
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
function mapToDocuments(data: any[], entityType: EntityType): Document[] {
  return (data || []).map(item => {
    let entityId = "";
    
    if (entityType === 'policy' && item.policy_id) {
      entityId = item.policy_id;
    } else if (entityType === 'claim' && item.claim_id) {
      entityId = item.claim_id;
    } else if (entityType === 'sales_process' && item.sales_process_id) {
      entityId = item.sales_process_id;
    } else if (entityType === 'client' && item.client_id) {
      entityId = item.client_id;
    } else if (entityType === 'agent' && item.agent_id) {
      entityId = item.agent_id;
    } else if (entityType === 'invoice' && item.invoice_id) {
      entityId = item.invoice_id;
    } else if (entityType === 'insurer' && item.insurer_id) {
      entityId = item.insurer_id;
    } else if (entityType === 'addendum' && item.addendum_id) {
      entityId = item.addendum_id;
    }
    
    return {
      id: item.id,
      document_name: item.document_name,
      document_type: item.document_type,
      created_at: item.created_at,
      file_path: item.file_path,
      entity_type: entityType,
      entity_id: entityId,
      uploaded_by: item.uploaded_by,
      company_id: item.company_id || "",
      description: item.description || "",
      version: item.version || 1,
      status: item.status || "active",
      category: item.category || "other",
      mime_type: item.mime_type || "",
      is_latest_version: item.is_latest_version === undefined ? true : item.is_latest_version,
      original_document_id: item.original_document_id || null,
    } as Document;
  });
}
