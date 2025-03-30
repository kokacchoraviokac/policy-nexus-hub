
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTemplateApi } from "@/services/invoiceTemplates/templateApi";
import { InvoiceTemplateSettings } from "@/types/finances";

export const useDeleteTemplate = (
  templates: InvoiceTemplateSettings[],
  onSuccess?: () => Promise<void>,
  onDeleteSelected?: (templateId: string) => void
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { deleteTemplate } = useTemplateApi();

  const handleDeleteTemplate = async (templateId: string) => {
    // Don't allow deleting the default template
    const template = templates.find(t => t.id === templateId);
    if (template?.is_default) {
      toast({
        title: t("cannotDeleteDefaultTemplate"),
        description: t("cannotDeleteDefaultTemplateDescription"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      await deleteTemplate(templateId);
      
      // Reload templates
      if (onSuccess) {
        await onSuccess();
      }
      
      toast({
        title: t("templateDeleted"),
        description: t("templateDeletedDescription")
      });
      
      // If the deleted template was selected, reset the form
      if (onDeleteSelected) {
        onDeleteSelected(templateId);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: t("errorDeletingTemplate"),
        description: t("errorDeletingTemplateDescription"),
        variant: "destructive"
      });
    }
  };

  return { handleDeleteTemplate };
};
