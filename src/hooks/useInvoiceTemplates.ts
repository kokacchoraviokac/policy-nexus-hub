
import { useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { InvoiceTemplateSettings } from "@/types/finances";

export type TemplateFormValues = {
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
};

export const defaultTemplateValues: TemplateFormValues = {
  name: "Default Template",
  primary_color: "#3b82f6", // blue-500
  secondary_color: "#f3f4f6", // gray-100
  font_family: "helvetica",
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

  const loadTemplates = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await (supabase
        .from('invoice_templates') as any)
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Type assertion to handle TypeScript error
      const typedData = data as unknown as InvoiceTemplateSettings[];
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

  const createDefaultTemplate = async () => {
    if (!companyId) return;
    
    try {
      const { data, error } = await (supabase
        .from('invoice_templates') as any)
        .insert([
          {
            company_id: companyId,
            name: defaultTemplateValues.name,
            is_default: true,
            primary_color: defaultTemplateValues.primary_color,
            secondary_color: defaultTemplateValues.secondary_color,
            font_family: defaultTemplateValues.font_family,
            logo_position: defaultTemplateValues.logo_position,
            header_text: defaultTemplateValues.header_text,
            footer_text: defaultTemplateValues.footer_text,
            show_payment_instructions: defaultTemplateValues.show_payment_instructions,
            payment_instructions: defaultTemplateValues.payment_instructions
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: t("defaultTemplateCreated"),
        description: t("defaultTemplateCreatedDescription")
      });
      
      // Type assertion to handle TypeScript error
      setSelectedTemplate(data as unknown as InvoiceTemplateSettings);
      setTemplates([data] as unknown as InvoiceTemplateSettings[]);
    } catch (error) {
      console.error("Error creating default template:", error);
      toast({
        title: t("errorCreatingTemplate"),
        description: t("errorCreatingTemplateDescription"),
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!companyId) return;
    
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
      const { error } = await (supabase
        .from('invoice_templates') as any)
        .delete()
        .eq('id', templateId);
      
      if (error) throw error;
      
      // Reload templates
      await loadTemplates();
      
      toast({
        title: t("templateDeleted"),
        description: t("templateDeletedDescription")
      });
      
      // If the deleted template was selected, reset the form
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
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

  const setDefaultTemplate = async (templateId: string) => {
    if (!companyId) return;
    
    try {
      // First, unset default on all templates
      const { error: updateError } = await (supabase
        .from('invoice_templates') as any)
        .update({ is_default: false })
        .eq('company_id', companyId);
      
      if (updateError) throw updateError;
      
      // Then set the selected template as default
      const { error } = await (supabase
        .from('invoice_templates') as any)
        .update({ is_default: true })
        .eq('id', templateId);
      
      if (error) throw error;
      
      // Reload templates
      await loadTemplates();
      
      toast({
        title: t("defaultTemplateUpdated"),
        description: t("defaultTemplateUpdatedDescription")
      });
    } catch (error) {
      console.error("Error setting default template:", error);
      toast({
        title: t("errorSettingDefaultTemplate"),
        description: t("errorSettingDefaultTemplateDescription"),
        variant: "destructive"
      });
    }
  };

  const saveTemplate = async (values: TemplateFormValues, existingTemplate?: InvoiceTemplateSettings) => {
    if (!companyId) return;
    
    try {
      // If creating a new template
      if (!existingTemplate) {
        // Check if this will be the default template
        if (values.is_default) {
          // Unset default on all templates
          await (supabase
            .from('invoice_templates') as any)
            .update({ is_default: false })
            .eq('company_id', companyId);
        }
        
        // Create new template
        const { data, error } = await (supabase
          .from('invoice_templates') as any)
          .insert([
            {
              company_id: companyId,
              name: values.name,
              is_default: values.is_default,
              primary_color: values.primary_color,
              secondary_color: values.secondary_color,
              font_family: values.font_family,
              logo_position: values.logo_position,
              header_text: values.header_text,
              footer_text: values.footer_text,
              show_payment_instructions: values.show_payment_instructions,
              payment_instructions: values.payment_instructions
            }
          ])
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: t("templateCreated"),
          description: t("templateCreatedDescription")
        });
        
        setSelectedTemplate(data as unknown as InvoiceTemplateSettings);
      } else {
        // If updating an existing template
        // Check if this template is being set as default
        if (values.is_default && !existingTemplate.is_default) {
          // Unset default on all templates
          await (supabase
            .from('invoice_templates') as any)
            .update({ is_default: false })
            .eq('company_id', companyId);
        }
        
        // Update template
        const { data, error } = await (supabase
          .from('invoice_templates') as any)
          .update({
            name: values.name,
            is_default: values.is_default,
            primary_color: values.primary_color,
            secondary_color: values.secondary_color,
            font_family: values.font_family,
            logo_position: values.logo_position,
            header_text: values.header_text,
            footer_text: values.footer_text,
            show_payment_instructions: values.show_payment_instructions,
            payment_instructions: values.payment_instructions
          })
          .eq('id', existingTemplate.id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: t("templateUpdated"),
          description: t("templateUpdatedDescription")
        });
        
        setSelectedTemplate(data as unknown as InvoiceTemplateSettings);
      }
      
      // Reload templates
      await loadTemplates();
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
    deleteTemplate,
    setDefaultTemplate,
    saveTemplate
  };
};

