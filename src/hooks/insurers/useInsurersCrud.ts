
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Insurer } from "@/types/codebook";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActivityLogger } from "@/utils/activityLogger";
import { EntityType } from "@/types/common";

export function useInsurersCrud(onSuccess: () => void) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { logActivity } = useActivityLogger();

  // Add new insurer
  const addInsurerMutation = useMutation({
    mutationFn: async (insurer: Partial<Insurer>) => {
      // Create a new insurer record
      const { data, error } = await supabase
        .from('insurers')
        .insert(insurer)
        .select('*')
        .single();

      if (error) throw error;

      // Log the activity
      await logActivity({
        entity_type: EntityType.INSURER,
        entity_id: data.id,
        action: 'create',
        details: {
          name: data.name,
          contact_person: data.contact_person
        }
      });

      return data;
    },
    onSuccess: () => {
      toast({
        title: t('insurerAddedSuccess'),
        description: t('insurerAddedDescription'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('insurerAddedError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update existing insurer
  const updateInsurerMutation = useMutation({
    mutationFn: async ({
      id,
      updateData
    }: {
      id: string;
      updateData: Partial<Insurer>;
    }) => {
      // Update the insurer record
      const { data, error } = await supabase
        .from('insurers')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      // Log the activity
      await logActivity({
        entity_type: EntityType.INSURER,
        entity_id: id,
        action: 'update',
        details: updateData
      });

      return data;
    },
    onSuccess: () => {
      toast({
        title: t('insurerUpdatedSuccess'),
        description: t('insurerUpdatedDescription'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('insurerUpdatedError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete insurer
  const deleteInsurerMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get insurer data before deletion for logging
      const { data: insurer, error: fetchError } = await supabase
        .from('insurers')
        .select('name')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the insurer
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log the activity
      await logActivity({
        entity_type: EntityType.INSURER,
        entity_id: id,
        action: 'delete',
        details: {
          name: insurer.name
        }
      });

      return true;
    },
    onSuccess: () => {
      toast({
        title: t('insurerDeletedSuccess'),
        description: t('insurerDeletedDescription'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('insurerDeletedError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    addInsurer: addInsurerMutation.mutateAsync,
    updateInsurer: updateInsurerMutation.mutateAsync,
    deleteInsurer: deleteInsurerMutation.mutateAsync,
    isAddingInsurer: addInsurerMutation.isLoading,
    isUpdatingInsurer: updateInsurerMutation.isLoading,
    isDeletingInsurer: deleteInsurerMutation.isLoading,
  };
}
