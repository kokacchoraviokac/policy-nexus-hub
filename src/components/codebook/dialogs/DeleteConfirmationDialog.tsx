
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { processDynamicTranslation } from "@/utils/testing/translationTester";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  entityName: string;
  entityTitle: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onDelete,
  entityName,
  entityTitle,
}) => {
  const { t } = useLanguage();
  
  // Process the confirmation message with dynamic content
  const confirmationMessage = processDynamicTranslation(
    t("deleteConfirmation"), 
    { 0: `<span class="font-medium">${entityTitle}</span>` }
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete") + " " + t(entityName)}</DialogTitle>
          <DialogDescription>
            <div dangerouslySetInnerHTML={{ __html: confirmationMessage }} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
