
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTemplateApi } from "@/services/invoiceTemplates/templateApi";
import { defaultTemplateValues } from "@/hooks/useInvoiceTemplates";
import { InvoiceTemplateSettings } from "@/types/finances";

export const useCreateDefaultTemplate = (
  companyId: string | undefined,
  onTemplateCreated?: (template: InvoiceTemplateSettings) => void
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { createTemplate } = useTemplateApi();

  const createDefaultTemplate = async () => {
    if (!companyId) return;
    
    try {
      const templateData = {
        name: defaultTemplateValues.name,
        is_default: true,
        primary_color: defaultTemplateValues.primary_color,
        secondary_color: defaultTemplateValues.secondary_color,
        font_family: defaultTemplateValues.font_family,
        font_weight: defaultTemplateValues.font_weight,
        font_style: defaultTemplateValues.font_style,
        logo_position: defaultTemplateValues.logo_position,
        header_text: defaultTemplateValues.header_text,
        footer_text: defaultTemplateValues.footer_text,
        show_payment_instructions: defaultTemplateValues.show_payment_instructions,
        payment_instructions: defaultTemplateValues.payment_instructions
      };
      
      const data = await createTemplate(companyId, templateData);
      
      toast({
        title: t("defaultTemplateCreated"),
        description: t("defaultTemplateCreatedDescription")
      });
      
      if (onTemplateCreated) {
        onTemplateCreated(data);
      }
      
      return data;
    } catch (error) {
      console.error("Error creating default template:", error);
      toast({
        title: t("errorCreatingTemplate"),
        description: t("errorCreatingTemplateDescription"),
        variant: "destructive"
      });
      return null;
    }
  };

  return { createDefaultTemplate };
};
