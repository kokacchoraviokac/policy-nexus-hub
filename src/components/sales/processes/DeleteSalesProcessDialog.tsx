
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/sales/salesProcesses";
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
import { toast } from "sonner";

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
    try {
      // In a real application, this would make an API call to delete a sales process
      console.log("Deleting sales process:", process.id);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call callback function
      onProcessDeleted();
      
      // Show success toast
      toast.success(t("processDeleted"), {
        description: t("processDeletedDescription", { title: process.title }),
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting sales process:", error);
      toast.error(t("errorDeletingProcess"), {
        description: t("tryAgainLater"),
      });
    }
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
