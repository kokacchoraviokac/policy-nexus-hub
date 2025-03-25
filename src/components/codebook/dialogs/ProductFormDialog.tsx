
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductForm from "../forms/ProductForm";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useToast } from "@/hooks/use-toast";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  productId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuthSession();
  const { products, addProduct, updateProduct } = useInsuranceProducts();
  
  const currentProduct = productId
    ? products?.find((product) => product.id === productId)
    : undefined;

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      if (productId && currentProduct) {
        await updateProduct(productId, {
          ...values,
          company_id: authState.user?.company_id,
        });
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
      } else {
        await addProduct({
          ...values,
          company_id: authState.user?.company_id,
        });
        toast({
          title: "Product added",
          description: "The product has been added successfully.",
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {productId ? "Edit Insurance Product" : "Add Insurance Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          defaultValues={
            currentProduct
              ? {
                  code: currentProduct.code,
                  name: currentProduct.name,
                  category: currentProduct.category || "",
                  description: currentProduct.description || "",
                  is_active: currentProduct.is_active,
                  insurer_id: currentProduct.insurer_id,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
