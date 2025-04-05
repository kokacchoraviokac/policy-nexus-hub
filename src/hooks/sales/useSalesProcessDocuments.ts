
import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "@/services/DocumentService";
import { Document } from "@/types/documents";

/**
 * Hook to fetch documents for a specific sales process
 */
export const useSalesProcessDocuments = (salesProcessId: string) => {
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
        throw new Error(response.error?.message || "Failed to fetch documents");
      }
      
      // Here we make sure all required fields for Document type are present by casting
      return response.data as Document[];
    },
    enabled: !!salesProcessId,
  });
  
  // Get the total count of documents
  const documentsCount = documents?.length || 0;
  
  return {
    documents,
    isLoading,
    error,
    documentsCount
  };
};
