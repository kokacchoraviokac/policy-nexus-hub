
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useDocumentManager } from "@/hooks/useDocumentManager";

interface DocumentApprovalDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproved?: () => void;
}

const DocumentApprovalDialog: React.FC<DocumentApprovalDialogProps> = ({
  document,
  open,
  onOpenChange,
  onApproved
}) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState("");
  const { approveDocument, isLoading } = useDocumentManager();

  const handleSubmit = async (status: DocumentApprovalStatus) => {
    if (!document) return;
    
    const result = await approveDocument(document, status, notes);
    
    if (result.success) {
      if (onApproved) onApproved();
      setNotes("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("approveOrRejectDocument")}</DialogTitle>
          <DialogDescription>
            {document ? t("reviewDocumentBeforeApproval", { name: document.document_name }) : t("selectDocumentToReview")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("approvalNotes")}</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("enterApprovalNotes")}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between gap-4 sm:justify-between">
          <Button
            variant="destructive"
            disabled={isLoading || !document}
            onClick={() => handleSubmit("rejected" as DocumentApprovalStatus)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            {t("reject")}
          </Button>
          
          <Button
            variant="default"
            disabled={isLoading || !document}
            onClick={() => handleSubmit("approved" as DocumentApprovalStatus)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {t("approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentApprovalDialog;
