
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";
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

interface DeleteSalesProcessDialogProps {
  process: SalesProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessDeleted: () => void;
}

const DeleteSalesProcessDialog: React.FC<DeleteSalesProcessDialogProps> = ({
  process,
  open,
  onOpenChange,
  onProcessDeleted,
}) => {
  const { t } = useLanguage();

  const handleDelete = async () => {
    // In a real application, this would make an API call to delete a sales process
    console.log("Deleting sales process:", process.id);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Call callback function
    onProcessDeleted();
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteProcess")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteProcessConfirmation", { title: process.title })}
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

export default DeleteSalesProcessDialog;
