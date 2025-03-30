
import React, { useState } from "react";
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
        if (onApprovalComplete) {
          onApprovalComplete();
        }
      }
    });
  };
  
  const getStatusIcon = () => {
    switch (document.approval_status) {
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
    switch (document.approval_status) {
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
          
          {document.approved_by && document.approved_at && (
            <div className="text-sm text-muted-foreground">
              {document.approval_status === "approved" ? t("approvedOn") : t("reviewedOn")}: {formatDate(document.approved_at)}
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
          disabled={isPending || document.approval_status === "approved"}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          {t("approve")}
        </Button>
        <Button 
          variant="default"
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600"
          onClick={() => handleUpdateStatus("needs_review")}
          disabled={isPending || document.approval_status === "needs_review"}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
          {t("needsReview")}
        </Button>
        <Button 
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => handleUpdateStatus("rejected")}
          disabled={isPending || document.approval_status === "rejected"}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          {t("reject")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentApprovalPanel;
