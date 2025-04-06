
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProductForm from "@/components/codebook/forms/ProductForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Insurer } from "@/types/codebook";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogger } from "@/utils/activityLogger";
import { EntityType } from "@/types/common";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logActivity } = useActivityLogger();
  
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('insurance_products')
        .insert({
          ...values,
          insurer_id: insurer.id,
          company_id: insurer.company_id
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Log product creation
      if (data) {
        await logActivity({
          entity_type: EntityType.INSURER, // Using EntityType enum
          entity_id: insurer.id,
          action: "create",
          details: { 
            fields: values,
            product_id: data.id,
            product_name: values.name
          }
        });
      }
      
      onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          preselectedInsurerId={insurer.id}
          preselectedInsurerName={insurer.name}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
