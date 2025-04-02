
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory } from "@/types/documents";

export const useSalesProcessDocuments = (salesProcessId: string) => {
  const fetchDocuments = async (): Promise<Document[]> => {
    const { data, error } = await supabase
      .from("sales_documents")
      .select("*")
      .eq("sales_process_id", salesProcessId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      document_name: item.document_name,
      document_type: item.document_type,
      created_at: item.created_at,
      file_path: item.file_path,
      entity_type: "sales_process",
      entity_id: item.sales_process_id,
      uploaded_by_id: item.uploaded_by,
      uploaded_by_name: "", // We can populate this if needed
      // Handle missing properties with default values
      description: "", // Default empty string for description
      version: item.version || 1,
      status: "active", // Default status
      tags: [], // Default empty array for tags
      // Explicitly cast category to DocumentCategory to ensure type compatibility
      category: (item.category || "other") as DocumentCategory,
      mime_type: item.mime_type || "",
      is_latest_version: item.is_latest_version || true,
      original_document_id: item.original_document_id || null,
      step: item.step || "",
      approval_status: "pending" // Default approval status
    }));
  };
  
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["sales-documents", salesProcessId],
    queryFn: fetchDocuments,
  });
  
  return {
    documents: documents || [],
    isLoading,
    error,
    documentsCount: documents?.length || 0
  };
};
