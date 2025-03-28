
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import { EntityType } from "@/utils/activityLogger";

// Export the EntityType as a type for proper isolated modules support
export type { EntityType };

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

export const useDocuments = ({
  entityType,
  entityId,
  enabled = true
}: UseDocumentsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  // Map entity type to appropriate document table
  const getDocumentTable = () => {
    switch (entityType) {
      case "policy":
        return "policy_documents";
      case "claim":
        return "claim_documents";
      case "sales_process":
        return "sales_documents";
      default:
        return "policy_documents"; // fallback to policy_documents
    }
  };
  
  const documentTable = getDocumentTable();
  
  // Fetch documents for a specific entity
  const {
    data: documents,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: async () => {
      try {
        // Use the appropriate table based on entity type
        const { data, error: fetchError } = await supabase
          .from(documentTable)
          .select("*")
          .eq(entityType + "_id", entityId)
          .order("created_at", { ascending: false });
        
        if (fetchError) {
          throw fetchError;
        }
        
        // Transform the response to match our Document interface
        return (data as any[]).map((doc: any) => ({
          id: doc.id,
          document_name: doc.document_name,
          document_type: doc.document_type,
          created_at: doc.created_at,
          file_path: doc.file_path,
          entity_type: entityType,
          entity_id: entityId,
          uploaded_by_id: doc.uploaded_by,
          uploaded_by_name: doc.uploaded_by_name || "Unknown",
          version: doc.version || 1,
          is_latest_version: true
        })) as Document[];
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
        const { data: documentData, error: docError } = await supabase
          .from(documentTable)
          .select("*")
          .eq("id", documentId)
          .single();
          
        if (docError || !documentData) {
          throw new Error("Document not found");
        }
        
        // Delete file from storage
        if (documentData.file_path) {
          const { error: storageError } = await supabase.storage
            .from("documents")
            .remove([documentData.file_path]);
            
          if (storageError) {
            throw storageError;
          }
        }
        
        // Delete document record
        const { error: dbError } = await supabase
          .from(documentTable)
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
            document_name: documentData.document_name
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
