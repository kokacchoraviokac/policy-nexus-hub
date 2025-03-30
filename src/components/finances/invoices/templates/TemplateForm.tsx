
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ColorPicker } from "@/components/ui/color-picker";

interface TemplateFormValues {
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  logo_position: 'left' | 'center' | 'right';
  header_text: string;
  footer_text: string;
  show_payment_instructions: boolean;
  payment_instructions: string;
  is_default: boolean;
}

interface TemplateFormProps {
  form: UseFormReturn<TemplateFormValues>;
  onSubmit: (values: TemplateFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export const TemplateForm = ({ form, onSubmit, onCancel, isEditing }: TemplateFormProps) => {
  const { t } = useLanguage();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">
            {isEditing ? t("updateTemplate") : t("createTemplate")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
