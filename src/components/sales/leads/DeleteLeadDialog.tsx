
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lead } from "@/types/sales/leads";
import { Button } from "@/components/ui/button";
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
import { useLeads } from "@/hooks/sales/useLeads";

interface DeleteLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadDeleted: () => void;
  onConfirm?: () => void; // Added to support existing code
}

const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({
  lead,
  open,
  onOpenChange,
  onLeadDeleted,
  onConfirm
}) => {
  const { t } = useLanguage();
  const { deleteLead } = useLeads();

  const handleDelete = async () => {
    // In a real application, this would make an API call to delete a lead
    const success = await deleteLead(lead.id);
    
    if (success) {
      // Call callback functions
      if (onLeadDeleted) onLeadDeleted();
      if (onConfirm) onConfirm();
      
      // Close dialog
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteLead")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteLeadConfirmation", { name: lead.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLeadDialog;
