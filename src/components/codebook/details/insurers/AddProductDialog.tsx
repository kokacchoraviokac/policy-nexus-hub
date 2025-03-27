
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProductForm from "@/components/codebook/forms/ProductForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Insurer } from "@/types/codebook";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurer: Insurer;
  onProductAdded: () => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  insurer,
  onProductAdded
}) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('addProduct')}</DialogTitle>
          <DialogDescription>
            {t('addProductForInsurerDescription')}
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          defaultValues={{
            code: "",
            name: "",
            category: "",
            description: "",
            is_active: true,
            insurer_id: insurer.id,
          }}
          onSubmit={() => onProductAdded()}
          onCancel={() => onOpenChange(false)}
          isSubmitting={false}
          preselectedInsurerId={insurer.id}
          preselectedInsurerName={insurer.name}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
