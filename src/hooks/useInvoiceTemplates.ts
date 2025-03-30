
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { InvoiceTemplateSettings } from "@/types/finances";
import { useTemplateApi } from "@/services/invoiceTemplates/templateApi";
import { useCreateDefaultTemplate } from "@/hooks/invoiceTemplates/useCreateDefaultTemplate";
import { useDeleteTemplate } from "@/hooks/invoiceTemplates/useDeleteTemplate";
import { useDefaultTemplate } from "@/hooks/invoiceTemplates/useDefaultTemplate";
import { useSaveTemplate } from "@/hooks/invoiceTemplates/useSaveTemplate";
import { TemplateFormValues } from "@/components/finances/invoices/templates/TemplateFormTypes";

export const defaultTemplateValues: TemplateFormValues = {
  name: "Default Template",
  primary_color: "#3b82f6", // blue-500
  secondary_color: "#f3f4f6", // gray-100
  font_family: "helvetica",
  font_size: "12px", // Added missing font_size property
  font_weight: "normal",
  font_style: "normal",
  logo_position: "left",
  header_text: "",
  footer_text: "",
  show_payment_instructions: false,
  payment_instructions: "",
  is_default: true
};

export const useInvoiceTemplates = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [templates, setTemplates] = useState<InvoiceTemplateSettings[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const companyId = user?.companyId;
  const { fetchTemplates } = useTemplateApi();

  const loadTemplates = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const typedData = await fetchTemplates(companyId);
      setTemplates(typedData);
      
      // If there are no templates, create a default one
      if (typedData.length === 0) {
        await createDefaultTemplate();
      } else {
        // Find default template
        const defaultTemplate = typedData.find(template => template.is_default === true);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
        } else {
          setSelectedTemplate(typedData[0]);
        }
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: t("errorLoadingTemplates"),
        description: t("errorLoadingTemplatesDescription"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up specialized hooks
  const { createDefaultTemplate } = useCreateDefaultTemplate(
    companyId, 
    (template) => {
      setSelectedTemplate(template);
      setTemplates([template]);
    }
  );

  const { handleDeleteTemplate } = useDeleteTemplate(
    templates, 
    loadTemplates, 
    (deletedId) => {
      if (selectedTemplate?.id === deletedId) {
        setSelectedTemplate(null);
      }
    }
  );

  const { setDefaultTemplate } = useDefaultTemplate(
    companyId, 
    loadTemplates
  );

  const { saveTemplate } = useSaveTemplate(
    companyId, 
    loadTemplates, 
    setSelectedTemplate
  );

  // Load templates when component mounts
  useEffect(() => {
    if (companyId) {
      loadTemplates();
    }
  }, [companyId]);

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    loadTemplates,
    deleteTemplate: handleDeleteTemplate,
    setDefaultTemplate,
    saveTemplate
  };
};
