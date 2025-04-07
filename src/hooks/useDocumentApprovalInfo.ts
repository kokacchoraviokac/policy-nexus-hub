
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentApprovalStatus, ApprovalInfo } from "@/types/documents";
import { useActivityLogger } from "@/utils/activityLogger";

interface UseDocumentApprovalInfoProps {
  documentId: string;
}

export function useDocumentApprovalInfo({ documentId }: UseDocumentApprovalInfoProps) {
  const [approvalInfo, setApprovalInfo] = useState<ApprovalInfo>({
    document_id: documentId,
    status: DocumentApprovalStatus.PENDING,
    notes: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { logActivity } = useActivityLogger();
  
  useEffect(() => {
    if (!documentId) return;
    
    async function fetchApprovalInfo() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Using activity logs to fetch approval info since we don't have a dedicated table
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('entity_id', documentId)
          .eq('action', 'update')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const latestActivity = data[0];
          const details = latestActivity.details;
          
          if (details && details.action_type && details.action_type.startsWith('document_')) {
            const status = details.action_type.replace('document_', '') as DocumentApprovalStatus;
            setApprovalInfo({
              document_id: documentId,
              status: status,
              notes: details.notes || ""
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch approval info'));
        console.error("Error fetching document approval info:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchApprovalInfo();
  }, [documentId]);
  
  const updateApprovalStatus = async (status: DocumentApprovalStatus, notes?: string) => {
    if (!documentId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Log the approval activity
      await logActivity({
        entity_type: 'policy', // TODO: This should be dynamic based on document entity type
        entity_id: documentId,
        action: 'update',
        details: {
          action_type: `document_${status}`,
          document_id: documentId,
          notes: notes || null,
          status
        }
      });
      
      // Update local state
      setApprovalInfo({
        document_id: documentId,
        status,
        notes: notes || ""
      });
      
      // In a real implementation, you would update the document's approval_status here
      // Since we don't have direct access to update document tables,
      // we'll use activity logs as our source of truth
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update approval status'));
      console.error("Error updating document approval status:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    approvalInfo,
    isLoading,
    error,
    updateApprovalStatus
  };
}
