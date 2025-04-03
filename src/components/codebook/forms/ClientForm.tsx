
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
  taxIdSchema,
  registrationNumberSchema,
  notesSchema,
  isActiveSchema,
} from "@/utils/formSchemas";

const createClientFormSchema = (t: (key: string) => string) =>
  z.object({
    name: nameSchema(t("companyNameRequired")),
    contact_person: z.string().optional(),
    email: emailSchema(t("invalidEmail")),
    phone: phoneSchema(),
    address: addressSchema(),
    city: citySchema(),
    postal_code: postalCodeSchema(),
    country: countrySchema(),
    tax_id: taxIdSchema(),
    registration_number: registrationNumberSchema(),
    notes: notesSchema(),
    is_active: isActiveSchema(),
  });

type ClientFormValues = z.infer<ReturnType<typeof createClientFormSchema>>;

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  defaultValues = {
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    tax_id: "",
    registration_number: "",
    notes: "",
    is_active: true,
  },
  onSubmit,
  onCancel,
  isSubmitting: externalIsSubmitting,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const schema = createClientFormSchema(t);

  const form = useZodForm({
    schema,
    defaultValues,
    onSubmit,
    successMessage: defaultValues.name 
      ? t("clientUpdateSuccess") 
      : t("clientCreateSuccess"),
    errorMessage: defaultValues.name 
      ? t("clientUpdateError") 
      : t("clientCreateError"),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <CompanyFields 
            form={form} 
            companyNameName="name" 
            taxIdName="tax_id"
            registrationNumberName="registration_number"
            notesName="notes"
          />
        </div>

        <ContactFields form={form} />
        
        <AddressFields form={form} />

        <StatusField form={form} />

        <FormActions
          onCancel={onCancel}
          isSubmitting={externalIsSubmitting || form.isSubmitting}
          isEditing={!!defaultValues.name}
          entityName="Client"
        />
      </form>
    </Form>
  );
};

export default ClientForm;
