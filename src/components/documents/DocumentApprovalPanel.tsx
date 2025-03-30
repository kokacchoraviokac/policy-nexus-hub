
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentApproval } from "@/hooks/useDocumentApproval";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion } from "lucide-react";
import { Document } from "@/types/documents";
import { formatDate } from "@/utils/format";
import { ApprovalStatusBadge, getStatusIcon } from "./approval/ApprovalStatusBadge";
import { ApprovalActions } from "./approval/ApprovalActions";
import { useDocumentApprovalInfo } from "@/hooks/useDocumentApprovalInfo";

interface DocumentApprovalPanelProps {
  document: Document;
  onApprovalComplete?: () => void;
}

const DocumentApprovalPanel: React.FC<DocumentApprovalPanelProps> = ({
  document,
  onApprovalComplete
}) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState(document.approval_notes || "");
  const { mutate: approveDocument, isPending } = useDocumentApproval();
  const { approvalInfo } = useDocumentApprovalInfo(document);
  
  if (!document.entity_type || !document.entity_id) {
    return null;
  }
  
  const handleUpdateStatus = (status: typeof approvalInfo.status) => {
    approveDocument({
      documentId: document.id,
      status,
      notes,
      entityType: document.entity_type as "policy" | "claim" | "sales_process",
      entityId: document.entity_id
    }, {
      onSuccess: () => {
        if (onApprovalComplete) {
          onApprovalComplete();
        }
      }
    });
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
              {getStatusIcon(approvalInfo.status)}
              <ApprovalStatusBadge status={approvalInfo.status} />
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
        <ApprovalActions 
          onApprove={() => handleUpdateStatus("approved")}
          onReject={() => handleUpdateStatus("rejected")}
          onNeedsReview={() => handleUpdateStatus("needs_review")}
          currentStatus={approvalInfo.status}
          isPending={isPending}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentApprovalPanel;
