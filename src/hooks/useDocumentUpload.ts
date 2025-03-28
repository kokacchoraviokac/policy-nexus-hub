
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";

export type EntityType = "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";

interface UseDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
}

export const useDocumentUpload = ({ 
  entityType, 
  entityId, 
  onSuccess 
}: UseDocumentUploadProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("document");
  const [file, setFile] = useState<File | null>(null);
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
      
      // Generate document ID
      const documentId = uuidv4();
      
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Use entity type and ID in the file path for better organization
      const filePath = `${entityType}/${entityId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Step 2: Create record in appropriate documents table
      let tableError;
      if (entityType === 'policy') {
        // Use existing policy_documents table
        const { error } = await supabase
          .from('policy_documents')
          .insert({
            policy_id: entityId,
            document_name: documentName,
            document_type: documentType,
            file_path: filePath,
            uploaded_by: userId,
            company_id: companyId,
            version: 1
          });
        tableError = error;
      } else {
        // For other entity types, use their respective document tables
        // This is a placeholder - you would need to create these tables if they don't exist
        console.error("Document upload for entity type not yet implemented:", entityType);
        throw new Error(`Document upload for ${entityType} is not yet fully implemented`);
      }
      
      if (tableError) throw tableError;
      
      // Log activity
      logActivity({
        entityType: entityType as "policy" | "claim" | "client" | "insurer" | "agent",
        entityId: entityId,
        action: "update",
        details: { 
          action_type: "document_upload",
          document_name: documentName,
          document_type: documentType
        }
      });
      
      // Refresh documents list
      if (entityType === 'policy') {
        queryClient.invalidateQueries({ queryKey: ['policy-documents', entityId] });
      }
      
      toast({
        title: t("uploadSuccessful"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Reset state
      setDocumentName("");
      setDocumentType("document");
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
    tags: [], // Added for compatibility with future implementations
    setTags: (tags: string[]) => {}, // Added for compatibility with future implementations
    uploading,
    handleFileChange,
    handleUpload,
    documentTypes: getDocumentTypes()
  };
};
