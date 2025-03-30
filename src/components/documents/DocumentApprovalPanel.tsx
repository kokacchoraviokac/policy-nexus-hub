
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentApproval } from "@/hooks/useDocumentApproval";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Clock,
  ShieldCheck,
  ShieldX,
  ShieldQuestion,
  FileQuestion
} from "lucide-react";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DocumentApprovalPanelProps {
  document: Document;
  onApprovalComplete?: () => void;
}

// Define a type for activity log details that doesn't use recursive types
interface ApprovalDetails {
  approval_status?: DocumentApprovalStatus;
  document_id?: string;
  action_type?: string;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
}

// Define a type for activity log row
interface ActivityLogRow {
  id: string;
  user_id: string;
  created_at: string;
  details: ApprovalDetails;
}

const DocumentApprovalPanel: React.FC<DocumentApprovalPanelProps> = ({
  document,
  onApprovalComplete
}) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState(document.approval_notes || "");
  const { mutate: approveDocument, isPending } = useDocumentApproval();
  const [approvalInfo, setApprovalInfo] = useState<{
    status: DocumentApprovalStatus;
    approved_by?: string;
    approved_at?: string;
    notes?: string;
  }>({
    status: document.approval_status || "pending",
    approved_by: document.approved_by,
    approved_at: document.approved_at,
    notes: document.approval_notes
  });
  
  useEffect(() => {
    const fetchApprovalInfo = async () => {
      if (!document.entity_type || !document.entity_id || !document.id) return;
      
      try {
        // Use explicit typecasting to avoid deep type instantiation
        const response = await supabase
          .from('activity_logs')
          .select('*')
          .eq('entity_type', document.entity_type)
          .eq('entity_id', document.entity_id)
          .eq('details->document_id', document.id)
          .eq('details->action_type', 'document_approval')
          .order('created_at', { ascending: false })
          .limit(1);
          
        const { data, error } = response;
        
        if (error) {
          console.error("Error fetching approval info:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const latestApproval = data[0] as ActivityLogRow;
          
          // Safely access details properties with type checks
          const details = latestApproval.details;
          if (typeof details === 'object' && details !== null) {
            const approvalStatus = details.approval_status as DocumentApprovalStatus | undefined;
            const notes = details.notes as string | undefined;
            
            setApprovalInfo({
              status: approvalStatus || "pending",
              approved_by: latestApproval.user_id,
              approved_at: latestApproval.created_at,
              notes: notes
            });
            
            if (notes) {
              setNotes(notes);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchApprovalInfo:", error);
      }
    };
    
    fetchApprovalInfo();
  }, [document, document.entity_type, document.entity_id, document.id]);
  
  if (!document.entity_type || !document.entity_id) {
    return null;
  }
  
  const handleUpdateStatus = (status: DocumentApprovalStatus) => {
    approveDocument({
      documentId: document.id,
      status,
      notes,
      entityType: document.entity_type as "policy" | "claim" | "sales_process",
      entityId: document.entity_id
    }, {
      onSuccess: () => {
        setApprovalInfo(prev => ({
          ...prev,
          status,
          notes
        }));
        
        if (onApprovalComplete) {
          onApprovalComplete();
        }
      }
    });
  };
  
  const getStatusIcon = () => {
    switch (approvalInfo.status) {
      case "approved":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <ShieldX className="h-5 w-5 text-red-500" />;
      case "needs_review":
        return <ShieldQuestion className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const getStatusBadge = () => {
    switch (approvalInfo.status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("approved")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t("rejected")}</Badge>;
      case "needs_review":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t("needsReview")}</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-100">{t("pending")}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileQuestion className="h-5 w-5" />
          {t("documentApproval")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("status")}:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
          </div>
          
          {approvalInfo.approved_by && approvalInfo.approved_at && (
            <div className="text-sm text-muted-foreground">
              {approvalInfo.status === "approved" ? t("approvedOn") : t("reviewedOn")}: {formatDate(approvalInfo.approved_at)}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("approvalNotes")}</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("enterApprovalNotes")}
              rows={3}
              disabled={isPending}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button 
          variant="default" 
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          onClick={() => handleUpdateStatus("approved")}
          disabled={isPending || approvalInfo.status === "approved"}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          {t("approve")}
        </Button>
        <Button 
          variant="default"
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600"
          onClick={() => handleUpdateStatus("needs_review")}
          disabled={isPending || approvalInfo.status === "needs_review"}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
          {t("needsReview")}
        </Button>
        <Button 
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => handleUpdateStatus("rejected")}
          disabled={isPending || approvalInfo.status === "rejected"}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          {t("reject")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentApprovalPanel;
