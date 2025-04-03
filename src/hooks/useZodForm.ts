
import { useState } from "react";
import { useForm, UseFormProps, FieldValues, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseZodFormProps<T extends FieldValues> extends UseFormProps<T> {
  schema: z.ZodType<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
}

export function useZodForm<T extends FieldValues>({
  schema,
  onSubmit,
  onError,
  successMessage,
  errorMessage,
  resetOnSuccess = false,
  ...formProps
}: UseZodFormProps<T>): UseFormReturn<T> & {
  handleSubmitWithToast: () => Promise<void>;
  isSubmitting: boolean;
} {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    ...formProps,
  });

  const handleSubmitWithToast = async () => {
    try {
      setIsSubmitting(true);
      
      const values = form.getValues();
      await form.handleSubmit(async (formValues) => {
        try {
          await onSubmit(formValues);
          if (successMessage) {
            toast({
              title: t("success"),
              description: successMessage,
            });
          }
          
          if (resetOnSuccess) {
            form.reset(); // Reset the form if specified
          } else {
            form.reset(values); // Keep the form values instead of clearing
          }
        } catch (error) {
          if (onError) {
            onError(error);
          }
          
          toast({
            title: t("error"),
            description: errorMessage || t("formSubmissionError"),
            variant: "destructive",
          });
          
          console.error("Form submission error:", error);
        }
      })();
    } catch (error) {
      console.error("Form validation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...form,
    handleSubmitWithToast,
    isSubmitting,
  };
}

export default useZodForm;
