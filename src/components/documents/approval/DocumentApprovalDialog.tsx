
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

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
  const [status, setStatus] = useState<DocumentApprovalStatus>("approved");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!document) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, call a service to update the document status
      console.log("Updating document status:", { documentId: document.id, status, notes });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onApproved) {
        onApproved();
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating document status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("documentApproval")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-medium mb-2">{t("document")}</h4>
            <p className="text-sm">{document?.document_name}</p>
            <p className="text-xs text-muted-foreground mt-1">{document?.document_type}</p>
          </div>
          
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as DocumentApprovalStatus)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="approved" id="approved" />
              <Label htmlFor="approved" className="flex items-center space-x-2 cursor-pointer">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{t("approved")}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rejected" id="rejected" />
              <Label htmlFor="rejected" className="flex items-center space-x-2 cursor-pointer">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>{t("rejected")}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="needs_review" id="needs_review" />
              <Label htmlFor="needs_review" className="flex items-center space-x-2 cursor-pointer">
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <span>{t("needsReview")}</span>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea 
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("enterApprovalNotes")}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("updating") : t("submitDecision")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentApprovalDialog;
