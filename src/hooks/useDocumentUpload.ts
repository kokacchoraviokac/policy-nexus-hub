
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUploadRequest, EntityType } from "@/types/documents";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { v4 as uuidv4 } from "uuid";

export const useDocumentUpload = (entityType: EntityType) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (requestData: DocumentUploadRequest) => {
      if (!user) throw new Error("User not authenticated");
      
      // 1. Upload file to storage
      const fileExt = requestData.file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${entityType}/${requestData.entity_id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, requestData.file);
      
      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        throw uploadError;
      }
      
      // 2. Create document record in database
      let tableName = '';
      
      switch (entityType) {
        case 'policy':
          tableName = 'policy_documents';
          break;
        case 'claim':
          tableName = 'claim_documents';
          break;
        case 'client':
          tableName = 'client_documents';
          break;
        case 'invoice':
          tableName = 'invoice_documents';
          break;
        case 'addendum':
          tableName = 'addendum_documents';
          break;
        default:
          throw new Error(`Unsupported entity type: ${entityType}`);
      }
      
      const { error: dbError } = await supabase
        .from(tableName)
        .insert({
          document_name: requestData.document_name,
          document_type: requestData.document_type,
          file_path: filePath,
          entity_id: requestData.entity_id,
          uploaded_by_id: user.id,
          description: requestData.description,
          tags: requestData.tags,
          category: requestData.category,
          version: 1,
          status: 'active'
        });
      
      if (dbError) {
        console.error("Error creating document record:", dbError);
        
        // Try to clean up the uploaded file on db error
        await supabase.storage
          .from('documents')
          .remove([filePath]);
          
        throw dbError;
      }
      
      return { success: true, filePath };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documents', entityType, variables.entity_id]
      });
    }
  });
};

export default useDocumentUpload;
