
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InsuranceProduct } from "@/types/codebook";
import { useAuth } from "@/contexts/auth/AuthContext";
import { FormActions } from "./shared/FormActions";
import { ProductFields } from "./shared/ProductFields";
import { StatusField } from "./shared/StatusField";

const productFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  insurer_id: z.string().min(1, "Insurer is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  preselectedInsurerId?: string;
  preselectedInsurerName?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues = {
    code: "",
    name: "",
    category: "",
    description: "",
    is_active: true,
    insurer_id: "",
  },
  onSubmit,
  onCancel,
  isSubmitting,
  preselectedInsurerId,
  preselectedInsurerName
}) => {
  const { user } = useAuth();

  // If we have a preselected insurer, make sure it's set in the default values
  if (preselectedInsurerId && !defaultValues.insurer_id) {
    defaultValues.insurer_id = preselectedInsurerId;
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProductFields 
          form={form} 
          preselectedInsurerId={preselectedInsurerId}
          preselectedInsurerName={preselectedInsurerName}
        />
        
        <StatusField 
          form={form} 
          description="Set whether this product is active and available for selection"
        />

        <FormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={!!defaultValues.code}
          entityName="Product"
        />
      </form>
    </Form>
  );
};

export default ProductForm;
