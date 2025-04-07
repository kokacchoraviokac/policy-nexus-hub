
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Insurer } from '@/types/codebook';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function useInsurersCrud() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const companyId = user?.company_id || '';

  // Add a new insurer
  const addInsurer = useMutation({
    mutationFn: async (insurerData: Partial<Insurer>) => {
      const newInsurer = {
        ...insurerData,
        company_id: companyId,
        is_active: true,
      };
      
      // Ensure 'name' property is present for the insert operation
      if (!newInsurer.name) {
        throw new Error('Insurer name is required');
      }
      
      const { data, error } = await supabase
        .from('insurers')
        .insert(newInsurer as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurers'] });
      toast.success(t('insurerAddedSuccessfully'));
    },
    onError: (error: any) => {
      toast.error(t('failedToAddInsurer') + ': ' + error.message);
    },
  });

  // Update an existing insurer
  const updateInsurer = useMutation({
    mutationFn: async ({ 
      id, 
      updateData 
    }: { 
      id: string; 
      updateData: Partial<Insurer> 
    }) => {
      const { data, error } = await supabase
        .from('insurers')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('company_id', companyId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurers'] });
      toast.success(t('insurerUpdatedSuccessfully'));
    },
    onError: (error: any) => {
      toast.error(t('failedToUpdateInsurer') + ': ' + error.message);
    },
  });

  // Delete an insurer
  const deleteInsurer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurers'] });
      toast.success(t('insurerDeletedSuccessfully'));
    },
    onError: (error: any) => {
      toast.error(t('failedToDeleteInsurer') + ': ' + error.message);
    },
  });

  return {
    addInsurer: addInsurer.mutate,
    isAdding: addInsurer.isPending,
    updateInsurer: updateInsurer.mutate,
    isUpdating: updateInsurer.isPending,
    deleteInsurer: deleteInsurer.mutate,
    isDeleting: deleteInsurer.isPending,
  };
}
