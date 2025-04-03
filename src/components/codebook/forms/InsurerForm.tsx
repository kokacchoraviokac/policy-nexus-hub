
import React from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth/AuthContext";
import { ContactFields } from "./shared/ContactFields";
import { AddressFields } from "./shared/AddressFields";
import { CompanyFields } from "./shared/CompanyFields";
import { FormActions } from "./shared/FormActions";
import { StatusField } from "./shared/StatusField";
import useZodForm from "@/hooks/useZodForm";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  addressSchema,
  citySchema,
  postalCodeSchema,
  countrySchema,
  registrationNumberSchema,
  isActiveSchema,
} from "@/utils/formSchemas";

const createInsurerFormSchema = (t: (key: string) => string) =>
  z.object({
    name: nameSchema(t("companyNameRequired")),
    contact_person: z.string().optional(),
    email: emailSchema(t("invalidEmail")),
    phone: phoneSchema(),
    address: addressSchema(),
    city: citySchema(),
    postal_code: postalCodeSchema(),
    country: countrySchema(),
    registration_number: registrationNumberSchema(),
    is_active: isActiveSchema(),
  });

type InsurerFormValues = z.infer<ReturnType<typeof createInsurerFormSchema>>;

interface InsurerFormProps {
  defaultValues?: Partial<InsurerFormValues>;
  onSubmit: (values: InsurerFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const InsurerForm: React.FC<InsurerFormProps> = ({
  defaultValues = {
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    registration_number: "",
    is_active: true,
  },
  onSubmit,
  onCancel,
  isSubmitting: externalIsSubmitting,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const schema = createInsurerFormSchema(t);

  const form = useZodForm({
    schema,
    defaultValues,
    onSubmit,
    successMessage: defaultValues.name 
      ? t("insurerUpdateSuccess") 
      : t("insurerCreateSuccess"),
    errorMessage: defaultValues.name 
      ? t("insurerUpdateError") 
      : t("insurerCreateError"),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <CompanyFields 
            form={form} 
            companyNameName="name" 
            taxIdName={null}
            registrationNumberName="registration_number"
            notesName={null}
          />
        </div>

        <ContactFields form={form} />
        
        <AddressFields form={form} />

        <StatusField form={form} />

        <FormActions
          onCancel={onCancel}
          isSubmitting={externalIsSubmitting || form.isSubmitting}
          isEditing={!!defaultValues.name}
          entityName="Insurer"
        />
      </form>
    </Form>
  );
};

export default InsurerForm;
