
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { ColorPicker } from "@/components/ui/color-picker";
import { UseFormReturn } from "react-hook-form";

interface ColorFieldsProps {
  form: UseFormReturn<any>;
}

export const ColorFields: React.FC<ColorFieldsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="primary_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("primaryColor")}</FormLabel>
            <FormControl>
              <ColorPicker 
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="secondary_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("secondaryColor")}</FormLabel>
            <FormControl>
              <ColorPicker 
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
