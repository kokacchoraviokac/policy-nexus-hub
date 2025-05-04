
import { useState, useCallback } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Template } from '@/types/sales/templates';
import { Communication, CommunicationDirection, CommunicationType, CommunicationStatus, CommunicationMetadata } from '@/types/sales/communications';
import { toast } from 'sonner';

export interface CreateCommunicationParams {
  subject: string;
  content: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  status: CommunicationStatus;
  templateId?: string;
  metadata?: Record<string, any>;
}

export const useCommunications = (leadId?: string) => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCommunications = useCallback(async () => {
    if (!leadId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Map the database result to the Communication type
      const typedCommunications: Communication[] = data.map(item => ({
        id: item.id,
        lead_id: item.lead_id,
        company_id: item.company_id,
        subject: item.subject,
        content: item.content,
        direction: item.direction as CommunicationDirection,
        type: item.type as CommunicationType,
        status: item.status as CommunicationStatus,
        sent_by: item.sent_by,
        sent_at: item.sent_at,
        template_id: item.template_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        email_metadata: item.email_metadata as CommunicationMetadata
      }));
      
      setCommunications(typedCommunications);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [leadId, supabase]);

  const fetchTemplates = useCallback(async () => {
    if (!user?.company_id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('company_id', user.company_id);
        
      if (error) {
        throw error;
      }
      
      // Map the database result to the Template type
      const typedTemplates: Template[] = data.map(item => ({
        id: item.id,
        name: item.name,
        subject: item.subject,
        content: item.content,
        variables: Array.isArray(item.variables) ? item.variables : [],
        category: item.category,
        is_default: item.is_default,
        company_id: item.company_id,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setTemplates(typedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user?.company_id]);

  const createCommunication = useCallback(
    async ({ subject, content, type, direction, status, templateId, metadata }: CreateCommunicationParams) => {
      if (!leadId || !user?.company_id) {
        toast.error('Missing required information');
        return null;
      }
      
      setIsLoading(true);
      try {
        const newCommunication = {
          lead_id: leadId,
          company_id: user.company_id,
          subject,
          content,
          direction,
          type,
          status,
          sent_by: user.id,
          sent_at: new Date().toISOString(),
          template_id: templateId,
          email_metadata: metadata || {}
        };
        
        const { data, error } = await supabase
          .from('lead_communications')
          .insert(newCommunication)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        // Add the new communication to the list
        const typedCommunication: Communication = {
          id: data.id,
          lead_id: data.lead_id,
          company_id: data.company_id,
          subject: data.subject,
          content: data.content,
          direction: data.direction as CommunicationDirection,
          type: data.type as CommunicationType,
          status: data.status as CommunicationStatus,
          sent_by: data.sent_by,
          sent_at: data.sent_at,
          template_id: data.template_id,
          created_at: data.created_at,
          updated_at: data.updated_at,
          email_metadata: data.email_metadata as CommunicationMetadata
        };
        
        setCommunications(prev => [typedCommunication, ...prev]);
        return typedCommunication;
      } catch (error) {
        console.error('Error creating communication:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [leadId, supabase, user?.company_id, user?.id]
  );

  const createTemplate = useCallback(
    async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user?.company_id) {
        toast.error('Missing company information');
        return null;
      }
      
      setIsLoading(true);
      try {
        const newTemplate = {
          ...template,
          company_id: user.company_id,
          created_by: user.id
        };
        
        const { data, error } = await supabase
          .from('email_templates')
          .insert(newTemplate)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        // Convert database response to Template type
        const typedTemplate: Template = {
          id: data.id,
          name: data.name,
          subject: data.subject,
          content: data.content,
          variables: Array.isArray(data.variables) ? data.variables : [],
          category: data.category,
          is_default: data.is_default,
          company_id: data.company_id,
          created_by: data.created_by,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setTemplates(prev => [...prev, typedTemplate]);
        return typedTemplate;
      } catch (error) {
        console.error('Error creating template:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, user?.company_id, user?.id]
  );

  const updateTemplate = useCallback(
    async (id: string, templateChanges: Partial<Template>) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('email_templates')
          .update(templateChanges)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        // Convert database response to Template type
        const updatedTemplate: Template = {
          id: data.id,
          name: data.name,
          subject: data.subject,
          content: data.content,
          variables: Array.isArray(data.variables) ? data.variables : [],
          category: data.category,
          is_default: data.is_default,
          company_id: data.company_id,
          created_by: data.created_by,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        // Update the templates list
        setTemplates(prev =>
          prev.map(t => t.id === id ? updatedTemplate : t)
        );
        
        return updatedTemplate;
      } catch (error) {
        console.error('Error updating template:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('email_templates')
          .delete()
          .eq('id', id);
          
        if (error) {
          throw error;
        }
        
        // Remove the template from the list
        setTemplates(prev => prev.filter(t => t.id !== id));
        return true;
      } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  return {
    communications,
    templates,
    isLoading,
    fetchCommunications,
    fetchTemplates,
    createCommunication,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};
