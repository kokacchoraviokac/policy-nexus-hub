
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface LogoPositionFieldProps {
  form: UseFormReturn<any>;
}

export const LogoPositionField: React.FC<LogoPositionFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="logo_position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("logoPosition")}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("selectLogoPosition")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="left">{t("left")}</SelectItem>
              <SelectItem value="center">{t("center")}</SelectItem>
              <SelectItem value="right">{t("right")}</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
