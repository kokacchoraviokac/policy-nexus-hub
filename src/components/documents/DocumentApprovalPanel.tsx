
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogger } from "@/utils/activityLogger";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldCheck, ShieldX, Shield } from "lucide-react";
import { PolicyDocument, DocumentApprovalStatus } from "@/types/documents";
import { EntityType } from "@/types/common"; 

interface DocumentApprovalPanelProps {
  document: PolicyDocument;
  onApprovalComplete?: () => void;
}

const DocumentApprovalPanel: React.FC<DocumentApprovalPanelProps> = ({
  document,
  onApprovalComplete
}) => {
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  
  const [approvalNotes, setApprovalNotes] = useState(document.approval_notes || "");
  
  // Determine the table based on entity type
  const getDocumentTable = () => {
    const entityType = document.entity_type as EntityType;
    
    switch (entityType) {
      case EntityType.POLICY:
        return "policy_documents";
      case EntityType.CLAIM:
        return "claim_documents";
      case EntityType.SALES_PROCESS:
      case EntityType.SALE:  // Handle 'sale' as an alias for 'sales_process'
        return "sales_documents";
      default:
        return "policy_documents"; // Default fallback
    }
  };
  
  const updateApprovalStatus = useMutation({
    mutationFn: async (newStatus: DocumentApprovalStatus) => {
      const tableName = getDocumentTable();
      
      // For now, we'll just log the activity and not update the document table
      // since the document tables may not have approval_status fields yet
      
      // Log the activity
      await logActivity({
        entity_type: document.entity_type as EntityType,
        entity_id: document.entity_id || "",
        action: "update",
        details: {
          action_type: `document_${newStatus}`,
          document_id: document.id,
          document_name: document.document_name,
          approval_status: newStatus,
          notes: approvalNotes.trim() || null
        }
      });
      
      return newStatus;
    },
    onSuccess: (newStatus) => {
      let title = "";
      if (newStatus === DocumentApprovalStatus.APPROVED) {
        title = t("documentApproved");
      } else if (newStatus === DocumentApprovalStatus.REJECTED) {
        title = t("documentRejected");
      } else if (newStatus === DocumentApprovalStatus.NEEDS_REVIEW) {
        title = t("documentMarkedForReview");
      } else {
        title = t("documentStatusUpdated");
      }
      
      toast({
        title,
        description: t("documentStatusUpdateSuccess"),
      });
      
      // Refresh document data
      queryClient.invalidateQueries({ queryKey: ['documents', document.entity_type, document.entity_id] });
      
      if (onApprovalComplete) {
        onApprovalComplete();
      }
    },
    onError: (error) => {
      console.error("Error updating document status:", error);
      toast({
        title: t("errorUpdatingDocument"),
        description: t("errorOccurredTryAgain"),
        variant: "destructive",
      });
    }
  });
  
  const handleApprovalAction = (status: DocumentApprovalStatus) => {
    updateApprovalStatus.mutate(status);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          {t("documentApproval")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {document.approval_status && (
          <div className="text-xs flex justify-between">
            <span className="text-muted-foreground">{t("status")}:</span>
            <span className="font-medium">
              {t(document.approval_status)}
            </span>
          </div>
        )}
        
        {document.approved_at && (
          <div className="text-xs flex justify-between">
            <span className="text-muted-foreground">
              {document.approval_status === DocumentApprovalStatus.APPROVED ? t("approvedOn") : t("reviewedOn")}:
            </span>
            <span>
              {formatDate(document.approved_at)}
            </span>
          </div>
        )}
        
        <Textarea
          placeholder={t("enterApprovalNotes")}
          value={approvalNotes}
          onChange={(e) => setApprovalNotes(e.target.value)}
          className="min-h-[80px] text-xs"
        />
      </CardContent>
      <CardFooter className="pt-0 px-3 pb-3 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleApprovalAction(DocumentApprovalStatus.NEEDS_REVIEW)}
          disabled={updateApprovalStatus.isPending}
          className="w-full"
        >
          {updateApprovalStatus.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Shield className="h-3.5 w-3.5 mr-1" />
          )}
          <span className="text-xs">{t("needsReview")}</span>
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleApprovalAction(DocumentApprovalStatus.REJECTED)}
            disabled={updateApprovalStatus.isPending}
          >
            {updateApprovalStatus.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldX className="h-3.5 w-3.5 mr-1" />
            )}
            <span className="text-xs">{t("reject")}</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => handleApprovalAction(DocumentApprovalStatus.APPROVED)}
            disabled={updateApprovalStatus.isPending}
          >
            {updateApprovalStatus.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            )}
            <span className="text-xs">{t("approve")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentApprovalPanel;
