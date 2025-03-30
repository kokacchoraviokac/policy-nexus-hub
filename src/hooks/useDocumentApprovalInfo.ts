
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DocumentApprovalStatus, Document } from "@/types/documents";

// Define activity log details interface
interface ApprovalActivityDetails {
  document_id?: string;
  action_type?: string;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
}

// Define activity log row type
interface ActivityLogRow {
  id: string;
  user_id: string;
  created_at: string;
  details: ApprovalActivityDetails;
}

export interface ApprovalInfo {
  status: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
}

export const useDocumentApprovalInfo = (document: Document) => {
  const [approvalInfo, setApprovalInfo] = useState<ApprovalInfo>({
    status: document.approval_status || "pending",
    approved_by: document.approved_by,
    approved_at: document.approved_at,
    notes: document.approval_notes
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchApprovalInfo = async () => {
      if (!document.entity_type || !document.entity_id || !document.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the activity logs directly
        const { data, error } = await supabase
          .from('activity_logs')
          .select('id, user_id, created_at, details')
          .eq('entity_type', document.entity_type)
          .eq('entity_id', document.entity_id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          throw new Error(`Error fetching approval info: ${error.message}`);
        }
        
        // Type-safe filtering of logs in JavaScript
        if (data && data.length > 0) {
          // Safe type assertion
          const activityLogs = data as ActivityLogRow[];
          
          // Find relevant approval logs
          const filteredLogs = activityLogs.filter(log => {
            const details = log.details as ApprovalActivityDetails;
            return details && 
                  details.action_type === 'document_approval' && 
                  details.document_id === document.id;
          });
          
          if (filteredLogs.length > 0) {
            const latestApproval = filteredLogs[0];
            const details = latestApproval.details as ApprovalActivityDetails;
            
            setApprovalInfo({
              status: details.approval_status || "pending",
              approved_by: latestApproval.user_id,
              approved_at: latestApproval.created_at,
              notes: details.notes
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error in fetchApprovalInfo:", errorMessage);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovalInfo();
  }, [document, document.entity_type, document.entity_id, document.id]);
  
  return { approvalInfo, setApprovalInfo, loading, error };
};
