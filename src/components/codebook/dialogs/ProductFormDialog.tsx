
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductForm from "../forms/ProductForm";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  preselectedInsurerId?: string;
  preselectedInsurerName?: string;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  productId,
  preselectedInsurerId,
  preselectedInsurerName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
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
          company_id: user?.companyId,
        });
        toast({
          title: t("productUpdated"),
          description: t("productUpdatedDescription"),
        });
      } else {
        await addProduct({
          ...values,
          company_id: user?.companyId,
        });
        toast({
          title: t("productAdded"),
          description: t("productAddedDescription"),
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("errorSavingProduct"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {productId ? t("editInsuranceProduct") : t("addInsuranceProduct")}
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
                  name_translations: currentProduct.name_translations || {},
                  description_translations: currentProduct.description_translations || {},
                  category_translations: currentProduct.category_translations || {},
                }
              : preselectedInsurerId 
                ? {
                    insurer_id: preselectedInsurerId,
                  } 
                : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          preselectedInsurerId={preselectedInsurerId}
          preselectedInsurerName={preselectedInsurerName}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
