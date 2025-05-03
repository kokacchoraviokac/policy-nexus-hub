
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

interface DeleteLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadDeleted: () => void;
}

const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({
  lead,
  open,
  onOpenChange,
  onLeadDeleted,
}) => {
  const { t } = useLanguage();

  const handleDelete = async () => {
    // In a real application, this would make an API call to delete a lead
    console.log("Deleting lead:", lead.id);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Call callback function
    onLeadDeleted();
    
    // Close dialog
    onOpenChange(false);
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
