
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Insurer } from '@/types/codebook';
import { useActivityLogger } from '@/utils/activityLogger';

export function useInsurersCrud(refetch: () => void) {
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const addInsurer = async (insurer: Omit<Insurer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('insurers')
        .insert(insurer)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log insurer creation
      if (data) {
        await logActivity({
          entity_type: "insurer",
          entity_id: data.id,
          action: "create",
          details: { fields: insurer }
        });
      }
      
      toast({
        title: 'Insurance company added',
        description: `Successfully added insurer: ${insurer.name}`,
      });
      
      refetch();
      return data;
    } catch (error: any) {
      console.error('Error adding insurer:', error);
      toast({
        title: 'Error adding insurance company',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateInsurer = async (id: string, updates: Partial<Insurer>) => {
    try {
      // Fetch original insurer to capture changes
      const { data: originalInsurer, error: fetchError } = await supabase
        .from('insurers')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Track changes for activity log
      const changes: Record<string, { old: any; new: any }> = {};
      Object.keys(updates).forEach(key => {
        const typedKey = key as keyof Insurer;
        if (updates[typedKey] !== originalInsurer[typedKey]) {
          changes[key] = {
            old: originalInsurer[typedKey],
            new: updates[typedKey]
          };
        }
      });
      
      const { error } = await supabase
        .from('insurers')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Log insurer update
      await logActivity({
        entity_type: "insurer",
        entity_id: id,
        action: "update",
        details: { changes }
      });
      
      toast({
        title: 'Insurance company updated',
        description: 'Insurer information has been updated successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating insurer:', error);
      toast({
        title: 'Error updating insurance company',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteInsurer = async (id: string) => {
    try {
      // Fetch insurer details for activity log
      const { data: insurer, error: fetchError } = await supabase
        .from('insurers')
        .select('name, company_id')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Log insurer deletion
      await logActivity({
        entity_type: "insurer",
        entity_id: id,
        action: "delete",
        details: { name: insurer.name }
      });
      
      toast({
        title: 'Insurance company deleted',
        description: 'Insurer has been deleted successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting insurer:', error);
      toast({
        title: 'Error deleting insurance company',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    addInsurer,
    updateInsurer,
    deleteInsurer
  };
}
