
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";

export interface PolicyDocument {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
}

export const usePolicyDocuments = (policyId: string) => {
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  
  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['policy-documents', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_documents')
        .select(`
          id,
          document_name,
          document_type,
          created_at,
          file_path,
          uploaded_by
        `)
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch uploader names
      const uploaderIds = data.map(doc => doc.uploaded_by).filter(Boolean);
      
      if (uploaderIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', uploaderIds);
          
        if (!profilesError && profiles) {
          const profileMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name;
            return acc;
          }, {} as Record<string, string>);
          
          // Attach uploader names to documents
          return data.map(doc => ({
            ...doc,
            uploaded_by_id: doc.uploaded_by,
            uploaded_by_name: doc.uploaded_by ? profileMap[doc.uploaded_by] || 'Unknown user' : 'System'
          }));
        }
      }
      
      return data.map(doc => ({
        ...doc,
        uploaded_by_id: doc.uploaded_by,
        uploaded_by_name: 'Unknown user'
      }));
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (document: PolicyDocument) => {
      // Delete from storage first
      if (document.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
          
        if (storageError) throw storageError;
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('policy_documents')
        .delete()
        .eq('id', document.id);
        
      if (dbError) throw dbError;
      
      return document;
    },
    onSuccess: (document) => {
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ['policy-documents', policyId] });
      
      // Log activity
      logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: { 
          action_type: "document_delete",
          document_name: document.document_name,
          document_id: document.id
        }
      });
      
      toast({
        title: "Document deleted",
        description: "Document was successfully deleted",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  });

  const downloadDocument = async (docItem: PolicyDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(docItem.file_path);
        
      if (error) throw error;
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = docItem.document_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      // Log activity
      logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: { 
          action_type: "document_download",
          document_name: docItem.document_name,
          document_id: docItem.id
        }
      });
      
      toast({
        title: "Download started",
        description: "Document download has started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    deleteDocument: deleteDocumentMutation.mutate,
    downloadDocument
  };
};
