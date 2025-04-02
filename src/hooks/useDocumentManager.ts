
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { documentService } from "@/services/DocumentService";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { useState } from "react";

export interface DocumentUploadOptions {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

export interface DocumentUploadParams {
  documentName: string;
  documentType: string;
  documentCategory: DocumentCategory | string;
  salesStage?: string;
  file: File | null;
}

export const useDocumentManager = (
  entityType: EntityType,
  entityId: string
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const tableName = getDocumentTableName(entityType);
  
  // Document upload state
  const [documentName, setDocumentName] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | string>("");
  const [salesStage, setSalesStage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Fetch documents
  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: () => documentService.fetchDocuments(entityType, entityId),
  });

  // Delete document
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => 
      documentService.deleteDocument(documentId, tableName),
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

  // Upload document
  const uploadMutation = useMutation({
    mutationFn: async ({
      documentName,
      documentType,
      documentCategory,
      salesStage,
      file,
      originalDocumentId,
      currentVersion
    }: DocumentUploadParams & {
      originalDocumentId?: string | null;
      currentVersion?: number;
    }) => {
      if (!file) throw new Error("No file selected");
      
      setUploading(true);
      
      try {
        const result = await documentService.uploadDocument({
          file,
          documentName,
          documentType,
          category: documentCategory.toString(),
          entityId,
          entityType,
          originalDocumentId,
          currentVersion,
          step: salesStage
        });
        
        if (!result.success) {
          throw new Error(result.error as any);
        }
        
        return result;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      
      // Also invalidate sales-documents query if it's a sales process document
      if (entityType === 'sales_process') {
        queryClient.invalidateQueries({
          queryKey: ['sales-documents', entityId]
        });
      }
      
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setSalesStage("");
      setFile(null);
    },
    onError: (error: any) => {
      toast({
        title: t("errorUploadingDocument"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Download document
  const downloadMutation = useMutation({
    mutationFn: (document: Document) => 
      documentService.downloadDocument(document),
    onError: (error: any) => {
      toast({
        title: t("downloadFailed"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });

  // Handle document upload with form state management
  const handleUpload = (
    originalDocumentId?: string | null,
    currentVersion?: number
  ) => {
    if (!file) {
      toast({
        title: t("noFileSelected"),
        description: t("pleaseSelectFileToUpload"),
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      documentName,
      documentType,
      documentCategory,
      salesStage,
      file,
      originalDocumentId,
      currentVersion
    });
  };

  const isUploadValid = !!file && !!documentName && !!documentType;

  return {
    // Document list state
    documents: documents || [],
    isLoading,
    isError,
    error,
    refetch,
    documentsCount: documents?.length || 0,
    
    // Document actions
    deleteDocument: (documentId: string) => deleteMutation.mutate(documentId),
    isDeletingDocument: deleteMutation.isPending,
    downloadDocument: (document: Document) => downloadMutation.mutate(document),
    isDownloading: downloadMutation.isPending,
    
    // Form state
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    documentCategory,
    setDocumentCategory,
    salesStage,
    setSalesStage,
    file,
    setFile,
    
    // Upload state and actions
    uploading,
    handleUpload,
    isUploadValid,
    uploadError: uploadMutation.error
  };
};
