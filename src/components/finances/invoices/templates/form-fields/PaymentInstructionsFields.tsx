
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface PaymentInstructionsFieldsProps {
  form: UseFormReturn<any>;
}

export const PaymentInstructionsFields: React.FC<PaymentInstructionsFieldsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="show_payment_instructions"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                {t("showPaymentInstructions")}
              </FormLabel>
              <FormDescription>
                {t("showPaymentInstructionsDescription")}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch("show_payment_instructions") && (
        <FormField
          control={form.control}
          name="payment_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("paymentInstructions")}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder={t("paymentInstructionsPlaceholder")} 
                  className="min-h-[100px]"
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </>
  );
};
