
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseDocumentUploadProps {
  policyId: string;
  onSuccess?: () => void;
}

export const useDocumentUpload = ({ policyId, onSuccess }: UseDocumentUploadProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("policy");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Set document name to file name if not already set
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0]);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType || !policyId) {
      toast({
        title: t("missingInformation"),
        description: t("pleaseProvideAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Get user info for company_id
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const companyId = userData.user?.user_metadata?.company_id;
      
      if (!userId || !companyId) {
        throw new Error("User authentication information missing");
      }
      
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `policies/${policyId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Step 2: Create record in policy_documents table
      const { error: dbError } = await supabase
        .from('policy_documents')
        .insert({
          policy_id: policyId,
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          uploaded_by: userId,
          company_id: companyId,
          version: 1
        });
      
      if (dbError) throw dbError;
      
      // Log activity
      logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: { 
          action_type: "document_upload",
          document_name: documentName,
          document_type: documentType
        }
      });
      
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ['policy-documents', policyId] });
      
      toast({
        title: t("uploadSuccessful"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Reset state
      setDocumentName("");
      setDocumentType("policy");
      setFile(null);
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t("uploadFailed"),
        description: error instanceof Error ? error.message : t("somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return {
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    file,
    setFile,
    uploading,
    handleFileChange,
    handleUpload
  };
};
