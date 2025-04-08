
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ApprovalStatus, DocumentApprovalStatus, EntityType } from '@/types/common';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getDocumentTableName } from '@/utils/documentUploadUtils';

interface ApprovalUpdateParams {
  documentId: string;
  entityType: EntityType;
  status: DocumentApprovalStatus;
  notes?: string;
}

export const useDocumentApproval = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const updateApprovalStatus = async ({
    documentId,
    entityType,
    status,
    notes = ''
  }: ApprovalUpdateParams) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to approve documents",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    setError(null);
    
    try {
      // Get the appropriate table name based on entity type
      const tableName = getDocumentTableName(entityType);
      
      // For safety, handle it with runtime type checking
      if (typeof tableName !== 'string') {
        throw new Error('Invalid table name');
      }
      
      // Update the document with the new approval status using a valid table name
      // Cast to 'any' to bypass the TypeScript error about dynamic table names
      const { error: updateError } = await (supabase
        .from(tableName as any)
        .update({
          approval_status: status,
          approval_notes: notes,
          approved_at: status === ApprovalStatus.APPROVED ? new Date().toISOString() : null,
          approved_by: status === ApprovalStatus.APPROVED ? user.id : null
        })
        .eq('id', documentId));
      
      if (updateError) throw updateError;
      
      // Log the approval action
      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          entity_id: documentId,
          entity_type: 'document',
          action: status === ApprovalStatus.APPROVED ? 'approve' : 'reject',
          user_id: user.id,
          company_id: user.company_id,
          details: {
            status,
            notes,
            timestamp: new Date().toISOString()
          }
        });
      
      if (logError) throw logError;
      
      // Show a success message
      toast({
        title: status === ApprovalStatus.APPROVED ? "Document approved" : "Document rejected",
        description: status === ApprovalStatus.APPROVED 
          ? "The document has been successfully approved" 
          : "The document has been rejected",
        variant: status === ApprovalStatus.APPROVED ? "default" : "destructive"
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error updating document approval status:', err);
      setError(err as Error);
      
      toast({
        title: "Error updating document",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      return { success: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    updateApprovalStatus,
    isUpdating,
    error
  };
};
