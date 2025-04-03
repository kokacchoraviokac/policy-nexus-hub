
import React from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth/AuthContext";
import { FormActions } from "./shared/FormActions";
import { ProductFields } from "./shared/ProductFields";
import { StatusField } from "./shared/StatusField";
import useZodForm from "@/hooks/useZodForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { nameSchema, isActiveSchema, createModelSchema } from "@/utils/formSchemas";

const createProductFormSchema = (t: (key: string) => string) =>
  z.object({
    code: z.string().min(1, t("codeRequired")),
    name: nameSchema(t("nameRequired")),
    category: z.string().optional(),
    description: z.string().optional(),
    is_active: isActiveSchema(),
    insurer_id: createModelSchema("Insurer", { isRequired: true, errorMessage: t("insurerRequired") }),
    name_translations: z.record(z.string()).optional().nullable(),
    description_translations: z.record(z.string()).optional().nullable(),
    category_translations: z.record(z.string()).optional().nullable(),
  });

type ProductFormValues = z.infer<ReturnType<typeof createProductFormSchema>>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  preselectedInsurerId?: string;
  preselectedInsurerName?: string;
  enableMultilingual?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues = {
    code: "",
    name: "",
    category: "",
    description: "",
    is_active: true,
    insurer_id: "",
    name_translations: {},
    description_translations: {},
    category_translations: {},
  },
  onSubmit,
  onCancel,
  isSubmitting: externalIsSubmitting,
  preselectedInsurerId,
  preselectedInsurerName,
  enableMultilingual = true
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // If we have a preselected insurer, make sure it's set in the default values
  if (preselectedInsurerId && !defaultValues.insurer_id) {
    defaultValues.insurer_id = preselectedInsurerId;
  }
  
  const schema = createProductFormSchema(t);

  const form = useZodForm({
    schema,
    defaultValues,
    onSubmit,
    successMessage: defaultValues.code 
      ? t("productUpdateSuccess") 
      : t("productCreateSuccess"),
    errorMessage: defaultValues.code 
      ? t("productUpdateError") 
      : t("productCreateError"),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProductFields 
          form={form} 
          preselectedInsurerId={preselectedInsurerId}
          preselectedInsurerName={preselectedInsurerName}
          enableMultilingual={enableMultilingual}
        />
        
        <StatusField 
          form={form} 
          description="Set whether this product is active and available for selection"
        />

        <FormActions
          onCancel={onCancel}
          isSubmitting={externalIsSubmitting || form.isSubmitting}
          isEditing={!!defaultValues.code}
          entityName="Product"
        />
      </form>
    </Form>
  );
};

export default ProductForm;
