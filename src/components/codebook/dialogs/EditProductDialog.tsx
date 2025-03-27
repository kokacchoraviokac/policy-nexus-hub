
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProductForm from "@/components/codebook/forms/ProductForm";
import { InsuranceProduct } from "@/types/codebook";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InsuranceProduct | null;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  preselectedInsurerId?: string;
  preselectedInsurerName?: string;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  onSubmit,
  isSubmitting,
  preselectedInsurerId,
  preselectedInsurerName,
}) => {
  if (!product) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Insurance Product</DialogTitle>
          <DialogDescription>
            Make changes to the product information below.
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          defaultValues={{
            code: product.code,
            name: product.name,
            category: product.category || "",
            description: product.description || "",
            is_active: product.is_active,
            insurer_id: product.insurer_id,
          }}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          preselectedInsurerId={preselectedInsurerId || product.insurer_id}
          preselectedInsurerName={preselectedInsurerName}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
