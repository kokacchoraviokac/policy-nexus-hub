
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EntityType } from "@/utils/activityLogger";

// Export the type for proper isolated modules support
export type { EntityType };

// Define specific table names to avoid type inference issues
export type DocumentTableName = "policy_documents" | "claim_documents" | "sales_documents";

// Define a base document interface with common fields
export interface DocumentBase {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  uploaded_by: string;
}

// Define specific document types for different tables
export interface PolicyDocument extends DocumentBase {
  policy_id?: string;
  addendum_id?: string;
  version: number;
  company_id: string;
  updated_at: string;
  mime_type?: string;
}

export interface ClaimDocument extends DocumentBase {
  claim_id: string;
  company_id: string;
  updated_at: string;
}

export interface SalesDocument extends DocumentBase {
  sales_process_id: string;
  company_id: string;
  updated_at: string;
  step?: string;
}

// Union type for all document types from DB
export type DocumentDbRow = PolicyDocument | ClaimDocument | SalesDocument;

// Frontend document model
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type?: EntityType;
  entity_id?: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  file_size?: number;
  tags?: string[];
}

export interface UseDocumentsProps {
  entityType: EntityType;
  entityId: string;
  enabled?: boolean;
}

// Helper function to get document table name
const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case "policy":
      return "policy_documents";
    case "claim":
      return "claim_documents";
    case "sales_process":
      return "sales_documents";
    default:
      return "policy_documents"; // fallback
  }
};

// Helper function to map DB row to Document interface
const mapDocumentToModel = (doc: any, entityType: EntityType, entityId: string): Document => {
  return {
    id: doc.id,
    document_name: doc.document_name,
    document_type: doc.document_type,
    created_at: doc.created_at,
    file_path: doc.file_path,
    entity_type: entityType,
    entity_id: entityId,
    uploaded_by_id: doc.uploaded_by,
    uploaded_by_name: "Unknown", // We'll fetch this separately if needed
    version: doc.version || 1,
    is_latest_version: true,
    mime_type: doc.mime_type
  };
};

export const useDocuments = ({
  entityType,
  entityId,
  enabled = true
}: UseDocumentsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  // Get the appropriate document table name
  const documentTable = getDocumentTableName(entityType);
  
  // Fetch documents for a specific entity
  const {
    data: documents,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: async (): Promise<Document[]> => {
      try {
        // Create the field name dynamically based on entity type
        const fieldName = `${entityType}_id`;
        
        // Break the chain to avoid deep type recursion - use type assertion
        const tableQuery = supabase.from(documentTable);
        
        // Need to cast as any to avoid TypeScript recursion
        const query = tableQuery as any;
        
        // Apply the filter with proper type casting
        const { data, error } = await query
          .select("*")
          .eq(fieldName, entityId)
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (!data) return [];
        
        // Transform the response to match our Document interface
        return data.map((doc: any) => mapDocumentToModel(doc, entityType, entityId));
        
      } catch (err) {
        console.error("Error fetching documents:", err);
        throw err;
      }
    },
    enabled: enabled && !!entityType && !!entityId
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      try {
        // First, get document details to delete the storage file
        const tableQuery = supabase.from(documentTable);
        const query = tableQuery as any;
        
        // Get document details
        const { data, error: fetchError } = await query
          .select("*")
          .eq("id", documentId)
          .single();
          
        if (fetchError || !data) {
          throw new Error("Document not found");
        }
        
        // Delete file from storage
        if (data.file_path) {
          const { error: storageError } = await supabase.storage
            .from("documents")
            .remove([data.file_path]);
            
          if (storageError) {
            throw storageError;
          }
        }
        
        // Delete document record - avoid deep type recursion with intermediate variable
        const deleteQueryBase = supabase.from(documentTable);
        const deleteQuery = deleteQueryBase as any;
        
        const { error: dbError } = await deleteQuery
          .delete()
          .eq("id", documentId);
          
        if (dbError) {
          throw dbError;
        }
        
        // Log activity
        await logActivity({
          entityType,
          entityId,
          action: "update",
          details: {
            action_type: "document_deleted",
            document_id: documentId,
            document_name: data.document_name
          }
        });
        
        return documentId;
      } catch (err) {
        console.error("Error deleting document:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast({
        title: t("documentDeleteError"),
        description: t("documentDeleteErrorMessage"),
        variant: "destructive",
      });
    },
  });
  
  // Handle document deletion
  const deleteDocument = async (documentId: string) => {
    if (!documentId) return;
    await deleteDocumentMutation.mutateAsync(documentId);
  };
  
  return {
    documents,
    isLoading,
    error,
    refetch,
    deleteDocument,
    isDeletingDocument: deleteDocumentMutation.isPending
  };
};
