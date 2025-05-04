
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RegionalSettingsFormProps {
  settings: any;
  onSave: (data: any) => void;
}

const regionalSettingsSchema = z.object({
  default_language: z.string(),
  default_currency: z.string(),
  date_format: z.string(),
  fiscal_year_start: z.string(),
});

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "sr", label: "Српски" },
  { value: "mk", label: "Македонски" }
];

const currencies = [
  { value: "EUR", label: "Euro (€)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "RSD", label: "Serbian Dinar (РСД)" },
  { value: "MKD", label: "Macedonian Denar (ден)" }
];

const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const fiscalYearStarts = [
  { value: "01-01", label: "January 1" },
  { value: "04-01", label: "April 1" },
  { value: "07-01", label: "July 1" },
  { value: "10-01", label: "October 1" }
];

export const RegionalSettingsForm: React.FC<RegionalSettingsFormProps> = ({ 
  settings, 
  onSave 
}) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof regionalSettingsSchema>>({
    resolver: zodResolver(regionalSettingsSchema),
    defaultValues: {
      default_language: settings?.default_language || "en",
      default_currency: settings?.default_currency || "EUR",
      date_format: settings?.date_format || "YYYY-MM-DD",
      fiscal_year_start: settings?.fiscal_year_start || "01-01",
    }
  });

  const handleSubmit = (data: z.infer<typeof regionalSettingsSchema>) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="default_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("defaultLanguage")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectLanguage")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="default_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("defaultCurrency")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCurrency")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dateFormat")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectDateFormat")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dateFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fiscal_year_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fiscalYearStart")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectFiscalYearStart")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fiscalYearStarts.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">{t("saveChanges")}</Button>
        </div>
      </form>
    </Form>
  );
};
