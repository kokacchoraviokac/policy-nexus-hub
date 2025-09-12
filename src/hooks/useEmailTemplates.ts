import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  EmailTemplate,
  EmailTemplateWithVariables,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailTemplateFilters,
  EmailTemplatePreviewData,
  TemplateVariable,
  validateTemplateVariables,
  renderTemplate,
  getVariablesForCategory
} from '@/types/email-templates';

export const useEmailTemplates = (filters: EmailTemplateFilters = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch email templates with filters
  const {
    data: templates = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['email-templates', filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.is_default !== undefined) {
        query = query.eq('is_default', filters.is_default);
      }

      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to include parsed variables
      return data.map(template => ({
        ...template,
        variables: Array.isArray(template.variables) ? template.variables as unknown as TemplateVariable[] : []
      })) as EmailTemplateWithVariables[];
    },
    enabled: !!user?.id
  });

  // Create email template
  const createTemplate = useMutation({
    mutationFn: async (templateData: CreateEmailTemplateRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // Validate template variables
      const categoryVariables = getVariablesForCategory(templateData.category);
      const validationErrors = validateTemplateVariables(templateData.content, categoryVariables);
      
      if (validationErrors.length > 0) {
        throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
      }

      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          ...templateData,
          company_id: profile.company_id,
          created_by: user.id,
          variables: categoryVariables as any
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        variables: Array.isArray(data.variables) ? data.variables as unknown as TemplateVariable[] : []
      } as EmailTemplateWithVariables;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: t('templateCreated'),
        description: t('emailTemplateCreatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error creating email template:', error);
      toast({
        title: t('errorCreatingTemplate'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Update email template
  const updateTemplate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateEmailTemplateRequest }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // If content is being updated, validate variables
      if (updates.content && updates.category) {
        const categoryVariables = getVariablesForCategory(updates.category);
        const validationErrors = validateTemplateVariables(updates.content, categoryVariables);
        
        if (validationErrors.length > 0) {
          throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
        }

        updates.variables = categoryVariables as any;
      }

      const { data, error } = await supabase
        .from('email_templates')
        .update({
          ...updates,
          variables: updates.variables as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        variables: Array.isArray(data.variables) ? data.variables as unknown as TemplateVariable[] : []
      } as EmailTemplateWithVariables;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: t('templateUpdated'),
        description: t('emailTemplateUpdatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error updating email template:', error);
      toast({
        title: t('errorUpdatingTemplate'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Delete email template
  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: t('templateDeleted'),
        description: t('emailTemplateDeletedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error deleting email template:', error);
      toast({
        title: t('errorDeletingTemplate'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Duplicate email template
  const duplicateTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get the original template
      const { data: originalTemplate, error: fetchError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // Create duplicate with modified name
      const duplicateData = {
        name: `${originalTemplate.name} (Copy)`,
        category: originalTemplate.category,
        subject: originalTemplate.subject,
        content: originalTemplate.content,
        variables: originalTemplate.variables,
        is_default: false, // Duplicates are never default
        company_id: profile.company_id,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('email_templates')
        .insert(duplicateData)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        variables: Array.isArray(data.variables) ? data.variables as unknown as TemplateVariable[] : []
      } as EmailTemplateWithVariables;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: t('templateDuplicated'),
        description: t('emailTemplateDuplicatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error duplicating email template:', error);
      toast({
        title: t('errorDuplicatingTemplate'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Set template as default
  const setAsDefault = useMutation({
    mutationFn: async ({ templateId, category }: { templateId: string; category: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // First, unset all defaults for this category
      await supabase
        .from('email_templates')
        .update({ is_default: false })
        .eq('company_id', profile.company_id)
        .eq('category', category);

      // Then set the selected template as default
      const { data, error } = await supabase
        .from('email_templates')
        .update({ is_default: true })
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        variables: Array.isArray(data.variables) ? data.variables as unknown as TemplateVariable[] : []
      } as EmailTemplateWithVariables;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: t('defaultTemplateSet'),
        description: t('templateSetAsDefaultSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error setting default template:', error);
      toast({
        title: t('errorSettingDefault'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Preview template with sample data
  const previewTemplate = useCallback((template: EmailTemplateWithVariables, previewData: EmailTemplatePreviewData) => {
    try {
      const renderedSubject = renderTemplate(template.subject, previewData);
      const renderedContent = renderTemplate(template.content, previewData);
      
      return {
        subject: renderedSubject,
        content: renderedContent,
        isValid: true,
        errors: []
      };
    } catch (error) {
      return {
        subject: template.subject,
        content: template.content,
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Preview generation failed']
      };
    }
  }, []);

  // Validate template content
  const validateTemplate = useCallback((content: string, category: string) => {
    const categoryVariables = getVariablesForCategory(category);
    return validateTemplateVariables(content, categoryVariables);
  }, []);

  // Get template by ID
  const getTemplateById = useCallback((id: string) => {
    return templates.find(template => template.id === id);
  }, [templates]);

  // Get default template for category
  const getDefaultTemplate = useCallback((category: string) => {
    return templates.find(template => template.category === category && template.is_default);
  }, [templates]);

  // Get templates by category
  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter(template => template.category === category);
  }, [templates]);

  return {
    // Data
    templates,
    isLoading,
    error,

    // Mutations
    createTemplate: createTemplate.mutate,
    updateTemplate: updateTemplate.mutate,
    deleteTemplate: deleteTemplate.mutate,
    duplicateTemplate: duplicateTemplate.mutate,
    setAsDefault: setAsDefault.mutate,

    // Mutation states
    isCreating: createTemplate.isPending,
    isUpdating: updateTemplate.isPending,
    isDeleting: deleteTemplate.isPending,
    isDuplicating: duplicateTemplate.isPending,
    isSettingDefault: setAsDefault.isPending,

    // Utility functions
    previewTemplate,
    validateTemplate,
    getTemplateById,
    getDefaultTemplate,
    getTemplatesByCategory,
    refetch
  };
};

// Hook for getting a single template
export const useEmailTemplate = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['email-template', id],
    queryFn: async () => {
      if (!user?.id || !id) throw new Error('User not authenticated or ID missing');

      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        variables: Array.isArray(data.variables) ? data.variables as unknown as TemplateVariable[] : []
      } as EmailTemplateWithVariables;
    },
    enabled: !!user?.id && !!id
  });
};