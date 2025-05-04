
import { useState } from "react";
import { useSupabaseClient } from "./useSupabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationService } from "./useNotificationService";
import { toast } from "sonner";

export type CommunicationType = 'email' | 'sms' | 'call' | 'meeting' | 'note';
export type CommunicationDirection = 'outbound' | 'inbound';
export type CommunicationStatus = 'draft' | 'sent' | 'failed' | 'delivered' | 'opened';

export interface Communication {
  id: string;
  lead_id: string;
  subject: string;
  content: string;
  direction: CommunicationDirection;
  type: CommunicationType;
  status: CommunicationStatus;
  sent_by?: string;
  sent_at?: string;
  template_id?: string;
  created_at: string;
  updated_at: string;
  email_metadata?: {
    recipientEmail?: string;
    recipientName?: string;
    attachments?: string[];
    [key: string]: any;
  };
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useCommunications = (leadId?: string) => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { createNotification } = useNotificationService();

  const fetchCommunications = async (id: string = leadId) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fix the type issue by mapping to the correct type
      if (data) {
        const typedCommunications: Communication[] = data.map(item => ({
          ...item,
          direction: item.direction as CommunicationDirection,
          type: item.type as CommunicationType,
          status: item.status as CommunicationStatus,
          email_metadata: item.email_metadata || {}
        }));
        
        setCommunications(typedCommunications);
        return typedCommunications;
      }
      return [];
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast.error('Failed to load communications history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Fix the type issue by mapping to the correct type
      if (data) {
        const typedTemplates: Template[] = data.map(item => ({
          ...item,
          variables: Array.isArray(item.variables) 
            ? item.variables 
            : typeof item.variables === 'string' 
              ? JSON.parse(item.variables)
              : []
        }));
        
        setTemplates(typedTemplates);
        return typedTemplates;
      }
      return [];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Failed to load email templates');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (
    lead: { id: string; name: string; email: string; company_id: string },
    subject: string,
    content: string,
    templateId?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to send emails');
      return null;
    }

    setIsLoading(true);
    try {
      const payload = {
        leadId: lead.id,
        subject,
        content,
        companyId: lead.company_id,
        sentBy: user.id,
        templateId,
        recipientEmail: lead.email,
        recipientName: lead.name
      };

      const response = await supabase.functions.invoke('send-lead-email', {
        body: payload
      });

      if (response.error) throw new Error(response.error.message);
      
      toast.success('Email sent successfully');
      
      // Refresh communications list
      await fetchCommunications(lead.id);
      
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          ...template,
          created_by: user.id,
          company_id: user.companyId
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Template created successfully');
      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Template updated successfully');
      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Template deleted successfully');
      await fetchTemplates();
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a note or other communication type
  const createCommunication = async (
    leadId: string, 
    type: CommunicationType,
    subject: string,
    content: string,
    direction: CommunicationDirection = 'outbound'
  ) => {
    if (!user?.id || !user?.companyId) {
      toast.error('You must be logged in to create communications');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .insert({
          lead_id: leadId,
          subject,
          content,
          direction,
          type,
          status: type === 'note' ? 'sent' : 'draft',
          sent_by: user.id,
          sent_at: type === 'note' ? new Date().toISOString() : null,
          company_id: user.companyId
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created`);
      await fetchCommunications(leadId);
      return data;
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      toast.error(`Failed to create ${type}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    communications,
    templates,
    fetchCommunications,
    fetchTemplates,
    sendEmail: async (
      lead: { id: string; name: string; email: string; company_id: string },
      subject: string,
      content: string,
      templateId?: string
    ) => {
      if (!user) {
        toast.error('You must be logged in to send emails');
        return null;
      }

      setIsLoading(true);
      try {
        const payload = {
          leadId: lead.id,
          subject,
          content,
          companyId: lead.company_id,
          sentBy: user.id,
          templateId,
          recipientEmail: lead.email,
          recipientName: lead.name
        };

        const response = await supabase.functions.invoke('send-lead-email', {
          body: payload
        });

        if (response.error) throw new Error(response.error.message);
        
        toast.success('Email sent successfully');
        
        // Refresh communications list
        await fetchCommunications(lead.id);
        
        return response.data;
      } catch (error) {
        console.error('Error sending email:', error);
        toast.error('Failed to send email');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    createTemplate,
    updateTemplate,
    deleteTemplate: async (id: string) => {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('email_templates')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast.success('Template deleted successfully');
        await fetchTemplates();
        return true;
      } catch (error) {
        console.error('Error deleting template:', error);
        toast.error('Failed to delete template');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    createCommunication
  };
};
