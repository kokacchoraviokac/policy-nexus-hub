
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EntityType, DocumentUploadOptions } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentCategory } from "@/types/documents";

interface UseDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string;
  currentVersion?: number;
}

export const useDocumentUpload = ({ entityType, entityId, onSuccess, originalDocumentId, currentVersion }: UseDocumentUploadProps) => {
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | string>("");
  const [file, setFile] = useState<File | null>(null);
  const [salesStage, setSalesStage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    
    // Auto-fill name if not already set
    if (newFile && !documentName) {
      setDocumentName(newFile.name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !documentName || !documentType) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Generate a unique file path
      const fileExt = file.name.split(".").pop();
      const filePath = `${entityType}/${entityId}/${uuidv4()}.${fileExt}`;

      // Upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get document table name based on entity type
      const tableName = getDocumentTableName(entityType);

      // Insert a record for the document
      const { data: documentData, error: documentError } = await supabase
        .from(tableName)
        .insert({
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          entity_id: entityId,
          entity_type: entityType,
          uploaded_by: user?.id,
          company_id: user?.company_id || user?.companyId,
          mime_type: file.type,
          category: documentCategory,
          sales_stage: salesStage,
          original_document_id: originalDocumentId,
          is_latest_version: true,
          version: currentVersion ? currentVersion + 1 : 1
        })
        .select()
        .single();

      if (documentError) {
        throw documentError;
      }

      // If this is a new version, update the previous version
      if (originalDocumentId) {
        await supabase
          .from(tableName)
          .update({ is_latest_version: false })
          .eq("id", originalDocumentId);
      }

      toast({
        title: "Document Uploaded",
        description: "Document has been uploaded successfully.",
      });

      // Clear form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
      setSalesStage(null);
      
      if (onSuccess) {
        onSuccess();
      }

      return documentData;
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred while uploading the document.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    documentCategory,
    setDocumentCategory,
    file,
    handleFileChange,
    uploading: isUploading,
    progress,
    handleUpload,
    setSalesStage
  };
};
