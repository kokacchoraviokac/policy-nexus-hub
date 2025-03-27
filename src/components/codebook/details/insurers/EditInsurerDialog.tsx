
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import InsurerForm from "@/components/codebook/forms/InsurerForm";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";

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
          onSubmit={() => onEditSuccess()}
          onCancel={() => onOpenChange(false)}
          isSubmitting={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditInsurerDialog;
