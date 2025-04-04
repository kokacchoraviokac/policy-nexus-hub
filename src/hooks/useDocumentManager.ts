
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Document, DocumentApprovalStatus } from '@/types/documents';
import { DocumentService } from '@/services/DocumentService';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useDocumentManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const approveDocument = async (
    document: Document, 
    status: DocumentApprovalStatus, 
    notes?: string
  ) => {
    if (!document || !document.id) {
      return { success: false };
    }
    
    setIsLoading(true);
    
    try {
      const result = await DocumentService.approveDocument(
        document.id, 
        status,
        notes || ''
      );
      
      if (!result.success) {
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : result.error && typeof result.error === 'object' && 'message' in result.error
            ? String(result.error.message)
            : t('errorApprovingDocument');
            
        toast.error(errorMsg);
        return { success: false };
      }
      
      // Show appropriate message based on status
      if (status === 'approved') {
        toast.success(t('documentApproved'));
      } else if (status === 'rejected') {
        toast.success(t('documentRejected'));
      } else {
        toast.success(t('documentStatusUpdated'));
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      return { success: true };
    } catch (error) {
      console.error('Error approving document:', error);
      
      toast.error(t('errorProcessingDocument'));
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!documentId) {
      return { success: false };
    }
    
    setIsLoading(true);
    
    try {
      const result = await DocumentService.deleteDocument(documentId);
      
      if (!result.success) {
        toast.error(t('errorDeletingDocument'));
        return { success: false };
      }
      
      toast.success(t('documentDeleted'));
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      
      toast.error(t('errorDeletingDocument'));
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    approveDocument,
    deleteDocument
  };
};
