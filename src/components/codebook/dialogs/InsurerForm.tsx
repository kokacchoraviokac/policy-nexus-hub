
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Insurer } from "@/types/documents";

// Define the form schema
const insurerFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  contact_person: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  registration_number: z.string().optional(),
  is_active: z.boolean().default(true),
  broker_code: z.string().optional(),
  parent_company_id: z.string().optional()
});

type InsurerFormValues = z.infer<typeof insurerFormSchema>;

interface InsurerFormProps {
  insurer?: Insurer;
  onSubmit: (data: Partial<Insurer>) => Promise<void>;
  isSubmitting: boolean;
}

const InsurerForm: React.FC<InsurerFormProps> = ({
  insurer,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  // Initialize the form with default values or existing insurer data
  const form = useForm<InsurerFormValues>({
    resolver: zodResolver(insurerFormSchema),
    defaultValues: {
      name: insurer?.name || "",
      contact_person: insurer?.contact_person || "",
      email: insurer?.email || "",
      phone: insurer?.phone || "",
      address: insurer?.address || "",
      city: insurer?.city || "",
      postal_code: insurer?.postal_code || "",
      country: insurer?.country || "",
      registration_number: insurer?.registration_number || "",
      is_active: insurer?.is_active ?? true,
      broker_code: insurer?.broker_code || "",
      parent_company_id: insurer?.parent_company_id || ""
    }
  });

  const handleSubmit = async (values: InsurerFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id="insurer-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("insurerName")} {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contactPerson")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contactPersonName")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t("emailAddress")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("phoneNumber")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registration_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("registrationNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("registrationNumber")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("streetAddress")} {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("city")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("postalCode")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("postalCode")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("country")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("country")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="broker_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("brokerCode")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("brokerCode")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("active")}</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default InsurerForm;
