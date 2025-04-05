
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/services/DocumentService";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { getErrorMessage } from "@/utils/errorHandling";
import { toast } from "sonner";

/**
 * Hook to fetch documents for a specific sales process
 */
export const useSalesProcessDocuments = (salesProcessId: string) => {
  const queryClient = useQueryClient();
  
  const {
    data: documents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sales-documents', salesProcessId],
    queryFn: async () => {
      const response = await DocumentService.getDocuments('sales_process', salesProcessId);
      if (!response.success) {
        throw new Error(getErrorMessage(response.error) || "Failed to fetch documents");
      }
      
      // Here we make sure all required fields for Document type are present by casting
      return response.data as Document[];
    },
    enabled: !!salesProcessId,
  });
  
  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await DocumentService.deleteDocument(documentId, 'sales_process');
      if (!response.success) {
        throw new Error(getErrorMessage(response.error) || "Failed to delete document");
      }
      return documentId;
    },
    onSuccess: () => {
      toast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['sales-documents', salesProcessId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to delete document");
    }
  });
  
  // Update document approval mutation
  const approvalMutation = useMutation({
    mutationFn: async ({ documentId, status, notes }: { 
      documentId: string; 
      status: DocumentApprovalStatus; 
      notes?: string 
    }) => {
      // Assuming this method exists in DocumentService
      const response = await DocumentService.updateDocumentApproval(
        documentId,
        'sales_process',
        status,
        notes || "",
        "current-user-id" // This should be replaced with the actual user ID
      );
      
      if (!response.success) {
        throw new Error(getErrorMessage(response.error) || "Failed to update document status");
      }
      
      return response.data;
    },
    onSuccess: () => {
      toast.success("Document status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['sales-documents', salesProcessId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to update document status");
    }
  });
  
  // Get the total count of documents
  const documentsCount = documents?.length || 0;
  
  return {
    documents,
    isLoading,
    error,
    documentsCount,
    refetch,
    deleteDocument: deleteMutation.mutate,
    isDeletingDocument: deleteMutation.isPending,
    updateDocumentApproval: approvalMutation.mutate,
    isApproving: approvalMutation.isPending,
    isError: !!error
  };
};
