
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTemplateApi } from "@/services/invoiceTemplates/templateApi";
import { InvoiceTemplateSettings } from "@/types/finances";

export const useDefaultTemplate = (
  companyId: string | undefined,
  onSuccess?: () => Promise<void>
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { updateAllTemplatesDefaultStatus, updateTemplate } = useTemplateApi();

  const setDefaultTemplate = async (templateId: string) => {
    if (!companyId) return;
    
    try {
      // First, unset default on all templates
      await updateAllTemplatesDefaultStatus(companyId, false);
      
      // Then set the selected template as default
      await updateTemplate(templateId, { is_default: true });
      
      toast({
        title: t("defaultTemplateUpdated"),
        description: t("defaultTemplateUpdatedDescription")
      });
      
      // Reload templates if onSuccess callback is provided
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Error setting default template:", error);
      toast({
        title: t("errorSettingDefaultTemplate"),
        description: t("errorSettingDefaultTemplateDescription"),
        variant: "destructive"
      });
    }
  };

  return { setDefaultTemplate };
};
