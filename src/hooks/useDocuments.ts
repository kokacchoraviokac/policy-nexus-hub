
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, EntityType } from "@/types/documents";
import { useAuth } from "@/contexts/auth/AuthContext";
import { getDocumentTableName, DocumentTableName } from "@/utils/documentUploadUtils";

// Update the function signature to accept two parameters
export const useDocuments = (entityType: EntityType, entityId: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const tableName = getDocumentTableName(entityType);
  
  // Fetch all documents for the given entity
  const fetchDocuments = async (): Promise<Document[]> => {
    // Handle each document table type with its specific entity ID field
    let query;
    if (tableName === "policy_documents") {
      query = supabase
        .from(tableName)
        .select("*")
        .eq("policy_id", entityId);
    } else if (tableName === "claim_documents") {
      query = supabase
        .from(tableName)
        .select("*")
        .eq("claim_id", entityId);
    } else if (tableName === "sales_documents") {
      query = supabase
        .from(tableName)
        .select("*")
        .eq("sales_process_id", entityId);
    } else {
      // This should not happen with our current implementation
      throw new Error(`Unsupported document table: ${tableName}`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    // Map the data to our Document type based on the table type
    return (data || []).map((item: any) => {
      let mappedEntityId = "";
      
      if (tableName === "policy_documents") {
        mappedEntityId = item.policy_id;
      } else if (tableName === "claim_documents") {
        mappedEntityId = item.claim_id;
      } else if (tableName === "sales_documents") {
        mappedEntityId = item.sales_process_id;
      }
      
      return {
        id: item.id,
        document_name: item.document_name,
        document_type: item.document_type,
        created_at: item.created_at,
        file_path: item.file_path,
        entity_type: entityType,
        entity_id: mappedEntityId,
        uploaded_by_id: item.uploaded_by,
        uploaded_by_name: "", // We'll populate this if needed
        description: item.description || "",
        version: item.version || 1,
        status: item.status || "active",
        tags: item.tags || [],
        category: item.category || "other",
        mime_type: item.mime_type || "",
        is_latest_version: item.is_latest_version || true,
        original_document_id: item.original_document_id || null,
        approval_status: item.approval_status || "pending"
      } as Document;
    });
  };

  // Delete document mutation - use the correct table based on entity type
  const deleteDocument = async (documentId: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", documentId);

    if (error) throw error;
    return { success: true };
  };

  // Use react-query for data fetching
  const documentsQuery = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: fetchDocuments,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccessfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("errorDeletingDocument"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });

  return {
    ...documentsQuery,
    documents: documentsQuery.data || [],
    deleteDocument: deleteMutation.mutate,
    isDeletingDocument: deleteMutation.isPending,
  };
};
