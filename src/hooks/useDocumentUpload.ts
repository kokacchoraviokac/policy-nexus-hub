
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import { EntityType } from "./useDocuments";

interface UseDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string; // For creating new versions of existing documents
  currentVersion?: number; // For versioning
}

export const useDocumentUpload = ({ 
  entityType, 
  entityId, 
  onSuccess,
  originalDocumentId,
  currentVersion
}: UseDocumentUploadProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("document");
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Generate document types based on entity type
  const getDocumentTypes = () => {
    const commonTypes = [
      { value: "document", label: t("document") },
      { value: "contract", label: t("contract") },
      { value: "other", label: t("other") }
    ];
    
    const entitySpecificTypes: Record<EntityType, Array<{value: string, label: string}>> = {
      policy: [
        { value: "policy", label: t("policyDocument") },
        { value: "invoice", label: t("invoice") },
        { value: "certificate", label: t("certificate") },
        { value: "endorsement", label: t("endorsement") }
      ],
      claim: [
        { value: "claim_form", label: t("claimForm") },
        { value: "damage_report", label: t("damageReport") },
        { value: "invoice", label: t("invoice") },
        { value: "medical_report", label: t("medicalReport") }
      ],
      client: [
        { value: "id", label: t("identificationDocument") },
        { value: "contract", label: t("contract") },
        { value: "agreement", label: t("agreement") }
      ],
      insurer: [
        { value: "agreement", label: t("agreement") },
        { value: "contract", label: t("contract") },
        { value: "product_info", label: t("productInformation") }
      ],
      sales_process: [
        { value: "proposal", label: t("proposal") },
        { value: "quote", label: t("quote") },
        { value: "authorization", label: t("authorization") }
      ],
      agent: [
        { value: "contract", label: t("contract") },
        { value: "commission_agreement", label: t("commissionAgreement") }
      ]
    };
    
    // Combine common types with entity-specific types
    return [...entitySpecificTypes[entityType], ...commonTypes];
  };
  
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
    if (!file || !documentName || !documentType || !entityId || !entityType) {
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
      
      // Generate new document ID
      const documentId = originalDocumentId || uuidv4();
      
      // Determine the new version number
      const version = originalDocumentId ? (currentVersion || 0) + 1 : 1;
      
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Use entity type and ID in the file path for better organization
      const filePath = `${entityType}/${entityId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // If this is a new version, update any existing latest version
      if (originalDocumentId) {
        const { error: updateError } = await supabase
          .from('documents')
          .update({ is_latest_version: false })
          .eq('original_document_id', originalDocumentId)
          .eq('is_latest_version', true);
          
        if (updateError) throw updateError;
      }
      
      // Step 2: Create record in documents table
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          id: version === 1 ? documentId : uuidv4(),
          original_document_id: version === 1 ? null : documentId,
          entity_type: entityType,
          entity_id: entityId,
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          uploaded_by: userId,
          company_id: companyId,
          version: version,
          is_latest_version: true,
          mime_type: file.type,
          file_size: file.size,
          tags: tags.length > 0 ? tags : null
        });
      
      if (dbError) throw dbError;
      
      // Log activity
      logActivity({
        entityType: entityType,
        entityId: entityId,
        action: "update",
        details: { 
          action_type: originalDocumentId ? "document_version_upload" : "document_upload",
          document_name: documentName,
          document_type: documentType,
          version: version
        }
      });
      
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      
      toast({
        title: t("uploadSuccessful"),
        description: originalDocumentId 
          ? t("documentVersionUploadedSuccessfully", { version })
          : t("documentUploadedSuccessfully"),
      });
      
      // Reset state
      setDocumentName("");
      setDocumentType("document");
      setFile(null);
      setTags([]);
      
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
    tags,
    setTags,
    uploading,
    handleFileChange,
    handleUpload,
    documentTypes: getDocumentTypes()
  };
};
