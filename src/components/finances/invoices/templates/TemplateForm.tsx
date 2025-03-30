
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormValues } from "./TemplateFormTypes";
import {
  NameAndFontFields,
  ColorFields,
  LogoPositionField,
  TextFields,
  PaymentInstructionsFields,
  DefaultTemplateField,
  FormActions
} from "./form-fields";

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
        <NameAndFontFields form={form} />
        <ColorFields form={form} />
        <LogoPositionField form={form} />
        <TextFields form={form} />
        <PaymentInstructionsFields form={form} />
        <DefaultTemplateField form={form} />
        <FormActions onCancel={onCancel} isEditing={isEditing} />
      </form>
    </Form>
  );
};
