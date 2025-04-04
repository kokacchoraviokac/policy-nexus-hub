
import { useState, useEffect } from "react";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { useQueryClient } from "@tanstack/react-query";

export interface DocumentSearchParams {
  entityType?: EntityType;
  entityId?: string;
  status?: DocumentApprovalStatus;
  searchText?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const useDocumentSearch = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const searchDocuments = async (params: DocumentSearchParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const { entityType, entityId, status, searchText, category, dateFrom, dateTo, sortBy, sortDirection } = params;

      if (entityType) {
        // We have a specific entity type, use the appropriate table
        const tableName = getDocumentTableName(entityType as EntityType);
        
        let query = supabase.from(tableName).select('*');
        
        // Apply filters
        if (entityId) {
          if (entityType === 'policy') {
            query = query.eq('policy_id', entityId);
          } else if (entityType === 'claim') {
            query = query.eq('claim_id', entityId);
          } else if (entityType === 'sales_process') {
            query = query.eq('sales_process_id', entityId);
          }
        }
        
        if (status) {
          query = query.eq('approval_status', status);
        }
        
        if (searchText) {
          query = query.ilike('document_name', `%${searchText}%`);
        }
        
        if (category) {
          query = query.eq('category', category);
        }
        
        if (dateFrom) {
          query = query.gte('created_at', dateFrom);
        }
        
        if (dateTo) {
          query = query.lte('created_at', dateTo);
        }
        
        // Apply sorting
        if (sortBy) {
          query = query.order(sortBy, { ascending: sortDirection === 'asc' });
        } else {
          query = query.order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setDocuments(data as unknown as Document[]);
      } else {
        // We need to search across all document types
        const entityTypes: EntityType[] = ['policy', 'claim', 'sales_process'];
        const allDocuments: Document[] = [];
        
        for (const type of entityTypes) {
          const tableName = getDocumentTableName(type);
          
          let query = supabase.from(tableName).select('*');
          
          // Apply filters
          if (status) {
            query = query.eq('approval_status', status);
          }
          
          if (searchText) {
            query = query.ilike('document_name', `%${searchText}%`);
          }
          
          if (category) {
            query = query.eq('category', category);
          }
          
          if (dateFrom) {
            query = query.gte('created_at', dateFrom);
          }
          
          if (dateTo) {
            query = query.lte('created_at', dateTo);
          }
          
          // Apply sorting
          if (sortBy) {
            query = query.order(sortBy, { ascending: sortDirection === 'asc' });
          } else {
            query = query.order('created_at', { ascending: false });
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          
          // Add entity_type to each document
          const docsWithType = (data || []).map(doc => ({
            ...doc,
            entity_type: type
          }));
          
          allDocuments.push(...(docsWithType as unknown as Document[]));
        }
        
        // Sort all documents if needed
        if (sortBy) {
          allDocuments.sort((a, b) => {
            // @ts-ignore - dynamically accessing properties
            const valueA = a[sortBy];
            // @ts-ignore - dynamically accessing properties
            const valueB = b[sortBy];
            
            if (sortDirection === 'asc') {
              return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
              return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
            }
          });
        } else {
          // Default sort by created_at desc
          allDocuments.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        }
        
        setDocuments(allDocuments);
      }
    } catch (error) {
      console.error("Error searching documents:", error);
      setError(error instanceof Error ? error : new Error("Unknown error occurred"));
      toast({
        title: t("errorSearchingDocuments"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    // Reuse the last search params
    await searchDocuments({});
  };

  // Initial search when the component mounts
  useEffect(() => {
    searchDocuments({});
  }, []);

  return {
    documents,
    isLoading,
    error,
    searchDocuments,
    refresh
  };
};
