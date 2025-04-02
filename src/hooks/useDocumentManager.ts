
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { DocumentService } from "@/services/DocumentService";
import { useState } from "react";

interface UseDocumentManagerProps {
  entityType: EntityType;
  entityId: string;
}

interface UploadDocumentParams {
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
  file: File;
  originalDocumentId?: string;
  currentVersion?: number;
  additionalData?: Record<string, any>;
}

export const useDocumentManager = ({ entityType, entityId }: UseDocumentManagerProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  // Document upload state
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | "">("");
  const [file, setFile] = useState<File | null>(null);

  // Query to fetch documents
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: () => DocumentService.fetchDocuments(entityType, entityId),
    enabled: !!entityId,
  });

  // Mutation for document upload
  const uploadMutation = useMutation({
    mutationFn: async (params: UploadDocumentParams) => {
      const result = await DocumentService.uploadDocument({
        file: params.file,
        documentName: params.documentName,
        documentType: params.documentType,
        category: params.category,
        entityId,
        entityType,
        originalDocumentId: params.originalDocumentId,
        currentVersion: params.currentVersion,
        additionalData: params.additionalData
      });
      
      if (!result.success) {
        throw new Error(result.error || t("documentUploadFailed"));
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("documentUploadFailed"),
        description: error.message || t("errorOccurredWhileUploading"),
        variant: "destructive",
      });
    }
  });

  // Mutation for document deletion
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => DocumentService.deleteDocument(entityType, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
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
    }
  });

  // Function to handle uploading a document
  const uploadDocument = (params: UploadDocumentParams) => {
    uploadMutation.mutate(params);
  };

  // Handle file selection
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    
    // Auto-fill name if not already set and a file is selected
    if (newFile && !documentName) {
      setDocumentName(newFile.name.split('.')[0]);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setDocumentName("");
    setDocumentType("");
    setDocumentCategory("");
    setFile(null);
  };

  // Submit form
  const handleSubmit = (additionalData?: Record<string, any>) => {
    if (!file || !documentName || !documentType) {
      toast({
        title: t("missingRequiredFields"),
        description: t("pleaseCompleteAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    uploadDocument({
      file,
      documentName,
      documentType,
      category: documentCategory || "other",
      additionalData
    });
    resetForm();
  };

  return {
    // Document list data
    documents,
    isLoading,
    isError,
    error,
    refetch,
    
    // Document actions
    uploadDocument,
    deleteDocument: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Form state management
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    documentCategory,
    setDocumentCategory,
    file,
    setFile,
    handleFileChange,
    handleSubmit,
    resetForm,

    // Validation
    isFormValid: !!file && !!documentName && !!documentType
  };
};
