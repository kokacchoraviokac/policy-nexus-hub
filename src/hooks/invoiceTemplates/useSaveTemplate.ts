
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTemplateApi } from "@/services/invoiceTemplates/templateApi";
import { InvoiceTemplateSettings } from "@/types/finances";
import { TemplateFormValues } from "@/hooks/useInvoiceTemplates";

export const useSaveTemplate = (
  companyId: string | undefined,
  onSuccess?: () => Promise<void>,
  onTemplateSaved?: (template: InvoiceTemplateSettings) => void
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { 
    createTemplate, 
    updateTemplate, 
    updateAllTemplatesDefaultStatus 
  } = useTemplateApi();

  const saveTemplate = async (values: TemplateFormValues, existingTemplate?: InvoiceTemplateSettings) => {
    if (!companyId) return false;
    
    try {
      // If creating a new template
      if (!existingTemplate) {
        // Check if this will be the default template
        if (values.is_default) {
          // Unset default on all templates
          await updateAllTemplatesDefaultStatus(companyId, false);
        }
        
        // Create new template
        const templateData = {
          name: values.name,
          is_default: values.is_default,
          primary_color: values.primary_color,
          secondary_color: values.secondary_color,
          font_family: values.font_family,
          font_weight: values.font_weight,
          font_style: values.font_style,
          logo_position: values.logo_position,
          header_text: values.header_text,
          footer_text: values.footer_text,
          show_payment_instructions: values.show_payment_instructions,
          payment_instructions: values.payment_instructions
        };
        
        const data = await createTemplate(companyId, templateData);
        
        toast({
          title: t("templateCreated"),
          description: t("templateCreatedDescription")
        });
        
        if (onTemplateSaved) {
          onTemplateSaved(data);
        }
      } else {
        // If updating an existing template
        // Check if this template is being set as default
        if (values.is_default && !existingTemplate.is_default) {
          // Unset default on all templates
          await updateAllTemplatesDefaultStatus(companyId, false);
        }
        
        // Update template
        const templateData = {
          name: values.name,
          is_default: values.is_default,
          primary_color: values.primary_color,
          secondary_color: values.secondary_color,
          font_family: values.font_family,
          font_weight: values.font_weight,
          font_style: values.font_style,
          logo_position: values.logo_position,
          header_text: values.header_text,
          footer_text: values.footer_text,
          show_payment_instructions: values.show_payment_instructions,
          payment_instructions: values.payment_instructions
        };
        
        const data = await updateTemplate(existingTemplate.id, templateData);
        
        toast({
          title: t("templateUpdated"),
          description: t("templateUpdatedDescription")
        });
        
        if (onTemplateSaved) {
          onTemplateSaved(data);
        }
      }
      
      // Reload templates
      if (onSuccess) {
        await onSuccess();
      }
      return true;
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: t("errorSavingTemplate"),
        description: t("errorSavingTemplateDescription"),
        variant: "destructive"
      });
      return false;
    }
  };

  return { saveTemplate };
};
