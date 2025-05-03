
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActivityForm from "./ActivityForm";
import { CreateActivityFormData } from "@/types/sales/activities";

interface NewActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivityCreated?: (data: any) => void;
  leadId?: string;
  salesProcessId?: string;
}

const NewActivityDialog: React.FC<NewActivityDialogProps> = ({
  open,
  onOpenChange,
  onActivityCreated,
  leadId,
  salesProcessId,
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateActivityFormData) => {
    setIsSubmitting(true);
    
    // In a real implementation, this would be an API call to create the activity
    try {
      // Construct the activity object
      const activity = {
        ...data,
        lead_id: leadId,
        sales_process_id: salesProcessId,
        status: 'pending' as const,
        due_date: data.due_date ? data.due_date.toISOString() : undefined,
      };
      
      if (onActivityCreated) {
        onActivityCreated(activity);
      }
      
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("scheduleActivity")}</DialogTitle>
          <DialogDescription>
            {t("scheduleActivityDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <ActivityForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewActivityDialog;
