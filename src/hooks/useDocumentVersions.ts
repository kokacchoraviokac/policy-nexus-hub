
import { useQuery } from "@tanstack/react-query";
import { Document } from "@/types/documents";
import { getDocumentVersions } from "@/services/DocumentVersionsService";

export interface UseDocumentVersionsProps {
  documentId: string;
  originalDocumentId?: string;
  enabled?: boolean;
}

export const useDocumentVersions = ({ 
  documentId, 
  originalDocumentId,
  enabled = true 
}: UseDocumentVersionsProps) => {
  
  const {
    data: versions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['document-versions', originalDocumentId || documentId],
    queryFn: async () => getDocumentVersions(documentId, originalDocumentId),
    enabled: enabled && !!documentId
  });
  
  return {
    versions,
    isLoading,
    error,
    hasMultipleVersions: versions.length > 1
  };
};
