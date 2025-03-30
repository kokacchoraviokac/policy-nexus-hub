
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface FontStyleFieldsProps {
  form: UseFormReturn<any>;
}

export const FontStyleFields: React.FC<FontStyleFieldsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="font_weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fontWeight")}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectFontWeight")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="normal">{t("normal")}</SelectItem>
                <SelectItem value="bold">{t("bold")}</SelectItem>
                <SelectItem value="light">{t("light")}</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="font_style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fontStyle")}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectFontStyle")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="normal">{t("normal")}</SelectItem>
                <SelectItem value="italic">{t("italic")}</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};
