import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, EntityType } from "@/types/documents";
import { useAuth } from "@/contexts/auth/AuthContext";
import { getDocumentTableName, DocumentTableName } from "@/utils/documentUploadUtils";
import { queryDocuments } from "@/utils/supabaseQueryHelper";

export const useDocuments = (entityType: EntityType, entityId: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const tableName = getDocumentTableName(entityType);
  
  const transformDocument = (doc: any): Document => {
    return {
      id: doc.id,
      document_name: doc.document_name,
      document_type: doc.document_type,
      file_path: doc.file_path,
      entity_type: doc.entity_type,
      entity_id: doc.entity_id,
      uploaded_by: doc.uploaded_by_id || doc.uploaded_by,
      uploaded_by_name: doc.uploaded_by_name,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      mime_type: doc.mime_type,
      category: doc.category,
      version: doc.version,
      is_latest_version: doc.is_latest_version,
      original_document_id: doc.original_document_id,
      approval_status: doc.approval_status,
      company_id: doc.company_id,
      description: doc.description,
    } as Document;
  };

  const fetchDocuments = async (): Promise<Document[]> => {
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
      throw new Error(`Unsupported document table: ${tableName}`);
    }
    
    const { data, error } = await queryDocuments(entityType).select('*');

    if (error) throw error;

    return (data || []).map(transformDocument);
  };

  const deleteDocument = async (documentId: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", documentId);

    if (error) throw error;
    return { success: true };
  };

  const documentsQuery = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: fetchDocuments,
  });

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
