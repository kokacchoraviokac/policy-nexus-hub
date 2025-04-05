
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  currencySchema, 
  dateSchema 
} from "@/utils/formSchemas";

// Create schema for policy details form
const policyDetailsSchema = z.object({
  policy_number: z.string().min(1, { message: "Policy number is required" }),
  policyholder_name: z.string().min(1, { message: "Policyholder name is required" }),
  insurer_name: z.string().min(1, { message: "Insurer name is required" }),
  premium: z.coerce.number().min(0, { message: "Premium must be a positive number" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  expiry_date: z.string().min(1, { message: "Expiry date is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
});

type PolicyDetailsFormValues = z.infer<typeof policyDetailsSchema>;

interface PolicyDetailsFormProps {
  initialData?: Partial<PolicyDetailsFormValues>;
  onSubmit?: (data: PolicyDetailsFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const PolicyDetailsForm: React.FC<PolicyDetailsFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useLanguage();

  const form = useForm<PolicyDetailsFormValues>({
    resolver: zodResolver(policyDetailsSchema),
    defaultValues: {
      policy_number: initialData?.policy_number || "",
      policyholder_name: initialData?.policyholder_name || "",
      insurer_name: initialData?.insurer_name || "",
      premium: initialData?.premium || 0,
      start_date: initialData?.start_date || "",
      expiry_date: initialData?.expiry_date || "",
      currency: initialData?.currency || "EUR",
    },
  });

  const handleSubmitWithToast = async (data: PolicyDetailsFormValues) => {
    try {
      // Update the updated_at field
      const updatedData = {
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      if (onSubmit) {
        onSubmit(updatedData);
      }
      
      toast({
        title: t("saved"),
        description: t("policyDetailsSaved"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorSavingPolicyDetails"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("policyDetails")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmitWithToast)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="policy_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("policyNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="policyholder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("policyholder")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("insurer")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="premium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("premium")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("startDate")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          {...field} 
                          type="date" 
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("expiryDate")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          {...field} 
                          type="date" 
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currency")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  t("save")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PolicyDetailsForm;
