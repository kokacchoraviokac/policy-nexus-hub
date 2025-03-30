
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { InvoiceTemplateSettings } from "@/types/finances";

// Define the type for template creation to make it clearer what's required
export type CreateTemplateData = Omit<InvoiceTemplateSettings, 'id' | 'created_at' | 'updated_at'>;

/**
 * Utility functions for invoice template CRUD operations
 */
export const useTemplateApi = () => {
  const supabase = useSupabaseClient();

  const fetchTemplates = async (companyId: string) => {
    const { data, error } = await supabase
      .from('invoice_templates' as any)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as unknown as InvoiceTemplateSettings[];
  };

  const createTemplate = async (companyId: string, templateData: Omit<CreateTemplateData, 'company_id'>) => {
    const { data, error } = await supabase
      .from('invoice_templates' as any)
      .insert([{ ...templateData, company_id: companyId }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as unknown as InvoiceTemplateSettings;
  };

  const updateTemplate = async (templateId: string, templateData: Partial<InvoiceTemplateSettings>) => {
    const { data, error } = await supabase
      .from('invoice_templates' as any)
      .update(templateData as any)
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as unknown as InvoiceTemplateSettings;
  };

  const deleteTemplate = async (templateId: string) => {
    const { error } = await supabase
      .from('invoice_templates' as any)
      .delete()
      .eq('id', templateId);
    
    if (error) {
      throw error;
    }
  };

  const updateAllTemplatesDefaultStatus = async (companyId: string, defaultValue: boolean) => {
    const { error } = await supabase
      .from('invoice_templates' as any)
      .update({ is_default: defaultValue } as any)
      .eq('company_id', companyId);
    
    if (error) {
      throw error;
    }
  };

  return {
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    updateAllTemplatesDefaultStatus,
  };
};
