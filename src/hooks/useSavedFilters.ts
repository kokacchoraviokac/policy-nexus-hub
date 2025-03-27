
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';
import { CodebookFilterState, SavedFilter } from '@/types/codebook';
import { useLanguage } from '@/contexts/LanguageContext';

export function useSavedFilters(entityType: 'insurers' | 'clients' | 'products') {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const {
    data: savedFilters,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['savedFilters', entityType, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('saved_filters')
        .select('*')
        .eq('entity_type', entityType)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching saved filters:', error);
        throw error;
      }
      
      return data as SavedFilter[];
    },
    enabled: !!user?.id
  });

  const saveFilterMutation = useMutation({
    mutationFn: async ({ name, filters }: { name: string, filters: CodebookFilterState }) => {
      if (!user?.id || !user?.companyId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('saved_filters')
        .insert({
          name,
          entity_type: entityType,
          filters,
          user_id: user.id,
          company_id: user.companyId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving filter:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType, user?.id] });
    }
  });

  const deleteFilterMutation = useMutation({
    mutationFn: async (filterId: string) => {
      const { error } = await supabase
        .from('saved_filters')
        .delete()
        .eq('id', filterId)
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error deleting filter:', error);
        throw error;
      }
      
      return filterId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType, user?.id] });
    }
  });

  const saveFilter = async (name: string, filters: CodebookFilterState) => {
    try {
      await saveFilterMutation.mutateAsync({ name, filters });
      return true;
    } catch (error) {
      console.error('Error saving filter:', error);
      return false;
    }
  };

  const deleteFilter = async (filterId: string) => {
    try {
      await deleteFilterMutation.mutateAsync(filterId);
      return true;
    } catch (error) {
      console.error('Error deleting filter:', error);
      return false;
    }
  };

  return {
    savedFilters: savedFilters || [],
    isLoading,
    isError,
    error,
    saveFilter,
    deleteFilter,
    isSaveDialogOpen,
    setIsSaveDialogOpen
  };
}
