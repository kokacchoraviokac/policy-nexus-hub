
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface NameAndFontFieldsProps {
  form: UseFormReturn<any>;
}

export const NameAndFontFields: React.FC<NameAndFontFieldsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("templateName")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("templateNamePlaceholder")} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="font_family"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fontFamily")}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectFont")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="helvetica">Helvetica</SelectItem>
                <SelectItem value="times">Times</SelectItem>
                <SelectItem value="courier">Courier</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};
