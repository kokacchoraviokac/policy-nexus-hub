
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./use-toast";
import { DocumentApprovalStatus } from "@/types/documents";

export interface ApprovalInfo {
  id?: string;
  document_id: string;
  status: DocumentApprovalStatus;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
}

export function useDocumentApprovalInfo(documentId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<DocumentApprovalStatus>(DocumentApprovalStatus.PENDING);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvalInfo, setApprovalInfo] = useState<ApprovalInfo | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchApprovalInfo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("document_approvals")
          .select("*")
          .eq("document_id", documentId)
          .single();

        if (error && error.code !== "PGSQL_ERROR") {
          console.error("Error fetching approval info:", error);
          return;
        }

        if (data) {
          setApprovalInfo(data);
          setStatus(data.status as DocumentApprovalStatus);
          setNotes(data.notes || "");
        }
      } catch (error) {
        console.error("Error in fetchApprovalInfo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalInfo();
  }, [documentId]);

  const updateApprovalStatus = async (newStatus: DocumentApprovalStatus, notes: string = "") => {
    if (!user?.id || !documentId) return false;

    setLoading(true);
    try {
      const approvalData = {
        document_id: documentId,
        status: newStatus,
        notes: notes,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      };

      let result;
      if (approvalInfo?.id) {
        // Update existing approval
        result = await supabase
          .from("document_approvals")
          .update(approvalData)
          .eq("id", approvalInfo.id);
      } else {
        // Create new approval
        result = await supabase
          .from("document_approvals")
          .insert(approvalData);
      }

      if (result.error) {
        console.error("Error updating approval status:", result.error);
        toast({
          title: "Error",
          description: "Failed to update approval status",
          variant: "destructive",
        });
        return false;
      }

      // Also update the document's approval_status field
      const { error: docError } = await supabase
        .from("documents")
        .update({ approval_status: newStatus })
        .eq("id", documentId);

      if (docError) {
        console.error("Error updating document status:", docError);
      }

      // Update local state
      setStatus(newStatus);
      setNotes(notes);
      setApprovalInfo({
        ...approvalInfo,
        ...approvalData,
      });

      toast({
        title: "Success",
        description: `Document ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`,
      });

      return true;
    } catch (error) {
      console.error("Error in updateApprovalStatus:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    notes,
    loading,
    approvalInfo,
    updateApprovalStatus,
  };
}
