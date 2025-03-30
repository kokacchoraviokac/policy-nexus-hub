
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface DefaultTemplateFieldProps {
  form: UseFormReturn<any>;
}

export const DefaultTemplateField: React.FC<DefaultTemplateFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="is_default"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              {t("defaultTemplate")}
            </FormLabel>
            <FormDescription>
              {t("defaultTemplateDescription")}
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
  );
};
