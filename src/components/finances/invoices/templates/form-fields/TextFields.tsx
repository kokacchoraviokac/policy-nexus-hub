
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TextFieldsProps {
  form: UseFormReturn<any>;
}

export const TextFields: React.FC<TextFieldsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="header_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("headerText")}</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder={t("headerTextPlaceholder")} 
                className="min-h-[80px]"
              />
            </FormControl>
            <FormDescription>
              {t("headerTextDescription")}
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="footer_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("footerText")}</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder={t("footerTextPlaceholder")} 
                className="min-h-[80px]"
              />
            </FormControl>
            <FormDescription>
              {t("footerTextDescription")}
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
};
