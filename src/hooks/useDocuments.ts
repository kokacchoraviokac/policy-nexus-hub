
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, EntityType } from "@/types/documents";
import { getDocumentTableName, getEntityIdColumn, asTableName } from "@/utils/documentUploadUtils";
import { useToast } from "./use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export const useDocuments = (entityType: EntityType, entityId: string) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Function to fetch documents for the given entity
  const fetchDocuments = async (): Promise<Document[]> => {
    const tableName = getDocumentTableName(entityType);
    const entityIdColumn = getEntityIdColumn(entityType);
    
    const { data, error } = await supabase
      .from(asTableName(tableName))
      .select("*")
      .eq(entityIdColumn, entityId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Document[];
  };

  // useQuery hook to fetch documents
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: fetchDocuments,
  });

  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const tableName = getDocumentTableName(entityType);
      
      // First get the document to find file path
      const { data: document, error: fetchError } = await supabase
        .from(asTableName(tableName))
        .select("file_path")
        .eq("id", documentId)
        .single();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (!document) {
        throw new Error("Document not found");
      }
      
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([document.file_path]);
      
      if (storageError) {
        console.warn("Error deleting file from storage:", storageError);
        // Continue with deleting the record even if storage deletion fails
      }
      
      // Delete the document record
      const { error: deleteError } = await supabase
        .from(asTableName(tableName))
        .delete()
        .eq("id", documentId);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      return documentId;
    },
    onSuccess: (deletedId) => {
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccessfully"),
      });
      
      // Invalidate and refetch documents
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
    },
    onError: (error: Error) => {
      toast({
        title: t("errorDeletingDocument"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate document count
  const documentsCount = documents.length;

  return {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    documentsCount,
    deleteDocument: deleteDocumentMutation.mutate,
    isDeletingDocument: deleteDocumentMutation.isPending,
  };
};
