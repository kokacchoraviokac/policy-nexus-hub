
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EntityType, DocumentUploadOptions } from "@/types/documents";
import { getTableNameFromEntityType } from "@/utils/supabaseHelpers";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useDocumentUpload = (onSuccess?: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadDocument = async (options: DocumentUploadOptions) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload documents",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const {
        entityType,
        entityId,
        documentName,
        documentType,
        category,
        salesStage,
        originalDocumentId,
        file,
      } = options;

      // Generate a unique file path
      const fileExt = file.name.split(".").pop();
      const filePath = `${entityType}/${entityId}/${uuidv4()}.${fileExt}`;

      // Upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get document table name based on entity type
      const tableName = getTableNameFromEntityType(entityType);

      // Insert a record for the document
      const { data: documentData, error: documentError } = await supabase
        .from(tableName)
        .insert({
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          entity_id: entityId,
          entity_type: entityType,
          uploaded_by: user.id,
          company_id: user.companyId || user.company_id,
          mime_type: file.type,
          category,
          sales_stage: salesStage, // This is now supported in the type
          original_document_id: originalDocumentId,
          is_latest_version: true,
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
    uploadDocument,
    isUploading,
    progress,
  };
};
