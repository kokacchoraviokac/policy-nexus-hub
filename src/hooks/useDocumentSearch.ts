
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

// Define a leaner search params interface to avoid type issues
export interface DocumentSearchParams {
  searchTerm?: string;
  entityType?: string;
  entityId?: string;
  status?: string;
  category?: string;
}

export const useDocumentSearch = () => {
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>({});
  
  const { 
    data = [], 
    isLoading, 
    error, 
    refetch,
  } = useQuery({
    queryKey: ['documents', searchParams],
    queryFn: async () => {
      // Get the current user's company ID
      const { data: { user } } = await supabase.auth.getUser();
      const companyId = user?.user_metadata?.company_id;
      
      // These are the tables where we store document records based on entity type
      const tables = [
        'policy_documents',
        'claim_documents', 
        'sales_documents',
      ];
      
      let allDocuments: Document[] = [];
      
      // Query each table separately to avoid deep type issues
      for (const table of tables) {
        let query = supabase
          .from(table)
          .select('*');
        
        // Apply filters based on searchParams
        if (searchParams.searchTerm) {
          query = query.or(`document_name.ilike.%${searchParams.searchTerm}%,document_type.ilike.%${searchParams.searchTerm}%`);
        }
        
        if (searchParams.entityType && table === getDocumentTableName(searchParams.entityType) && searchParams.entityId) {
          if (table === 'policy_documents') {
            query = query.eq('policy_id', searchParams.entityId);
          } else if (table === 'claim_documents') {
            query = query.eq('claim_id', searchParams.entityId);
          } else if (table === 'sales_documents') {
            query = query.eq('sales_process_id', searchParams.entityId);
          }
        }
        
        if (searchParams.status) {
          query = query.eq('approval_status', searchParams.status);
        }
        
        if (searchParams.category) {
          query = query.eq('category', searchParams.category);
        }
        
        if (companyId) {
          query = query.eq('company_id', companyId);
        }
        
        // Order by most recent first
        query = query.order('created_at', { ascending: false });
        
        try {
          const { data, error } = await query;
          
          if (error) {
            console.error(`Error fetching from ${table}:`, error);
          } else if (data) {
            // Transform data to match the Document interface
            const documents = data.map((doc: any): Document => {
              let entityType: 'policy' | 'claim' | 'client' | 'invoice' | 'addendum' | 'sales_process' | 'agent' | 'insurer';
              let entityId: string;
              
              if ('policy_id' in doc && doc.policy_id) {
                entityType = 'policy';
                entityId = doc.policy_id;
              } else if ('claim_id' in doc && doc.claim_id) {
                entityType = 'claim';
                entityId = doc.claim_id;
              } else if ('sales_process_id' in doc && doc.sales_process_id) {
                entityType = 'sales_process';
                entityId = doc.sales_process_id;
              } else {
                entityType = 'policy'; // Default fallback
                entityId = '';
              }
              
              return {
                id: doc.id,
                document_name: doc.document_name,
                document_type: doc.document_type,
                created_at: doc.created_at,
                file_path: doc.file_path,
                entity_type: entityType,
                entity_id: entityId,
                uploaded_by_id: doc.uploaded_by || '',
                uploaded_by_name: '',
                description: doc.description || '',
                version: doc.version || 1,
                status: doc.status,
                tags: [],
                category: doc.category || 'other',
                approval_status: doc.approval_status,
                approved_at: doc.approved_at,
                approved_by: doc.approved_by,
                approval_notes: doc.approval_notes,
              };
            });
            
            allDocuments = [...allDocuments, ...documents];
          }
        } catch (queryError) {
          console.error(`Error in query for ${table}:`, queryError);
        }
      }
      
      return allDocuments;
    }
  });
  
  const searchDocuments = useCallback((params: DocumentSearchParams = {}) => {
    setSearchParams(params);
  }, []);
  
  // Mocked deleteDocument function that would be expanded in a real implementation
  const deleteDocument = async (documentId: string) => {
    console.log("Delete document function called with ID:", documentId);
    // This would be implemented with actual deletion logic
    await refetch();
    return { success: true };
  };
  
  return {
    documents: data as Document[],
    isLoading,
    error,
    searchDocuments,
    deleteDocument,
    refresh: refetch
  };
};
