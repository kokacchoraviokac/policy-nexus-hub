
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth/AuthContext";
import { ContactFields } from "./shared/ContactFields";
import { AddressFields } from "./shared/AddressFields";
import { CompanyFields } from "./shared/CompanyFields";
import { FormActions } from "./shared/FormActions";
import { StatusField } from "./shared/StatusField";

const clientFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contact_person: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  tax_id: z.string().optional(),
  registration_number: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

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
  isSubmitting,
}) => {
  const { user } = useAuth();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
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
          isSubmitting={isSubmitting}
          isEditing={!!defaultValues.name}
          entityName="Client"
        />
      </form>
    </Form>
  );
};

export default ClientForm;
