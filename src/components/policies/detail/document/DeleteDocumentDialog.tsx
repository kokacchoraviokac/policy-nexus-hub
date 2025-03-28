
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolicyDocument } from "@/hooks/usePolicyDocuments";

interface DeleteDocumentDialogProps {
  document: PolicyDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
  onConfirm
}) => {
  const { t } = useLanguage();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirmDocumentDeletion")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDocumentConfirmation", {
              name: document?.document_name || ""
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDocumentDialog;
