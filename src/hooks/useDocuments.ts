
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";

export type EntityType = "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
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
        // This is a placeholder query. In a real implementation,
        // you would need to ensure the documents table exists in your database
        const { data, error: fetchError } = await supabase
          .from("documents")
          .select("*")
          .eq("entity_type", entityType)
          .eq("entity_id", entityId)
          .eq("is_latest_version", true)
          .order("created_at", { ascending: false });
        
        if (fetchError) {
          throw fetchError;
        }
        
        return data as Document[];
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
        const { data: documentData } = await supabase
          .from("documents")
          .select("*")
          .eq("id", documentId)
          .single();
          
        if (!documentData) {
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
          .from("documents")
          .delete()
          .eq("id", documentId);
          
        if (dbError) {
          throw dbError;
        }
        
        // Log activity
        await logActivity({
          entityType,
          entityId,
          action: "document_deleted",
          details: {
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
