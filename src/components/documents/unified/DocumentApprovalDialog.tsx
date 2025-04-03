
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { useDocumentApproval } from "@/hooks/useDocumentApproval";

interface DocumentApprovalDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DocumentApprovalDialog: React.FC<DocumentApprovalDialogProps> = ({
  document,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { t, formatDate } = useLanguage();
  const [status, setStatus] = useState<DocumentApprovalStatus>(
    document?.approval_status || "pending"
  );
  const [notes, setNotes] = useState<string>(
    document?.approval_notes || ""
  );
  
  const { updateApprovalStatus, isUpdating } = useDocumentApproval({
    onSuccess: () => {
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
  });
  
  if (!document) return null;
  
  const handleSubmit = () => {
    updateApprovalStatus({
      documentId: document.id,
      entityType: document.entity_type,
      status,
      notes
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("documentApproval")}</DialogTitle>
          <DialogDescription>
            {t("updateApprovalStatusForDocument", { name: document.document_name })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("documentDetails")}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">{t("name")}:</div>
              <div>{document.document_name}</div>
              <div className="text-muted-foreground">{t("uploadedOn")}:</div>
              <div>{formatDate(document.created_at)}</div>
              <div className="text-muted-foreground">{t("currentStatus")}:</div>
              <div>{t(document.approval_status || "pending")}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("approvalStatus")}</h3>
            <RadioGroup 
              value={status} 
              onValueChange={(value) => setStatus(value as DocumentApprovalStatus)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="approved" />
                <Label htmlFor="approved" className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {t("approved")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected" className="flex items-center">
                  <XCircle className="h-4 w-4 text-destructive mr-2" />
                  {t("rejected")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="needs_review" id="needs_review" />
                <Label htmlFor="needs_review" className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                  {t("needsReview")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-gray-500 mr-2" />
                  {t("pending")}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t("approvalNotes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("enterApprovalNotes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUpdating || status === document.approval_status}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              t("updateStatus")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentApprovalDialog;
