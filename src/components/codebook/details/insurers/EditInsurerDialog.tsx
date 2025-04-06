
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import InsurerForm from "@/components/codebook/forms/InsurerForm";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogger } from "@/utils/activityLogger";
import { EntityType } from "@/types/common";

interface EditInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurer: Insurer;
  onEditSuccess: () => void;
}

const EditInsurerDialog: React.FC<EditInsurerDialogProps> = ({
  open,
  onOpenChange,
  insurer,
  onEditSuccess
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logActivity } = useActivityLogger();
  
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Collect changed fields for activity log
      const changes: Record<string, { old: any; new: any }> = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== insurer[key as keyof Insurer]) {
          changes[key] = {
            old: insurer[key as keyof Insurer],
            new: values[key]
          };
        }
      });
      
      const { error } = await supabase
        .from('insurers')
        .update(values)
        .eq('id', insurer.id);
      
      if (error) throw error;
      
      // Log update activity
      await logActivity({
        entity_type: EntityType.INSURER,
        entity_id: insurer.id,
        action: "update",
        details: { changes }
      });
      
      onEditSuccess();
    } catch (error) {
      console.error("Error updating insurer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('editInsurer')}</DialogTitle>
          <DialogDescription>
            {t('editInsurerDescription')}
          </DialogDescription>
        </DialogHeader>
        <InsurerForm 
          defaultValues={{
            name: insurer.name,
            contact_person: insurer.contact_person || "",
            email: insurer.email || "",
            phone: insurer.phone || "",
            address: insurer.address || "",
            city: insurer.city || "",
            postal_code: insurer.postal_code || "",
            country: insurer.country || "",
            registration_number: insurer.registration_number || "",
            is_active: insurer.is_active,
          }} 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditInsurerDialog;
