
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/contexts/LanguageContext";

interface MultilingualFieldProps {
  form: UseFormReturn<any>;
  name: string;
  translationsName: string;
  label: string;
  placeholder?: string;
  description?: string;
  multiline?: boolean;
}

const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sr", label: "Serbian" },
  { code: "mk", label: "Macedonian" },
  { code: "es", label: "Spanish" },
];

export function MultilingualField({
  form,
  name,
  translationsName,
  label,
  placeholder,
  description,
  multiline = false,
}: MultilingualFieldProps) {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<string>(currentLanguage);
  const translations = form.watch(translationsName) || {};

  const handleTranslationChange = (lang: string, value: string) => {
    const currentTranslations = form.getValues(translationsName) || {};
    form.setValue(translationsName, {
      ...currentTranslations,
      [lang]: value,
    });
  };

  return (
    <FormItem className="space-y-1">
      <FormLabel>{label}</FormLabel>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
              {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="mt-0">
            {lang.code === "en" ? (
              <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormControl>
                    {multiline ? (
                      <Textarea
                        placeholder={placeholder}
                        className={multiline ? "min-h-[100px]" : ""}
                        {...field}
                        value={field.value || ""}
                      />
                    ) : (
                      <Input placeholder={placeholder} {...field} />
                    )}
                  </FormControl>
                )}
              />
            ) : (
              <FormControl>
                {multiline ? (
                  <Textarea
                    placeholder={placeholder}
                    className={multiline ? "min-h-[100px]" : ""}
                    value={translations[lang.code] || ""}
                    onChange={(e) => handleTranslationChange(lang.code, e.target.value)}
                  />
                ) : (
                  <Input
                    placeholder={placeholder}
                    value={translations[lang.code] || ""}
                    onChange={(e) => handleTranslationChange(lang.code, e.target.value)}
                  />
                )}
              </FormControl>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <FormMessage />
    </FormItem>
  );
}
