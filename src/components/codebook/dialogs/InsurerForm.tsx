
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Insurer } from "@/types/codebook";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface InsurerFormProps {
  defaultValues?: Partial<Insurer>;
  onSubmit: (data: Partial<Insurer>) => void;
  isSubmitting?: boolean;
}

const InsurerForm: React.FC<InsurerFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Create a schema for insurer validation
  const formSchema = z.object({
    name: z.string().min(2, t("nameRequired")),
    contact_person: z.string().optional(),
    email: z.string().email(t("invalidEmail")).optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    registration_number: z.string().optional(),
    is_active: z.boolean().default(true),
    broker_code: z.string().optional(),
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      contact_person: defaultValues?.contact_person || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      postal_code: defaultValues?.postal_code || "",
      country: defaultValues?.country || "",
      registration_number: defaultValues?.registration_number || "",
      is_active: defaultValues?.is_active !== undefined ? defaultValues.is_active : true,
      broker_code: defaultValues?.broker_code || "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Add company_id if not provided
    const insurerData: Partial<Insurer> = {
      ...data,
      company_id: user?.company_id,
    };
    
    // If we're updating an existing insurer, include the id
    if (defaultValues?.id) {
      insurerData.id = defaultValues.id;
    }

    onSubmit(insurerData);
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
                <Input placeholder={t("enterName")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterContactPerson")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterEmail")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterPhone")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterRegistrationNumber")} {...field} disabled={isSubmitting} />
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
                <Input placeholder={t("enterAddress")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterCity")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterPostalCode")} {...field} disabled={isSubmitting} />
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
                  <Input placeholder={t("enterCountry")} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="broker_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("brokerCode")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterBrokerCode")} {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
